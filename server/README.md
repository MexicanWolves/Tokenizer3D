# Word Similarity API

A FastAPI-based web service that provides semantic word similarity using Word2Vec embeddings.

## Quick Start

### 1. Install Dependencies

```cmd
pip install -r requirements.txt
```

### 2. Start the API Server

```cmd
uvicorn main:app --host 0.0.0.0 --port 3000 --reload
```

The server will:

- Download the Word2Vec model (~1.5GB) on first run
- Load the model into memory (3M vocabulary)
- Start serving requests on http://localhost:3000

### 3. Test the API

```cmd
python test_api.py
```

## API Endpoints

### `POST /similar-words`

Find similar words for a list of input words.

**Request:**

```json
{
  "words": ["dog", "computer", "happy"],
  "top_n": 10
}
```

**Response:**

```json
{
  "results": [
    {
      "input_word": "dog",
      "similar_words": [
        { "word": "dogs", "similarity": 0.769 },
        { "word": "puppy", "similarity": 0.678 },
        { "word": "pet", "similarity": 0.634 }
      ],
      "success": true
    }
  ]
}
```

### `POST /word-clusters`

Get 3D clustering data for multiple words and their similar words (like the Jupyter notebook but extended).

**Request:**

```json
{
  "target_word": "fish",
  "words": ["car", "ocean", "computer"]
}
```

**Response:**

```json
{
  "nodes": [
    {
      "id": "book",
      "group": 2
    },
    {
      "id": "computer",
      "group": 2
    },
    {
      "id": "apple",
      "group": 2
    },
    {
      "id": "cats",
      "group": 1
    }
  ],
  "links": [
    {
      "source": "apple",
      "target": "cats",
      "value": 0.12374375015497208
    },
    {
      "source": "book",
      "target": "cats",
      "value": 0.06386274844408035
    },
    {
      "source": "computer",
      "target": "cats",
      "value": 0.07611062377691269
    }
  ]
}
```

### `GET /health`

Check if the model is loaded and ready.

**Response:**

```json
{
  "status": "healthy",
  "model_loaded": true,
  "vocabulary_size": 3000000
}
```

## Configuration

- **Port**: Change port in the uvicorn command (default: 3000)
- **Host**: Currently set to `0.0.0.0` (all interfaces)
- **Model**: Uses `word2vec-google-news-300` (300-dimensional vectors)

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:3000/docs
- **ReDoc**: http://localhost:3000/redoc

## Troubleshooting

### Model Loading Issues

- First startup takes time to download the model
- Check logs for download progress
- Ensure you have ~2GB free disk space

### Dependency Issues

- Use Python 3.8-3.11
- Install exact versions from requirements.txt
- If scipy issues occur, try: `pip install scipy==1.10.1`

### Memory Usage

- Model requires ~4GB RAM when loaded
- Restart if memory issues occur

## Example Usage (Python)

```python
import requests

# Test similar words
response = requests.post("http://localhost:3000/similar-words", json={
    "words": ["ocean", "mountain"],
    "top_n": 5
})

data = response.json()
for result in data["results"]:
    print(f"Similar to '{result['input_word']}':")
    for word in result["similar_words"]:
        print(f"  - {word['word']}: {word['similarity']:.3f}")
```

## Development

Start with auto-reload for development:

```cmd
uvicorn main:app --reload --port 3000
```

The server will automatically restart when you modify the code.
