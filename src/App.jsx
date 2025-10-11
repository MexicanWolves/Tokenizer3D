import "./App.css";
import { useState } from "react";
import GradientBlinds from "./components/GradientBlinds";
import StaggeredMenu from "./components/StaggeredMenu";
import Home from "./pages/Home";
import About from "./pages/About";
import ThreeD from "./pages/ThreeD";
import Contact from "./pages/Contact";

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const menuItems = [
    { label: "Home", ariaLabel: "Go to home page", link: "/", page: 'home' },
    { label: "3D", ariaLabel: "View 3D visualization", link: "/3d", page: '3d' },
    { label: "About", ariaLabel: "Learn about us", link: "/about", page: 'about' },
    { label: "Contact", ariaLabel: "Get in touch", link: "/contact", page: 'contact' },
  ];

  const socialItems = [
    { label: "Twitter", link: "https://twitter.com" },
    { label: "GitHub", link: "https://github.com" },
    { label: "LinkedIn", link: "https://linkedin.com" },
  ];

  const handleMenuClick = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case '3d':
        return <ThreeD />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

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

      {/* Renderizar página actual */}
      {renderPage()}

      {/* Menú */}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={false}
        displayItemNumbering={true}
        menuButtonColor="#fff"
        openMenuButtonColor="#000"
        changeMenuColorOnOpen={true}
        colors={["#B19EEF", "#5227FF"]}
        logoUrl="/tok_logo.svg"
        accentColor="#5227FF"
        isFixed={true}
        onMenuItemClick={handleMenuClick}
        onMenuOpen={() => console.log("Menu opened")}
        onMenuClose={() => console.log("Menu closed")}
      />
    </div>
  );
}

export default App;
