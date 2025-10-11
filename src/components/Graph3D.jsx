import React, { useRef, useEffect } from "react";
import ForceGraph3D from "react-force-graph-3d";
import SpriteText from "three-spritetext";

const Graph3D = ({ data }) => {
  const fgRef = useRef();

  useEffect(() => {
    // Centrar cámara después de cargar
    if (fgRef.current) {
      fgRef.current.cameraPosition({ z: 300 });
    }
  }, []);

  return (
    <div className="w-full h-full">
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        backgroundColor="rgba(0,0,0,0)"
        nodeAutoColorBy="group"
        nodeThreeObjectExtend={true}
        nodeThreeObject={(node) => {
          const sprite = new SpriteText(node.id);
          sprite.color = node.color || "#ffffff";
          sprite.textHeight = 8;
          sprite.center.y = -0.6;
          sprite.backgroundColor = "rgba(0,0,0,0.5)";
          sprite.padding = 2;
          sprite.borderRadius = 4;
          return sprite;
        }}
        linkColor={() => "rgba(139, 92, 246, 0.3)"}
        linkWidth={2}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={() => 0.005}
        linkDirectionalParticleColor={() => "#8b5cf6"}
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
      />
    </div>
  );
};

export default Graph3D;
