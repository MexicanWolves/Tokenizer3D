/**
 * Servicio para consumir la API de embeddings de tokens
 */
/**
 * Obtiene los embeddings 3D para un texto dado
 * @param {string} text - El texto a tokenizar y obtener embeddings
 * @returns {Promise<{text: string, tokens: Array<{token: string, vector_3d: number[]}>}>}
 */
export const getTextEmbeddings = async (text) => {
  try {
    const response = await fetch("https://apic.keiwv.dev/embed-text", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error fetching embeddings:');
      throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching embeddings:', error);
    throw error;
  }
};

/**
 * Transforma los datos de la API a formato para visualización 3D
 * @param {Array<{token: string, vector_3d: number[]}>} tokens - Array de tokens con sus vectores
 * @returns {{nodes: Array, links: Array}}
 */
export const transformTokensToGraphData = (tokens) => {
  const SCALE_FACTOR = 100; // Multiplicador para aumentar la distancia entre nodos
  
  const nodes = tokens.map((tokenData, index) => ({
    id: `${tokenData.token}_${index}`,
    label: tokenData.token,
    // Usar fx, fy, fz para fijar las posiciones y evitar la simulación de física
    // Multiplicar por SCALE_FACTOR para aumentar la distancia
    fx: tokenData.vector_3d[0] * SCALE_FACTOR,
    fy: tokenData.vector_3d[1] * SCALE_FACTOR,
    fz: tokenData.vector_3d[2] * SCALE_FACTOR,
    group: tokenData.token === '[CLS]' || tokenData.token === '[SEP]' ? 1 : 2,
    color: tokenData.token === '[CLS]' || tokenData.token === '[SEP]' ? '#ff6b6b' : '#8b5cf6',
  }));

  // Crear enlaces entre tokens consecutivos
  const links = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    links.push({
      source: nodes[i].id,
      target: nodes[i + 1].id,
      value: 1,
    });
  }

  return { nodes, links };
};

/**
 * Calcula la similitud coseno entre dos vectores
 */
export const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 * Calcula la distancia euclidiana entre dos vectores
 */
export const euclideanDistance = (vecA, vecB) => {
  return Math.sqrt(
    vecA.reduce((sum, a, i) => sum + Math.pow(a - vecB[i], 2), 0)
  );
};

/**
 * Compara embeddings de BERT y Word2Vec
 */
export const compareEmbeddings = (bertTokens, word2vecTokens) => {
  const comparisons = [];
  const minLength = Math.min(bertTokens.length, word2vecTokens.length);
  
  for (let i = 0; i < minLength; i++) {
    const similarity = cosineSimilarity(
      bertTokens[i].vector_3d,
      word2vecTokens[i].vector_3d
    );
    
    comparisons.push({
      token: bertTokens[i].token,
      similarity: similarity,
      bertVector: bertTokens[i].vector_3d,
      word2vecVector: word2vecTokens[i].vector_3d
    });
  }
  
  const avgSimilarity = comparisons.reduce((sum, c) => sum + c.similarity, 0) / comparisons.length;
  
  return {
    comparisons,
    avgSimilarity
  };
};

/**
 * Calcula divergencia semántica entre tokens usando distancias
 */
export const calculateDivergence = (bertTokens, word2vecTokens) => {
  const divergences = [];
  const minLength = Math.min(bertTokens.length, word2vecTokens.length);
  
  for (let i = 0; i < minLength; i++) {
    const euclideanDist = euclideanDistance(
      bertTokens[i].vector_3d,
      word2vecTokens[i].vector_3d
    );
    
    const cosineDist = 1 - cosineSimilarity(
      bertTokens[i].vector_3d,
      word2vecTokens[i].vector_3d
    );
    
    divergences.push({
      token: bertTokens[i].token,
      euclideanDistance: euclideanDist,
      cosineDistance: cosineDist
    });
  }
  
  const avgEuclidean = divergences.reduce((sum, d) => sum + d.euclideanDistance, 0) / divergences.length;
  const avgCosine = divergences.reduce((sum, d) => sum + d.cosineDistance, 0) / divergences.length;
  
  return {
    divergences,
    avgEuclidean,
    avgCosine
  };
};

/**
 * Implementación de K-Means Clustering
 * @param {Array} tokens - Array de tokens con vectores 3D
 * @param {number} k - Número de clusters (por defecto 3)
 * @param {number} maxIterations - Máximo de iteraciones (por defecto 100)
 * @returns {Array} Tokens con cluster asignado y distancia al centroide
 */
export const kMeansClustering = (tokens, k = 3, maxIterations = 100) => {
  const vectors = tokens.map(t => t.vector_3d);
  const actualK = Math.min(k, vectors.length);
  
  // Inicializar centroides aleatoriamente (método K-Means++)
  let centroids = [];
  const indices = new Set();
  
  // Primer centroide aleatorio
  const firstIdx = Math.floor(Math.random() * vectors.length);
  centroids.push([...vectors[firstIdx]]);
  indices.add(firstIdx);
  
  // Siguientes centroides con K-Means++
  while (centroids.length < actualK) {
    const distances = vectors.map(vec => {
      return Math.min(...centroids.map(centroid => euclideanDistance(vec, centroid)));
    });
    
    const sumDistances = distances.reduce((sum, d) => sum + d, 0);
    let rand = Math.random() * sumDistances;
    
    for (let i = 0; i < vectors.length; i++) {
      if (indices.has(i)) continue;
      rand -= distances[i];
      if (rand <= 0) {
        centroids.push([...vectors[i]]);
        indices.add(i);
        break;
      }
    }
  }
  
  let assignments = new Array(vectors.length).fill(0);
  let converged = false;
  
  // Iterar hasta convergencia o máximo de iteraciones
  for (let iter = 0; iter < maxIterations && !converged; iter++) {
    // Asignar puntos al centroide más cercano
    const newAssignments = vectors.map(vec => {
      let minDist = Infinity;
      let bestCluster = 0;
      
      centroids.forEach((centroid, clusterIdx) => {
        const dist = euclideanDistance(vec, centroid);
        if (dist < minDist) {
          minDist = dist;
          bestCluster = clusterIdx;
        }
      });
      
      return bestCluster;
    });
    
    // Verificar convergencia
    converged = JSON.stringify(assignments) === JSON.stringify(newAssignments);
    assignments = newAssignments;
    
    if (converged) break;
    
    // Recalcular centroides
    centroids = centroids.map((_, clusterIdx) => {
      const clusterPoints = vectors.filter((_, i) => assignments[i] === clusterIdx);
      
      if (clusterPoints.length === 0) return centroids[clusterIdx];
      
      // Calcular media de cada dimensión
      return clusterPoints[0].map((_, dimIdx) => {
        return clusterPoints.reduce((sum, point) => sum + point[dimIdx], 0) / clusterPoints.length;
      });
    });
  }
  
  // Calcular inercia (suma de distancias cuadradas a los centroides)
  const inertia = vectors.reduce((sum, vec, i) => {
    const dist = euclideanDistance(vec, centroids[assignments[i]]);
    return sum + dist * dist;
  }, 0);
  
  // Retornar tokens con información de clustering
  return {
    tokens: tokens.map((token, i) => ({
      ...token,
      cluster: assignments[i],
      distanceToCentroid: euclideanDistance(token.vector_3d, centroids[assignments[i]])
    })),
    centroids,
    inertia,
    clusterSizes: centroids.map((_, idx) => assignments.filter(a => a === idx).length)
  };
};
