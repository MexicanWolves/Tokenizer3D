import MultipleSelector from "@/components/spectrumui/multiple-selector-dependencies";

const OPTIONS = [
  { label: "house", value: "house" },
  { label: "dog", value: "dog" },
  { label: "princess", value: "princess" },
  { label: "green", value: "green" },
  { label: "computer", value: "computer" },
  { label: "shoe", value: "shoe" },
];

const MultipleSelectorCreatable = ({ value, onChange }) => {
  return (
    <div className="w-full multi-selector-wrapper">
      <MultipleSelector
        defaultOptions={OPTIONS}
        placeholder="Type any words you want..."
        creatable
        value={value}
        onChange={onChange}
        className="bg-white/10 backdrop-blur-md border-purple-400/40 focus-within:ring-purple-500 focus-within:border-purple-400"
        badgeClassName="text-white border-none badge-alternating"
        commandProps={{
          className: "bg-transparent",
        }}
        inputProps={{
          className: "text-white placeholder:text-purple-200/60",
        }}
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-purple-300">
            No results found. Start typing to create a new word!
          </p>
        }
      />

      <style>{`
        /* Morado */
        .multi-selector-wrapper .badge-alternating:nth-child(7n+1) {
          background-color: rgb(147 51 234) !important;
        }
        .multi-selector-wrapper .badge-alternating:nth-child(7n+1):hover {
          background-color: rgb(126 34 206) !important;
        }

        /* Azul */
        .multi-selector-wrapper .badge-alternating:nth-child(7n+2) {
          background-color: rgb(59 130 246) !important;
        }
        .multi-selector-wrapper .badge-alternating:nth-child(7n+2):hover {
          background-color: rgb(37 99 235) !important;
        }

        /* Teal/Turquesa */
        .multi-selector-wrapper .badge-alternating:nth-child(7n+3) {
          background-color: rgb(20 184 166) !important;
        }
        .multi-selector-wrapper .badge-alternating:nth-child(7n+3):hover {
          background-color: rgb(13 148 136) !important;
        }

        /* Rosa/Pink suave */
        .multi-selector-wrapper .badge-alternating:nth-child(7n+4) {
          background-color: rgb(236 72 153) !important;
        }
        .multi-selector-wrapper .badge-alternating:nth-child(7n+4):hover {
          background-color: rgb(219 39 119) !important;
        }

        /* Fucsia */
        .multi-selector-wrapper .badge-alternating:nth-child(7n+5) {
          background-color: rgb(217 70 239) !important;
        }
        .multi-selector-wrapper .badge-alternating:nth-child(7n+5):hover {
          background-color: rgb(192 38 211) !important;
        }

        /* Naranja suave */
        .multi-selector-wrapper .badge-alternating:nth-child(7n+6) {
          background-color: rgb(251 146 60) !important;
        }
        .multi-selector-wrapper .badge-alternating:nth-child(7n+6):hover {
          background-color: rgb(249 115 22) !important;
        }

        /* Rojo/Rosa coral */
        .multi-selector-wrapper .badge-alternating:nth-child(7n+7) {
          background-color: rgb(244 63 94) !important;
        }
        .multi-selector-wrapper .badge-alternating:nth-child(7n+7):hover {
          background-color: rgb(225 29 72) !important;
        }

        /* X en blanco */
        .multi-selector-wrapper .badge-alternating button {
          color: white !important;
        }
        .multi-selector-wrapper .badge-alternating button:hover {
          color: rgba(255, 255, 255, 0.8) !important;
        }
      `}</style>
    </div>
  );
};

export default MultipleSelectorCreatable;
