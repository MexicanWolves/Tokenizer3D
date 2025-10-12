import { useState, useEffect } from "react";
import Graph3D from "../components/Graph3D";
import { Input } from "../components/ui/input";
import MultipleSelectorCreatable from "../components/spectrumui/multiple-selector-creatable";
import { ShinyButton } from "../components/ui/shiny-button";

const ThreeD = ({ singleWord: initialSingleWord, multipleWords: initialMultipleWords, onNavigate }) => {
  // Estado local para la interacción en vivo
  const [singleWord, setSingleWord] = useState(initialSingleWord);
  const [multipleWords, setMultipleWords] = useState(initialMultipleWords);
  
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para llamar a la API, ahora reutilizable
  const fetchGraphData = async () => {
    if (!singleWord || multipleWords.length === 0) {
      setError("Please provide a single word and at least one word in the list.");
      setGraphData({ nodes: [], links: [] });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const wordList = multipleWords.map((w) => w.value || w.label || w);

      const response = await fetch("http://localhost:8000/word-clusters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ singleWord, wordList }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGraphData(data);
    } catch (err) {
      console.error("Error fetching graph data:", err);
      if (err.message.includes("Failed to fetch")) {
        setError("Connection refused. Is the server running?");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales solo una vez
  useEffect(() => {
    fetchGraphData();
  }, []); // El array vacío asegura que solo se ejecute al montar

  const handleSingleWordChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    setSingleWord(value);
  };

  return (
    <div className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none px-4">
      <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-400/20 w-full max-w-7xl h-[85vh] max-h-[900px]">
        <div className="flex flex-col lg:flex-row gap-6 w-full h-full">
          {/* Columna Izquierda: Grafo */}
          <div className="w-full lg:w-2/3 h-full bg-black/30 rounded-xl overflow-hidden pointer-events-auto relative">
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
          </div>

          {/* Columna Derecha: Controles */}
          <div className="w-full lg:w-1/3 h-full flex flex-col gap-6 pointer-events-auto overflow-y-auto p-2">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Michroma, sans-serif" }}>Playground</h2>
            
            <div className="flex flex-col gap-2">
              <label className="text-white text-md font-medium">Single Word</label>
              <Input
                type="text"
                value={singleWord}
                onChange={handleSingleWordChange}
                placeholder="Enter a single word..."
                className="bg-white/10 backdrop-blur-md border-purple-400/40 text-white placeholder:text-purple-200/60 focus-visible:ring-purple-500 focus-visible:border-purple-400 h-10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white text-md font-medium">Multiple Words</label>
              <MultipleSelectorCreatable 
                value={multipleWords}
                onChange={setMultipleWords}
              />
            </div>

            <div className="mt-auto pt-4">
              <ShinyButton
                onClick={fetchGraphData}
                disabled={loading}
                className="w-full py-3 text-lg font-semibold"
              >
                {loading ? "Loading..." : "Visualize"}
              </ShinyButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeD;