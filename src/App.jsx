import "./App.css";
import GradientBlinds from "./components/GradientBlinds";
import StaggeredMenu from "./components/StaggeredMenu";

const menuItems = [
	{ label: "Home", ariaLabel: "Go to home page", link: "/" },
	{ label: "About", ariaLabel: "Learn about us", link: "/about" },
	{ label: "Services", ariaLabel: "View our services", link: "/services" },
	{ label: "Contact", ariaLabel: "Get in touch", link: "/contact" },
];

const socialItems = [
	{ label: "Twitter", link: "https://twitter.com" },
	{ label: "GitHub", link: "https://github.com" },
	{ label: "LinkedIn", link: "https://linkedin.com" },
];

function App() {
	return (
		<div className="relative w-screen h-screen bg-black overflow-hidden">
			{/* Fondo */}
			<div className="absolute inset-0 z-0">
				<GradientBlinds
					gradientColors={["#FF9FFC", "#5227FF"]}
					angle={0}
					noise={0.3}
					blindCount={12}
					blindMinWidth={50}
					spotlightRadius={0.5}
					spotlightSoftness={1}
					spotlightOpacity={1}
					mouseDampening={0.15}
					distortAmount={0}
					shineDirection="left"
					mixBlendMode="lighten"
				/>
			</div>

			{/* Título */}
			<div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
				<h1 className="text-white text-6xl font-bold">Tokenizador 3D</h1>
			</div>
      
      {/* Menú */}
			<StaggeredMenu
				position="right"
				items={menuItems}
				socialItems={socialItems}
				displaySocials={true}
				displayItemNumbering={true}
				menuButtonColor="#fff"
				openMenuButtonColor="#000"
				changeMenuColorOnOpen={true}
				colors={["#B19EEF", "#5227FF"]}
				logoUrl="/tok_logo.svg"
				accentColor="#B19EEF"
				isFixed={true}
				onMenuOpen={() => console.log("Menu opened")}
				onMenuClose={() => console.log("Menu closed")}
			/>
		</div>
	);
}

export default App;
