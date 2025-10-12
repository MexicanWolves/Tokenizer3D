import React, { useRef, useEffect } from "react";
import ForceGraph3D from "react-force-graph-3d";
import SpriteText from "three-spritetext";

const Graph3D = ({ data }) => {
  const fgRef = useRef();

  useEffect(() => {
    const controls = fgRef.current.controls();
    
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    // 2. Limitar el zoom para no perder los nodos
    controls.minDistance = 50;  // Distancia mínima de zoom
    controls.maxDistance = 800; // Distancia máxima de zoom

  }, []);

  // 3. Centrar la vista cuando los datos cambian o el motor se detiene
  useEffect(() => {
    if (data.nodes.length > 0) {
      // Espera un momento para que el motor de físicas empiece a actuar
      setTimeout(() => {
        fgRef.current.zoomToFit(400, 100); // Duración de 400ms, padding de 100px
      }, 100);
    }
  }, [data]);

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
        // 4. Centrar la vista automáticamente cuando el grafo se estabiliza
        onEngineStop={() => fgRef.current.zoomToFit(800, 100)}
      />
    </div>
  );
};

export default Graph3D;
