import { useState, useEffect } from "react";
import Graph3D from "../components/Graph3D";
import { Input } from "../components/ui/input";
import MultipleSelectorCreatable from "../components/spectrumui/multiple-selector-creatable";
import { ShinyButton } from "../components/ui/shiny-button";

// Listado de palabras para la función aleatoria
const randomWordPool = [
  'technology', 'science', 'art', 'music', 'nature', 'future', 'space', 'ocean', 'mountain', 'river',
  'city', 'love', 'friendship', 'family', 'health', 'mind', 'body', 'soul', 'spirit', 'dream',
  'journey', 'adventure', 'discovery', 'innovation', 'creativity', 'design', 'code', 'data', 'network',
  'galaxy', 'planet', 'star', 'sun', 'moon', 'earth', 'fire', 'water', 'air', 'light', 'darkness',
  'cat', 'dog', 'bird', 'fish', 'tree', 'flower', 'rain', 'snow', 'wind', 'storm'
];

const ThreeD = ({ singleWord: initialSingleWord, multipleWords: initialMultipleWords, onNavigate }) => {
  // --- ESTADOS ---
  const [mode, setMode] = useState('CONNECT'); // 'CONNECT' o 'EXPAND'
  const [singleWord, setSingleWord] = useState(initialSingleWord);
  const [multipleWords, setMultipleWords] = useState(initialMultipleWords);
  
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- LÓGICA DE API ---
  const fetchGraphData = async () => {
    const wordList = multipleWords.map((w) => w.value || w.label || w);
    if (wordList.length === 0) {
      setError("Please add at least one word to the list.");
      setGraphData({ nodes: [], links: [] });
      return;
    }
    if (mode === 'CONNECT' && !singleWord) {
      setError("Please provide a single word for CONNECT mode.");
      setGraphData({ nodes: [], links: [] });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data;
      if (mode === 'CONNECT') {
        const response = await fetch("http://localhost:8000/word-clusters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ singleWord, wordList }),
        });
        if (!response.ok) throw new Error((await response.json()).detail || 'Failed to fetch');
        data = await response.json();
      } else { // EXPAND mode
        // --- CORRECCIÓN AQUÍ ---
        // Llamar a la API para cada palabra y esperar todos los resultados
        const promises = wordList.map(word => 
          fetch("http://localhost:8000/similar-words", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word: word, topn: 5 }),
          }).then(res => {
            if (!res.ok) throw new Error(`Failed to get similar words for "${word}"`);
            return res.json();
          })
        );
        
        const similarWordsData = await Promise.all(promises);
        data = transformExpandDataToGraph(similarWordsData);
      }
      setGraphData(data);
    } catch (err) {
      console.error("Error fetching graph data:", err);
      setError(err.message.includes("fetch") ? "Connection refused. Is the server running?" : err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- TRANSFORMACIÓN DE DATOS PARA MODO EXPAND ---
  const transformExpandDataToGraph = (apiResponse) => {
    const nodes = [];
    const links = [];
    const existingNodes = new Set();

    apiResponse.forEach(item => {
      const sourceWord = item.word;
      // Añadir nodo principal si no existe
      if (!existingNodes.has(sourceWord)) {
        nodes.push({ id: sourceWord, group: 1, color: "#8b5cf6" });
        existingNodes.add(sourceWord);
      }

      item.similar_words.forEach(sim => {
        const targetWord = sim.word;
        // Añadir nodo similar si no existe
        if (!existingNodes.has(targetWord)) {
          nodes.push({ id: targetWord, group: 2, color: "#3b82f6" });
          existingNodes.add(targetWord);
        }
        // Añadir enlace
        links.push({ source: sourceWord, target: targetWord, value: sim.similarity });
      });
    });

    return { nodes, links };
  };

  // Cargar datos iniciales solo una vez
  useEffect(() => {
    fetchGraphData();
  }, []); // El array vacío asegura que solo se ejecute al montar

  const handleSingleWordChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    setSingleWord(value);
  };

  // Función para añadir palabras aleatorias
  const addRandomWords = () => {
    const currentWordValues = new Set(multipleWords.map(w => w.value));
    const availableWords = randomWordPool.filter(word => !currentWordValues.has(word));
    
    const shuffled = availableWords.sort(() => 0.5 - Math.random());
    const wordsToAdd = shuffled.slice(0, 10);

    const newWordObjects = wordsToAdd.map(word => ({ label: word, value: word }));
    setMultipleWords(prevWords => [...prevWords, ...newWordObjects]);
  };

  return (
    <div className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none px-4 py-4">
      <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 border border-purple-400/20 w-full max-w-7xl h-full max-h-[95vh] lg:h-[85vh] lg:max-h-[900px]">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full h-full">
          {/* Columna Izquierda: Grafo */}
          <div className="h-1/2 lg:h-full w-full lg:w-2/3 bg-black/30 rounded-xl overflow-hidden pointer-events-auto relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-xl animate-pulse z-10">
                Loading...
              </div>
            )}
            {error && !loading && (
               <div className="absolute inset-0 flex items-center justify-center text-red-400 text-center p-4 z-10">
                <div>
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              </div>
            )}
            <Graph3D data={graphData} />

            {/* Bloque de Instrucciones */}
            <div className="absolute bottom-2 left-2 z-20 p-3 bg-black/50 backdrop-blur-sm rounded-lg text-white text-xs pointer-events-none max-w-[200px]">
              <h4 className="font-bold mb-1 text-sm">Controls</h4>
              <ul className="space-y-1">
                <li><span className="font-semibold text-purple-300">Rotate:</span> Left-click + Drag</li>
                <li><span className="font-semibold text-purple-300">Pan:</span> Right-click + Drag</li>
                <li><span className="font-semibold text-purple-300">Zoom:</span> Scroll Wheel</li>
                <li><span className="font-semibold text-purple-300">Select:</span> Click on a node</li>
              </ul>
            </div>
          </div>

          {/* Columna Derecha: Controles */}
          <div className="h-1/2 lg:h-full w-full lg:w-1/3 flex flex-col gap-4 pointer-events-auto overflow-y-auto p-2 rounded-lg">
            <h2 className="text-xl md:text-2xl font-bold text-white shrink-0" style={{ fontFamily: "Michroma, sans-serif" }}>Playground</h2>
            
            {/* --- INTERRUPTOR DE MODO --- */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-md font-medium">Mode</label>
              <div className="flex bg-black/30 p-1 rounded-lg border border-purple-400/30">
                <button onClick={() => setMode('CONNECT')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${mode === 'CONNECT' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-white/10'}`}>CONNECT</button>
                <button onClick={() => setMode('EXPAND')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${mode === 'EXPAND' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-white/10'}`}>EXPAND</button>
              </div>
            </div>

            {/* --- INPUTS CONDICIONALES --- */}
            <div className={`flex flex-col gap-2 transition-opacity duration-300 ${mode === 'CONNECT' ? 'opacity-100' : 'opacity-50'}`}>
              <label className="text-white text-md font-medium">Single Word</label>
              <Input
                type="text"
                value={singleWord}
                onChange={handleSingleWordChange}
                placeholder="Central word..."
                disabled={mode !== 'CONNECT'}
                className="bg-white/10 backdrop-blur-md border-purple-400/40 text-white placeholder:text-purple-200/60 focus-visible:ring-purple-500 focus-visible:border-purple-400 h-10 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-white text-md font-medium">{mode === 'CONNECT' ? 'Words to Connect' : 'Words to Expand'}</label>
                <button onClick={addRandomWords} className="px-3 py-1 text-xs cursor-pointer bg-purple-500/30 hover:bg-purple-500/50 border border-purple-400/50 rounded-md text-purple-200 transition-colors">✨ Add Random</button>
              </div>
              <MultipleSelectorCreatable value={multipleWords} onChange={setMultipleWords} />
            </div>

            <div className="mt-auto pt-4">
              <ShinyButton onClick={fetchGraphData} disabled={loading} className="w-full py-3 text-lg font-semibold">{loading ? "Loading..." : "Visualize"}</ShinyButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeD;