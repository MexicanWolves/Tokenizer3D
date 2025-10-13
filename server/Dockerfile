FROM python:3.11-slim

WORKDIR /app

# Copia e instala dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código
COPY . .

# 🔹 PRECARGAR MODELO WORD2VEC DURANTE EL BUILD
RUN python -c "import gensim.downloader as api; api.load('word2vec-google-news-300')"

# Exponer puerto
EXPOSE 8000

# Comando para iniciar FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
