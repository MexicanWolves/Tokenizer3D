import { useState } from "react";
import Graph3D from "../components/Graph3D";
import { Input } from "../components/ui/input";
import { ShinyButton } from "../components/ui/shiny-button";
import {
  getTextEmbeddings,
  transformTokensToGraphData,
  compareEmbeddings,
  calculateDivergence,
  kMeansClustering,
} from "../services/bertApi";
import {
  getWord2VecEmbeddings,
  transformWord2VecTokensToGraphData,
} from "@/services/word2vecApi";

const TokenVisualization = () => {
  const [inputText, setInputText] = useState("");
  const [bertGraphData, setBertGraphData] = useState({ nodes: [], links: [] });
  const [word2vecGraphData, setWord2vecGraphData] = useState({
    nodes: [],
    links: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bertTokensData, setBertTokensData] = useState(null);
  const [word2vecTokensData, setWord2vecTokensData] = useState(null);
  
  // Estados para métricas
  const [metrics, setMetrics] = useState(null);
  const [showMetrics, setShowMetrics] = useState(false);

  const handleVisualize = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to tokenize");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Ejecutar ambas llamadas en paralelo
      const [bertData, word2vecData] = await Promise.all([
        getTextEmbeddings(inputText),
        getWord2VecEmbeddings(inputText),
      ]);

      // Transformar datos para ambos grafos
      const bertGraphFormatted = transformTokensToGraphData(bertData.tokens);
      const word2vecGraphFormatted = transformWord2VecTokensToGraphData(
        word2vecData.tokens
      );

      setBertTokensData(bertData);
      setWord2vecTokensData(word2vecData);
      setBertGraphData(bertGraphFormatted);
      setWord2vecGraphData(word2vecGraphFormatted);
      
      // Calcular métricas
      const comparison = compareEmbeddings(bertData.tokens, word2vecData.tokens);
      const divergence = calculateDivergence(bertData.tokens, word2vecData.tokens);
      const bertClusters = kMeansClustering(bertData.tokens, 3);
      const word2vecClusters = kMeansClustering(word2vecData.tokens, 3);
      
      setMetrics({
        comparison,
        divergence,
        bertClusters,
        word2vecClusters
      });
      
    } catch (err) {
      console.error("Error fetching embeddings:", err);
      setError(err.message || "Failed to fetch token embeddings");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleVisualize();
    }
  };

  const hasData =
    bertGraphData.nodes.length > 0 || word2vecGraphData.nodes.length > 0;

  return (
    <div className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none px-4 py-8 sm:py-4 pt-20">
      <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 border border-purple-400/20 w-full max-w-7xl h-full max-h-[95vh] lg:h-[85vh] lg:max-h-[900px]">
        <div className="flex flex-col gap-4 md:gap-6 w-full h-full">
          
          {/* Botón para mostrar métricas */}
          {metrics && (
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="absolute top-2 right-2 z-30 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-semibold pointer-events-auto shadow-lg transition-all cursor-pointer hover:bg-white/20"
            >
              {showMetrics ? 'Hide Metrics' : 'Show Metrics'}
            </button>
          )}
          
          {/* Panel de Métricas lateral */}
          {showMetrics && metrics && (
            <div className="absolute right-4 top-16 z-30 w-96 max-h-[85vh] overflow-y-auto bg-black/95 backdrop-blur-md rounded-xl p-4 pointer-events-auto custom-scrollbar border border-purple-400/30 shadow-2xl">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                Metrics Analysis
              </h3>
              
              {/* Similitud Coseno */}
              <div className="mb-6 bg-purple-900/20 p-3 rounded-lg border border-purple-400/20">
                <h4 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                  Cosine Similarity
                </h4>
                <div className="bg-black/40 p-2 rounded mb-3">
                  <p className="text-sm text-white">
                    Average: <span className="font-bold text-purple-400 text-lg">{metrics.comparison.avgSimilarity.toFixed(3)}</span>
                  </p>
                  <p className="text-xs text-purple-200/70 mt-1">
                    Measures how similar BERT and Word2Vec embeddings are
                  </p>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {metrics.comparison.comparisons.map((comp, idx) => (
                    <div key={idx} className="bg-white/5 p-2 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-purple-200 font-mono">{comp.token}</span>
                        <span className="text-xs text-white font-bold">{comp.similarity.toFixed(3)}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-300 to-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.max(0, Math.min(100, comp.similarity * 100))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Divergencia Semántica */}
              <div className="mb-6 bg-blue-900/20 p-3 rounded-lg border border-blue-400/20">
                <h4 className="text-blue-300 font-semibold mb-3 flex items-center gap-2">
                  Semantic Divergence
                </h4>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-black/40 p-2 rounded">
                    <p className="text-xs text-blue-200/70">Avg Euclidean</p>
                    <p className="text-sm text-white font-bold">{metrics.divergence.avgEuclidean.toFixed(3)}</p>
                  </div>
                  <div className="bg-black/40 p-2 rounded">
                    <p className="text-xs text-blue-200/70">Avg Cosine Dist</p>
                    <p className="text-sm text-white font-bold">{metrics.divergence.avgCosine.toFixed(3)}</p>
                  </div>
                </div>
                <p className="text-xs text-blue-200/70 mb-3">
                  Higher values indicate greater difference between models
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {metrics.divergence.divergences.map((div, idx) => (
                    <div key={idx} className="bg-white/5 p-2 rounded text-xs">
                      <span className="text-blue-200 font-semibold font-mono block mb-1">{div.token}</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-blue-200/70">Euclidean:</span>
                          <span className="text-white ml-1 font-bold">{div.euclideanDistance.toFixed(3)}</span>
                        </div>
                        <div>
                          <span className="text-blue-200/70">Cosine:</span>
                          <span className="text-white ml-1 font-bold">{div.cosineDistance.toFixed(3)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* K-Means Clusters */}
              <div className="bg-fuchsia-900/20 p-3 rounded-lg border border-fuchsia-400/20">
                <h4 className="text-fuchsia-300 font-semibold mb-3 flex items-center gap-2">
                  K-Means Clustering (k=3)
                </h4>
                
                {/* BERT Clusters */}
                <div className="mb-4">
                  <p className="text-xs text-fuchsia-300 font-semibold mb-2">BERT Clusters</p>
                  <div className="bg-black/40 p-2 rounded mb-2">
                    <p className="text-xs text-white/70">Inertia: <span className="font-bold text-white">{metrics.bertClusters.inertia.toFixed(2)}</span></p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map(cluster => {
                      const count = metrics.bertClusters.clusterSizes[cluster];
                      const tokens = metrics.bertClusters.tokens.filter(t => t.cluster === cluster);
                      return (
                        <div key={cluster} className="bg-white/5 p-2 rounded text-center">
                          <div className="text-lg font-bold text-rose-400">C{cluster}</div>
                          <div className="text-xs text-white">{count} tokens</div>
                          <div className="text-[10px] text-rose-200/70 mt-1 truncate" title={tokens.map(t => t.token).join(', ')}>
                            {tokens.slice(0, 2).map(t => t.token).join(', ')}
                            {tokens.length > 2 && '...'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Word2Vec Clusters */}
                <div>
                  <p className="text-xs text-blue-300 font-semibold mb-2">Word2Vec Clusters</p>
                  <div className="bg-black/40 p-2 rounded mb-2">
                    <p className="text-xs text-white/70">Inertia: <span className="font-bold text-white">{metrics.word2vecClusters.inertia.toFixed(2)}</span></p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map(cluster => {
                      const count = metrics.word2vecClusters.clusterSizes[cluster];
                      const tokens = metrics.word2vecClusters.tokens.filter(t => t.cluster === cluster);
                      return (
                        <div key={cluster} className="bg-white/5 p-2 rounded text-center">
                          <div className="text-lg font-bold text-blue-400">C{cluster}</div>
                          <div className="text-xs text-white">{count} tokens</div>
                          <div className="text-[10px] text-blue-200/70 mt-1 truncate" title={tokens.map(t => t.token).join(', ')}>
                            {tokens.slice(0, 2).map(t => t.token).join(', ')}
                            {tokens.length > 2 && '...'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <p className="text-xs text-green-200/70 mt-3">
                  Lower inertia indicates tighter, more cohesive clusters
                </p>
              </div>
            </div>
          )}
          
          {/* Fila Superior: Ambos Grafos */}
          <div className="flex flex-col lg:flex-row gap-4 h-3/5 lg:h-2/3">
            {/* Grafo BERT */}
            <div className="h-1/2 lg:h-full w-full lg:w-1/2 bg-black/30 rounded-xl overflow-hidden pointer-events-auto relative">
              <div className="absolute top-2 left-2 z-20 px-3 py-2 bg-purple-500/80 backdrop-blur-sm rounded-lg text-white font-semibold pointer-events-none shadow-lg">
                BERT Model
              </div>

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-lg animate-pulse z-10 bg-black/40">
                  Loading BERT...
                </div>
              )}
              {error && !loading && (
                <div className="absolute inset-0 flex items-center justify-center text-red-400 text-center p-4 z-10">
                  <div>
                    <p className="font-bold">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
              {!loading && !error && bertGraphData.nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-purple-300 text-center p-4 z-10">
                  <div>
                    <p className="font-bold text-sm lg:text-base">
                      Enter text to visualize
                    </p>
                    <p className="text-sm mt-1">Contextual embeddings</p>
                  </div>
                </div>
              )}
              <Graph3D data={bertGraphData} />

              {/* Controles */}
              <div className="absolute bottom-2 left-2 z-20 p-2 bg-black/60 backdrop-blur-sm rounded-lg text-white text-[10px] pointer-events-none max-w-[160px]">
                <h4 className="font-bold mb-1">Controls</h4>
                <ul className="space-y-0.5">
                  <li>
                    <span className="font-semibold text-purple-300">
                      Rotate:
                    </span>{" "}
                    Left-drag
                  </li>
                  <li>
                    <span className="font-semibold text-purple-300">Pan:</span>{" "}
                    Right-drag
                  </li>
                  <li>
                    <span className="font-semibold text-purple-300">Zoom:</span>{" "}
                    Scroll
                  </li>
                </ul>
              </div>
            </div>

            {/* Grafo Word2Vec */}
            <div className="h-1/2 lg:h-full w-full lg:w-1/2 bg-black/30 rounded-xl overflow-hidden pointer-events-auto relative">
              <div className="absolute top-2 left-2 z-20 px-3 py-2 bg-blue-500/80 backdrop-blur-sm rounded-lg text-white font-semibold pointer-events-none shadow-lg">
                Word2Vec Model
              </div>

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-lg animate-pulse z-10 bg-black/40">
                  Loading Word2Vec...
                </div>
              )}
              {error && !loading && (
                <div className="absolute inset-0 flex items-center justify-center text-red-400 text-center p-4 z-10">
                  <div>
                    <p className="font-bold">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
              {!loading && !error && word2vecGraphData.nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-blue-300 text-center p-4 z-10">
                  <div>
                    <p className="font-bold text-sm lg:text-base">
                      Enter text to visualize
                    </p>
                    <p className="text-sm mt-1">Static embeddings</p>
                  </div>
                </div>
              )}
              <Graph3D data={word2vecGraphData} />

              {/* Controles */}
              <div className="absolute bottom-2 left-2 z-20 p-2 bg-black/60 backdrop-blur-sm rounded-lg text-white text-[10px] pointer-events-none max-w-[160px]">
                <h4 className="font-bold mb-1">Controls</h4>
                <ul className="space-y-0.5">
                  <li>
                    <span className="font-semibold text-blue-300">Rotate:</span>{" "}
                    Left-drag
                  </li>
                  <li>
                    <span className="font-semibold text-blue-300">Pan:</span>{" "}
                    Right-drag
                  </li>
                  <li>
                    <span className="font-semibold text-blue-300">Zoom:</span>{" "}
                    Scroll
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Fila Inferior: Controles e Información */}
          <div className="h-2/5 lg:h-1/3 flex flex-col lg:flex-row gap-4 pointer-events-auto overflow-y-auto custom-scrollbar">
            {/* Información BERT - siempre se renderiza con orden fijo */}
            <div className={`w-full lg:w-1/3 flex flex-col gap-2 bg-purple-900/20 p-3 rounded-lg border border-purple-400/20 ${!bertTokensData ? 'opacity-0 pointer-events-none' : ''}`}>
              {bertTokensData && (
                <>
                  <h3 className="text-white font-semibold text-base flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    BERT Tokens
                  </h3>
                  <div className="text-purple-200 text-xs">
                    <p>
                      <span className="font-semibold">Total:</span>{" "}
                      {bertTokensData.tokens.length}
                    </p>
                    <p className="text-[10px] text-purple-200/70 mt-1">
                      Contextual subword tokenization
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                    {bertTokensData.tokens.map((token, index) => (
                      <div
                        key={index}
                        className="bg-white/5 p-1.5 rounded border border-purple-400/10 hover:border-purple-400/30 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <span
                            className={`font-mono text-xs ${
                              token.token === "[CLS]" || token.token === "[SEP]"
                                ? "text-red-300"
                                : "text-purple-300"
                            }`}
                          >
                            {token.token}
                          </span>
                          <span className="text-[10px] text-purple-400/70">
                            #{index}
                          </span>
                        </div>
                        <div className="text-[10px] text-purple-200/50 mt-0.5 font-mono">
                          [{token.vector_3d[0].toFixed(1)},{" "}
                          {token.vector_3d[1].toFixed(1)},{" "}
                          {token.vector_3d[2].toFixed(1)}]
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Input y botón - siempre en el medio */}
            <div className="w-full lg:w-1/3 flex flex-col gap-3 p-2">
              <h2
                className="text-lg md:text-xl font-bold text-white shrink-0"
                style={{ fontFamily: "Michroma, sans-serif" }}
              >
                Comparative View
              </h2>

              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium">
                  Enter Text
                </label>
                <Input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., The red sweater"
                  className="bg-white/10 backdrop-blur-md border-purple-400/40 text-white placeholder:text-purple-200/60 focus-visible:ring-purple-500 focus-visible:border-purple-400 h-10"
                />
                <p className="text-xs text-purple-200/70">
                  Both models will visualize the text simultaneously
                </p>
              </div>

              <ShinyButton
                onClick={handleVisualize}
                disabled={loading || !inputText.trim()}
                className="w-full py-2.5 text-base font-semibold"
              >
                {loading ? "Loading..." : "Visualize Both"}
              </ShinyButton>
            </div>

            {/* Información Word2Vec - siempre se renderiza con orden fijo */}
            <div className={`w-full lg:w-1/3 flex flex-col gap-2 bg-blue-900/20 p-3 rounded-lg border border-blue-400/20 ${!word2vecTokensData ? 'opacity-0 pointer-events-none' : ''}`}>
              {word2vecTokensData && (
                <>
                  <h3 className="text-white font-semibold text-base flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    Word2Vec Tokens
                  </h3>
                  <div className="text-blue-200 text-xs">
                    <p>
                      <span className="font-semibold">Total:</span>{" "}
                      {word2vecTokensData.tokens.length}
                    </p>
                    <p className="text-[10px] text-blue-200/70 mt-1">
                      Static word-level embeddings
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                    {word2vecTokensData.tokens.map((token, index) => (
                      <div
                        key={index}
                        className="bg-white/5 p-1.5 rounded border border-blue-400/10 hover:border-blue-400/30 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <span
                            className={`font-mono text-xs ${
                              token.token === "[CLS]" || token.token === "[SEP]"
                                ? "text-red-300"
                                : "text-blue-400"
                            }`}
                          >
                            {token.token}
                          </span>
                          <span className="text-[10px] text-blue-400/70">
                            #{index}
                          </span>
                        </div>
                        <div className="text-[10px] text-blue-200/50 mt-0.5 font-mono">
                          [{token.vector_3d[0].toFixed(1)},{" "}
                          {token.vector_3d[1].toFixed(1)},{" "}
                          {token.vector_3d[2].toFixed(1)}]
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenVisualization;