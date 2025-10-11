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
import os

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

@app.post("/word-clusters")
async def create_word_clusters(request: MultiWordClustersRequest):
    """
    Create 3D clusters of similar words for multiple input words.
    
    Args:
        request: MultiWordClustersRequest containing list of words, top_n, and n_clusters
        
    Returns:
        Dictionary with clustering data for visualization including all input words and their similar words
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Word2Vec model is not loaded. Please try again later.")
    
    try:
        # Validate that all input words exist in vocabulary
        missing_words = []
        for word in request.words:
            if word not in model.key_to_index:
                missing_words.append(word)
        
        if missing_words:
            raise HTTPException(
                status_code=404, 
                detail=f"Words not found in vocabulary: {missing_words}"
            )
        
        # Collect all words: input words + their similar words
        all_words = []
        word_groups = {}  # Track which group each word belongs to
        
        for input_word in request.words:
            # Find similar words for this input word
            similar_words = [w for w, _ in model.most_similar(input_word, topn=request.top_n)]
            group_words = [input_word] + similar_words
            
            # Track the group for each word
            for word in group_words:
                if word not in all_words:
                    all_words.append(word)
                    word_groups[word] = input_word
        
        # Get vectors for all unique words and reduce to 3D
        vectors = np.array([model[w] for w in all_words])
        pca = PCA(n_components=3)
        reduced = pca.fit_transform(vectors)
        
        # Cluster all words together
        kmeans = KMeans(n_clusters=request.n_clusters, random_state=0)
        clusters = kmeans.fit_predict(reduced)
        
        # Prepare data for visualization
        nodes = []
        for i, w in enumerate(all_words):
            nodes.append({
                "id": w,
                "group": int (clusters[i]), # El grupo es el id del cluster
            })
        
        # Lista de links asociados
        links  = []
        for input_word in request.words:
            if word not in request.words:
                source_word = word
                target_word = word_groups[word]

                similarity = model.similarity(source_word,target_word)

                links.append({
                    "source":source_word,
                    "target":target_word,
                    "value": float(similarity)
                })
        
        return {
            "nodes": nodes,
            "links": links,
        }
        
    except Exception as e:
        logger.error(f"Error creating clusters for words '{request.words}': {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)