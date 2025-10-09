import SplitText from "../components/SplitText";
import ShinyText from "../components/ShinyText";
import MultipleSelectorCreatable from "../components/spectrumui/multiple-selector-creatable";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

const Home = () => {
  return (
    <div className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none px-4">
      <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm rounded-2xl md:rounded-3xl px-8 py-12 sm:px-12 sm:py-16 md:px-20 md:py-20 lg:px-24 lg:py-24 border border-purple-400/20 max-w-sm sm:max-w-lg md:max-w-3xl lg:max-w-5xl w-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full">
          <div style={{ fontFamily: "Michroma, sans-serif" }}>
            <SplitText
              text="Welcome to Tok!"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center text-white drop-shadow-lg"
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
          </div>
          <ShinyText
            text="A playground where words come to life in 3D."
            disabled={false}
            speed={3}
            className="custom-class -mt-6 mix-blend-luminosity text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
          />
          <div className="pointer-events-auto w-full max-w-2xl">
            <MultipleSelectorCreatable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
