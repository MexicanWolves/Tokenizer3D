import SplitText from "../components/SplitText";

const About = () => {
  const tokens = ["My", "friend's", "car", "broke", "down"];

  return (
    // --- CORRECCIONES AQUÍ ---
    // 1. Se elimina 'pointer-events-none' para permitir el scroll.
    // 2. Se añade 'overflow-y-auto' y 'custom-scrollbar'.
    // 3. Se cambia la alineación para que sea responsive.
    <div className="absolute inset-0 z-5 flex justify-center items-start sm:items-center px-4 py-20 sm:py-10 overflow-y-auto custom-scrollbar">
      {/* Se añade 'my-auto' para centrar y 'pointer-events-auto' para asegurar la interacción */}
      <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-10 border border-purple-400/20 w-full max-w-5xl flex flex-col my-auto pointer-events-auto">
        {/* Título */}
        <div className="text-center mb-6 md:mb-8" style={{ fontFamily: "Michroma, sans-serif" }}>
          <SplitText
            text="About Tokenizer 3D"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            delay={50}
          />
        </div>

        {/* Contenedor de Contenido */}
        <div className="flex flex-col gap-6 text-white">
          {/* Introducción */}
          <p className="text-base md:text-lg text-purple-100/90 text-center">
            Tokenizer 3D is a web platform that allows users to understand how AI models process, store, and interpret text. It uses the Word2Vec model, trained by Google on millions of English news articles, which enables semantic similarity comparisons between different words.
          </p>

          <div className="w-full h-[1px] bg-purple-400/20 my-2"></div>

          {/* Conceptos Clave */}
          <div className="space-y-6 text-left">
            {/* Tokenización */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-purple-300 mb-2">Tokenization</h3>
              <p className="text-sm md:text-base text-purple-100/80">
                This is a process where text is broken down into smaller, manageable fragments for an AI model. These fragments, called tokens, usually correspond to individual words. The way words are tokenized depends on the model.
              </p>
              {/* Ejemplo Visual */}
              <div className="mt-4 p-4 bg-black/30 rounded-lg border border-purple-400/20">
                <p className="text-sm text-purple-200/70 mb-3">For example, the sentence "My friend's car broke down" is tokenized into:</p>
                <div className="flex flex-wrap gap-2">
                  {tokens.map((token, index) => (
                    <span key={index} className="bg-purple-500/40 text-purple-100 px-3 py-1 rounded-md text-sm font-mono">
                      {token}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* LLMs */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-purple-300 mb-2">Large Language Models (LLMs)</h3>
              <p className="text-sm md:text-base text-purple-100/80">
                LLMs are models trained on vast amounts of text. From this data, they learn semantic relationships between words—how terms are associated based on their use and meaning in different contexts. This allows them to understand the meaning of phrases and generate coherent text, recognizing when a word's meaning changes based on the words surrounding it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
