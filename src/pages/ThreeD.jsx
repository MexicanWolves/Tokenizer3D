import Graph3D from "../components/Graph3D";
import { useState, useEffect } from "react";

const ThreeD = ({ singleWord, multipleWords, onNavigate }) => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        setError(null);

        const wordList = multipleWords.map((w) => w.value || w.label || w);

        const response = await fetch("http://localhost:8000/word-clusters", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            singleWord: singleWord,
            wordList: wordList,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.detail || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        setGraphData(data);
      } catch (err) {
        console.error("Error fetching graph data:", err);
        // Simplifica el mensaje de error para el usuario
        if (err.message.includes("Failed to fetch")) {
          setError("Connection refused. Is the server running?");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (singleWord && multipleWords.length > 0) {
      fetchGraphData();
    } else {
      setLoading(false);
      setError("No words provided to visualize.");
    }
  }, [singleWord, multipleWords]);

  return (
    <div className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none px-4">
      {/* Botón Back (ya no está en el código, pero lo puedes agregar si quieres) */}
      
      <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm rounded-2xl md:rounded-3xl px-8 py-12 sm:px-12 sm:py-16 md:px-20 md:py-20 lg:px-20 lg:py-20 border border-purple-400/20 max-w-sm sm:max-w-lg md:max-w-3xl lg:max-w-6xl w-full min-h-[400px] sm:min-h-[450px] md:min-h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
          {loading ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="text-white text-xl animate-pulse">Loading visualization...</div>
              <p className="text-purple-300 text-sm">Please wait, this may take a moment.</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 text-center p-4">
              <div className="text-red-400 text-xl font-semibold">Error</div>
              <p className="text-red-300 text-base">{error}</p>
              <p className="text-purple-300 text-sm mt-4">
                This usually means the backend server is not running.
              </p>
              <p className="text-purple-200 text-xs">
                Please start the server by running <code className="bg-black/50 px-2 py-1 rounded">uvicorn main:app --reload</code> in the <code className="bg-black/50 px-2 py-1 rounded">server</code> directory.
              </p>
            </div>
          ) : (
            <div className="w-full h-full min-h-[400px] sm:min-h-[450px] md:min-h-[550px] rounded-xl overflow-hidden pointer-events-auto">
              <Graph3D data={graphData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreeD;