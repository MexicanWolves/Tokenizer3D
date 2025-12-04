import { useState } from "react";
import Graph3D from "../components/Graph3D";
import { Input } from "../components/ui/input";
import { ShinyButton } from "../components/ui/shiny-button";
import { getTextEmbeddings, transformTokensToGraphData } from "../services/embeddingApi";

const TokenVisualization = () => {
  const [inputText, setInputText] = useState("");
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tokensData, setTokensData] = useState(null);

  const handleVisualize = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to tokenize");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getTextEmbeddings(inputText);
      setTokensData(data);
      
      const graphDataFormatted = transformTokensToGraphData(data.tokens);
      setGraphData(graphDataFormatted);
    } catch (err) {
      console.error("Error fetching embeddings:", err);
      setError(err.message || "Failed to fetch token embeddings");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVisualize();
    }
  };

  return (
    <div className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none px-4 py-8 sm:py-4 pt-20">
      <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 border border-purple-400/20 w-full max-w-7xl h-full max-h-[95vh] lg:h-[85vh] lg:max-h-[900px]">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full h-full">
          {/* Columna Izquierda: Grafo 3D */}
          <div className="h-1/2 lg:h-full w-full lg:w-2/3 bg-black/30 rounded-xl overflow-hidden pointer-events-auto relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-xl animate-pulse z-10">
                Loading embeddings...
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
            {!loading && !error && graphData.nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-purple-300 text-center p-4 z-10">
                <div>
                  <p className="text-2xl mb-2">🎯</p>
                  <p className="font-bold text-lg">Enter text to visualize tokens</p>
                  <p className="text-sm mt-2">Each token will be displayed in 3D space based on its embeddings</p>
                </div>
              </div>
            )}
            <Graph3D data={graphData} />
            
            {/* Controles */}
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

          {/* Columna Derecha: Controles e Información */}
          <div className="h-1/2 lg:h-full w-full lg:w-1/3 flex flex-col gap-4 pointer-events-auto overflow-y-auto p-2 rounded-lg custom-scrollbar">
            <h2 className="text-xl md:text-2xl font-bold text-white shrink-0" style={{ fontFamily: "Michroma, sans-serif" }}>
              Token Embeddings
            </h2>

            {/* Input de texto */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-md font-medium">Enter Text</label>
              <Input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., The red sweater"
                className="bg-white/10 backdrop-blur-md border-purple-400/40 text-white placeholder:text-purple-200/60 focus-visible:ring-purple-500 focus-visible:border-purple-400 h-10"
              />
              <p className="text-xs text-purple-200/70">
                Press Enter or click Visualize to see token embeddings in 3D
              </p>
            </div>

            {/* Botón de visualizar */}
            <ShinyButton 
              onClick={handleVisualize} 
              disabled={loading || !inputText.trim()}
              className="w-full py-3 text-lg font-semibold"
            >
              {loading ? "Loading..." : "Visualize Tokens"}
            </ShinyButton>

            {/* Información de tokens */}
            {tokensData && (
              <div className="flex flex-col gap-3 bg-black/30 p-4 rounded-lg border border-purple-400/20 mt-2">
                <h3 className="text-white font-semibold text-lg">Token Information</h3>
                <div className="text-purple-200 text-sm">
                  <p><span className="font-semibold">Original Text:</span> {tokensData.text}</p>
                  <p className="mt-2"><span className="font-semibold">Total Tokens:</span> {tokensData.tokens.length}</p>
                </div>
                
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {tokensData.tokens.map((token, index) => (
                    <div 
                      key={index} 
                      className="bg-white/5 p-2 rounded border border-purple-400/10 hover:border-purple-400/30 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <span className={`font-mono text-sm ${
                          token.token === '[CLS]' || token.token === '[SEP]' 
                            ? 'text-red-300' 
                            : 'text-purple-300'
                        }`}>
                          {token.token}
                        </span>
                        <span className="text-xs text-purple-400/70">#{index}</span>
                      </div>
                      <div className="text-xs text-purple-200/50 mt-1 font-mono">
                        [{token.vector_3d[0].toFixed(2)}, {token.vector_3d[1].toFixed(2)}, {token.vector_3d[2].toFixed(2)}]
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leyenda */}
            <div className="bg-black/30 p-4 rounded-lg border border-purple-400/20 mt-auto">
              <h3 className="text-white font-semibold text-sm mb-2">Legend</h3>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-purple-200">Special Tokens ([CLS], [SEP])</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-purple-200">Word Tokens</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenVisualization;
