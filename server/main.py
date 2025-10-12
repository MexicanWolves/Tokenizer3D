from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import List, Dict, Optional
import gensim.downloader as api
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
import logging
from fastapi.middleware.cors import CORSMiddleware



# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variable to store the model
model = None

# Pydantic models for request and response
class WordRequest(BaseModel):
    words: List[str]
    top_n: Optional[int] = 200  # Number of similar words to find per word

class SimilarWord(BaseModel):
    word: str
    similarity: float

class WordSimilarity(BaseModel):
    input_word: str
    similar_words: List[SimilarWord]
    success: bool
    error_message: Optional[str] = None

class WordResponse(BaseModel):
    results: List[WordSimilarity]

class MultiWordClustersRequest(BaseModel):
    words: List[str]
    top_n: Optional[int] = 200  # Number of similar words to find per word
    n_clusters: Optional[int] = 5
class WordAnalisysRequest(BaseModel):
    singleWord: str
    wordList: List[str]

class GetAllWordsRequest(BaseModel):
    limit: Optional[int] = 200  # Number of words to return
    n_clusters: Optional[int] = 5  # Number of clusters for KMeans
    similarity_threshold: Optional[float] = 0.3  # Threshold for links


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the model on startup"""
    global model
    
    logger.info("Starting FastAPI application...")
    logger.info("Loading Word2Vec model...")
    
    try:
        # Check if model is already downloaded by trying to load it
        model = api.load("word2vec-google-news-300")
        logger.info(f"Model loaded successfully! Vocabulary size: {len(model.index_to_key)}")
    except Exception as e:
        logger.error(f"Failed to load model: {str(e)}")
        logger.info("Model not found, downloading (this may take a while - ~1.5GB)...")
        try:
            model = api.load("word2vec-google-news-300")
            logger.info(f"Model downloaded and loaded! Vocabulary size: {len(model.index_to_key)}")
        except Exception as download_error:
            logger.error(f"Failed to download model: {str(download_error)}")
            model = None
    
    yield
    
    logger.info("🔄 Shutting down FastAPI application...")

# Create FastAPI app with lifespan events
app = FastAPI(
    title="Word Similarity API",
    description="API for finding semantically similar words using Word2Vec embeddings",
    version="1.0.0",
    lifespan=lifespan
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Word Similarity API is running!", "model_loaded": model is not None}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy" if model is not None else "unhealthy",
        "model_loaded": model is not None,
        "vocabulary_size": len(model.index_to_key) if model else 0
    }

@app.post("/similar-words", response_model=WordResponse)
async def find_similar_words(request: WordRequest):
    """
    Find similar words for a list of input words using Word2Vec embeddings.
    
    Args:
        request: WordRequest containing list of words and optional top_n parameter
        
    Returns:
        WordResponse containing similar words for each input word
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Word2Vec model is not loaded. Please try again later.")
    
    results = []
    
    for word in request.words:
        try:
            # Check if word exists in vocabulary
            if word not in model.key_to_index:
                results.append(WordSimilarity(
                    input_word=word,
                    similar_words=[],
                    success=False,
                    error_message=f"Word '{word}' not found in vocabulary"
                ))
                continue
            
            # Find similar words
            similar_words_raw = model.most_similar(word, topn=request.top_n)
            
            # Convert to SimilarWord objects
            similar_words = [
                SimilarWord(word=w, similarity=float(similarity)) 
                for w, similarity in similar_words_raw
            ]
            
            results.append(WordSimilarity(
                input_word=word,
                similar_words=similar_words,
                success=True
            ))
            
        except Exception as e:
            logger.error(f"Error processing word '{word}': {str(e)}")
            results.append(WordSimilarity(
                input_word=word,
                similar_words=[],
                success=False,
                error_message=str(e)
            ))
    
    return WordResponse(results=results)

from sklearn.cluster import KMeans
import numpy as np

@app.post("/word-clusters")
async def create_word_clusters(request: WordAnalisysRequest):
    """
    Create 3D clusters of similar words for multiple input words.

    Returns a network where words are clustered based on embeddings and linked by similarity.
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Word2Vec model is not loaded. Please try again later.")

    words = [request.singleWord] + request.wordList

    # Check for missing words
    missing_words = [w for w in words if w not in model.key_to_index]
    if missing_words:
        raise HTTPException(
            status_code=404,
            detail=f"The following words were not found in the vocabulary: {', '.join(missing_words)}"
        )

    # Get embeddings for all words
    embeddings = np.array([model[w] for w in words])

    # Cluster words (adjust n_clusters if desired)
    n_clusters = request.n_clusters if hasattr(request, "n_clusters") else min(len(words), 5)
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    labels = kmeans.fit_predict(embeddings)

    # Create nodes with cluster as group
    nodes = [{"id": w, "group": int(labels[i])} for i, w in enumerate(words)]

    # Create links based on similarity threshold
    threshold = 0.3
    links = []
    for i, w1 in enumerate(words):
        for j, w2 in enumerate(words):
            if i >= j:
                continue
            similarity = model.similarity(w1, w2)
            if similarity >= threshold:
                links.append({
                    "source": w1,
                    "target": w2,
                    "value": round(similarity * 10)
                })

    return {"nodes": nodes, "links": links}

@app.post("/get-all-words")
async def get_all_words(request: GetAllWordsRequest):
    """
    Retrieve a subset of words from the Word2Vec model's vocabulary and return them
    in the same nodes+links format as /word-clusters.
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Word2Vec model is not loaded. Please try again later.")

    # Take the top `limit` words
    limit = min(request.limit, len(model.index_to_key))
    words = model.index_to_key[:limit]

    # Get embeddings
    embeddings = np.array([model[w] for w in words])

    # Cluster words
    n_clusters = request.n_clusters if request.n_clusters else min(len(words), 5)
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    labels = kmeans.fit_predict(embeddings)

    # Create nodes with cluster as group
    nodes = [{"id": w, "group": int(labels[i])} for i, w in enumerate(words)]

    # Create links based on similarity threshold
    threshold = request.similarity_threshold
    links = []
    for i, w1 in enumerate(words):
        for j, w2 in enumerate(words):
            if i >= j:
                continue
            similarity = model.similarity(w1, w2)
            if similarity >= threshold:
                links.append({
                    "source": w1,
                    "target": w2,
                    "value": round(similarity * 100)
                })

    return {"nodes": nodes, "links": links}
    

# Configure CORDS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)