import SplitText from "../components/SplitText";

const About = () => {
  const tokens = ["My", "friend's", "car", "broke", "down"];

  return (
    <div className="absolute inset-0 z-5 flex justify-center items-start sm:items-center px-4 py-20 sm:py-10 overflow-y-auto custom-scrollbar">
      <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-10 border border-purple-400/20 w-full max-w-5xl flex flex-col my-auto pointer-events-auto">
        {/* Título */}
        <div
          className="text-center mb-6 md:mb-8"
          style={{ fontFamily: "Michroma, sans-serif" }}
        >
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
            Tokenizer 3D is a web platform that allows users to understand how
            AI models process, store, and interpret text. It uses advanced
            embedding models like BERT and Word2Vec to visualize semantic
            relationships between words in three-dimensional space.
          </p>

          <div className="w-full h-[1px] bg-purple-400/20 my-2"></div>

          {/* Conceptos Clave */}
          <div className="space-y-6 text-left">
            {/* Tokenización */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-purple-300 mb-2">
                Tokenization
              </h3>
              <p className="text-sm md:text-base text-purple-100/80">
                This is a process where text is broken down into smaller,
                manageable fragments for an AI model. These fragments, called
                tokens, usually correspond to individual words. The way words
                are tokenized depends on the model.
              </p>
              {/* Ejemplo Visual */}
              <div className="mt-4 p-4 bg-black/30 rounded-lg border border-purple-400/20">
                <p className="text-sm text-purple-200/70 mb-3">
                  For example, the sentence "My friend's car broke down" is
                  tokenized into:
                </p>
                <div className="flex flex-wrap gap-2">
                  {tokens.map((token, index) => (
                    <span
                      key={index}
                      className="bg-purple-500/40 text-purple-100 px-3 py-1 rounded-md text-sm font-mono"
                    >
                      {token}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Embeddings */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-blue-300 mb-2">
                Embeddings
              </h3>
              <p className="text-sm md:text-base text-purple-100/80 mb-3">
                Embeddings are numerical representations of words or tokens in a
                multi-dimensional space. They capture semantic meaning, allowing
                AI models to understand that words like "king" and "queen" are
                related, or that "happy" and "joyful" are similar.
              </p>

              {/* Tipos de Embeddings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Static Embeddings */}
                <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-400/20">
                  <h4 className="text-base md:text-lg font-semibold text-blue-200 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    Static Embeddings
                  </h4>
                  <p className="text-xs md:text-sm text-blue-100/70 mb-2">
                    Models like{" "}
                    <span className="font-mono text-blue-300">Word2Vec</span>{" "}
                    assign a single fixed vector to each word, regardless of
                    context.
                  </p>
                  <p className="text-xs text-blue-100/60 italic">
                    Example: The word "apple" always has the same label. It does
                    not matter if you talk about the fruit you eat, or the
                    company that makes phones (Apple Inc.). The computer cannot
                    know the difference in meaning.{" "}
                  </p>
                </div>

                {/* Contextual Embeddings */}
                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-400/20">
                  <h4 className="text-base md:text-lg font-semibold text-purple-200 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    Contextual Embeddings
                  </h4>
                  <p className="text-xs md:text-sm text-purple-100/70 mb-2">
                    Models like{" "}
                    <span className="font-mono text-purple-300">BERT</span>{" "}
                    generate different vectors for the same word depending on
                    the surrounding context.
                  </p>
                  <p className="text-xs text-purple-100/60 italic">
                    Example: The word "apple" has a fruit label in "I eat an
                    apple". It has a tech company label in "I buy an Apple
                    computer". The computer understands the exact meaning
                    because of the words around it.{" "}
                  </p>
                </div>
              </div>

              {/* Visualización 3D */}
              <div className="mt-4 p-4 bg-black/30 rounded-lg border border-purple-400/20">
                <p className="text-sm text-purple-200/70">
                  <span className="font-semibold text-purple-300">
                    In Tokenizer 3D:
                  </span>{" "}
                  We use dimensionality reduction techniques like PCA to project
                  high-dimensional embeddings (300+ dimensions) into 3D space,
                  making them visually interpretable while preserving semantic
                  relationships.
                </p>
              </div>
            </div>

            {/* LLMs */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-purple-300 mb-2">
                Large Language Models (LLMs)
              </h3>
              <p className="text-sm md:text-base text-purple-100/80">
                LLMs are models trained on vast amounts of text. From this data,
                they learn semantic relationships between words—how terms are
                associated based on their use and meaning in different contexts.
                This allows them to understand the meaning of phrases and
                generate coherent text, recognizing when a word's meaning
                changes based on the words surrounding it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
