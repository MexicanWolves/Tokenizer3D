import SplitText from "../components/SplitText";
import RotatingText from "../components/RotatingText";
import MultipleSelectorCreatable from "../components/spectrumui/multiple-selector-creatable";
import { Input } from "../components/ui/input";
import { ShinyButton } from "../components/ui/shiny-button";
import { useState } from "react";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

const Home = ({ onNavigate }) => {
  const [singleWord, setSingleWord] = useState("");
  const [multipleWords, setMultipleWords] = useState([]);

  const handleSingleWordChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    setSingleWord(value);
  };

  const handleVisualize = () => {
    if (singleWord.trim() && multipleWords.length > 0) {
      console.log("Visualizing:", { singleWord, multipleWords });
      // Navega a 3D
      if (onNavigate) {
        onNavigate('3d');
      }
    }
  };

  // El botón solo se habilita si hay palabra Y opciones múltiples
  const isDisabled = !singleWord.trim() || multipleWords.length === 0;

  return (
    <div className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none px-4">
      <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm rounded-2xl md:rounded-3xl px-8 py-12 sm:px-12 sm:py-16 md:px-20 md:py-20 lg:px-20 lg:py-20 border border-purple-400/20 max-w-sm sm:max-w-lg md:max-w-3xl lg:max-w-5xl w-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-8 w-full">
          <div
            style={{ fontFamily: "Michroma, sans-serif" }}
            className="w-full flex flex-col items-center"
          >
            <SplitText
              text="Explore how words"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center text-white drop-shadow-lg"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              onLetterAnimationComplete={handleAnimationComplete}
            />
            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
              <RotatingText
                texts={["connect", " expand "]}
                mainClassName="px-3 sm:px-4 md:px-5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white overflow-hidden py-1 sm:py-1.5 md:py-2 justify-center rounded-lg"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-lg">
                in 3D
              </span>
            </div>
          </div>

          {/* Contenedor de inputs en fila */}
          <div className="pointer-events-auto w-full max-w-3xl flex flex-col sm:flex-row gap-4 items-start">
            {/* Input simple */}
            <div className="w-full sm:w-46 md:w-60 flex flex-col gap-2">
              <label className="text-white text-md font-medium">
                Single Word
              </label>
              <Input
                type="text"
                value={singleWord}
                onChange={handleSingleWordChange}
                placeholder="Enter a single word..."
                className="bg-white/10 backdrop-blur-md border-purple-400/40 text-white placeholder:text-purple-200/60 focus-visible:ring-purple-500 focus-visible:border-purple-400 h-10"
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            {/* MultipleSelector */}
            <div className="w-full flex-1 flex flex-col gap-2">
              <label className="text-white text-md font-medium">
                Multiple Words
              </label>
              <MultipleSelectorCreatable 
                value={multipleWords}
                onChange={setMultipleWords}
              />
            </div>
          </div>

          {/* Botón Shiny */}
          <div className="pointer-events-auto">
            <ShinyButton
              onClick={handleVisualize}
              disabled={isDisabled}
              className={`px-8 py-3 text-base sm:text-lg font-semibold transition-all ${
                isDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105'
              }`}
            >
              Visualize in 3D
            </ShinyButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
