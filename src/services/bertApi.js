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
    const response = await fetch("/bert/embed", {
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
  const nodes = tokens.map((tokenData, index) => ({
    id: `${tokenData.token}_${index}`,
    label: tokenData.token,
    x: tokenData.vector_3d[0],
    y: tokenData.vector_3d[1],
    z: tokenData.vector_3d[2],
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
