import SplitText from "../components/SplitText";
import RotatingText from "../components/RotatingText";
import { ShinyButton } from "../components/ui/shiny-button";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

const Home = ({ onNavigate }) => {
  const handleExplore = () => {
    if (onNavigate) {
      onNavigate("tokens");
    }
  };

  return (
    <div className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none px-4">
      <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm rounded-2xl md:rounded-3xl px-8 py-12 sm:px-12 sm:py-16 md:px-20 md:py-20 lg:px-20 lg:py-20 border border-purple-400/20 max-w-sm sm:max-w-lg md:max-w-3xl lg:max-w-6xl xl:max-w-7xl w-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-8 w-full">
          {/* Título animado */}
          <div
            style={{ fontFamily: "Michroma, sans-serif" }}
            className="w-full flex flex-col items-center"
          >
            <SplitText
              text="Visualize Token"
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
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white drop-shadow-lg">
                Embeddings in
              </span>
              <RotatingText
                texts={["BERT", "Word2Vec"]}
                mainClassName="px-3 sm:px-4 md:px-5 bg-gradient-to-r from-purple-500 to-blue-700 text-white overflow-hidden py-1 sm:py-1.5 md:py-2 justify-center rounded-lg"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-0.5 md:pb-0.5 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="text-center max-w-3xl">
            <p className="text-white/90 text-base font-semibold sm:text-xl md:text-2xl lg:text-3xl leading-relaxed">
              Compare{" "}
              <span className="font-bold text-blue-100 text-shadow-lg text-shadow-blue-400">
                contextual
              </span>{" "}
              and{" "}
              <span className="font-bold text-purple-100 text-shadow-lg text-shadow-purple-400">
                static
              </span>{" "}
              embeddings in 3D space
            </p>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg py-1 px-2 border border-purple-400/20">
              <p className="text-white/80 text-md sm:text-lg md:text-xl lg:text-2xl text-shadow-md">
                Analyze cosine similarity, semantic divergence, and K-means
                clustering
              </p>
            </div>
          </div>

          {/* Botón principal */}
          <div className="pointer-events-auto">
            <ShinyButton
              onClick={handleExplore}
              className="px-12 py-5 text-xl sm:text-2xl lg:text-3xl font-semibold hover:scale-105 transition-all"
            >
              Start Exploring
            </ShinyButton>
          </div>

          {/* Nota al pie */}
          <p className="text-white/50 text-sm sm:text-base text-center max-w-md">
            Interactive 3D visualization powered by BERT and Word2Vec embeddings
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
