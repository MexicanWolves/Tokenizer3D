import Graph3D from "../components/Graph3D";

const ThreeD = ({ singleWord, multipleWords, onNavigate }) => {
  // Construir datos del grafo
  const buildGraphData = () => {
    const nodes = [];
    const links = [];

    if (singleWord && multipleWords && multipleWords.length > 0) {
      // Caso 1: Palabra central conectada a múltiples palabras
      nodes.push({ id: singleWord, group: 1, color: "#8b5cf6" }); // Violeta para nodo central

      multipleWords.forEach((wordObj, index) => {
        const word = wordObj.value || wordObj.label || wordObj;
        nodes.push({ id: word, group: 2, color: "#3b82f6" }); // Azul para nodos secundarios
        links.push({ source: singleWord, target: word, value: 1 });
      });
    } else if (multipleWords && multipleWords.length > 0) {
      // Caso 2: Cada palabra con 10 nodos similares simulados
      multipleWords.forEach((wordObj, wordIndex) => {
        const word = wordObj.value || wordObj.label || wordObj;
        nodes.push({ id: word, group: 1, color: "#8b5cf6" });

        for (let i = 1; i <= 10; i++) {
          const simWord = `${word}_sim${i}`;
          nodes.push({ id: simWord, group: 2, color: "#3b82f6" });
          links.push({ source: word, target: simWord, value: 0.8 - i * 0.05 });
        }
      });
    }

    return { nodes, links };
  };

  const graphData = buildGraphData();

  return (
    <div className="absolute inset-0 z-5 bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Botón Back */}
      <button
        onClick={() => onNavigate && onNavigate('home')}
        className="absolute top-6 left-6 z-50 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-lg text-white font-semibold transition-all hover:scale-105 flex items-center gap-2 pointer-events-auto"
      >
        <span className="text-xl">←</span>
        Back
      </button>

      {/* Grafo 3D */}
      <Graph3D data={graphData} />
    </div>
  );
};

export default ThreeD;