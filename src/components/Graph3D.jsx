import React, { useRef, useEffect } from "react";
import ForceGraph3D from "react-force-graph-3d";
import SpriteText from "three-spritetext";

const Graph3D = ({ data }) => {
  const fgRef = useRef();

  useEffect(() => {
    const controls = fgRef.current.controls();
    
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    // Limitar el zoom para no perder los nodos
    controls.minDistance = 50;
    controls.maxDistance = 800;

  }, []);

  // Centrar la vista cuando los datos cambian
  useEffect(() => {
    if (data.nodes.length > 0) {
      setTimeout(() => {
        fgRef.current.zoomToFit(400, 100);
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
        enableNodeDrag={false}
        enableNavigationControls={true}
        showNavInfo={false}
        // CLAVE: Desactivar el motor de física para usar posiciones fijas
        numDimensions={3}
        dagMode={null}
        // No usar d3Force ya que queremos posiciones fijas
        d3AlphaDecay={0}
        d3VelocityDecay={1}
        warmupTicks={0}
        cooldownTicks={0}
        // Esto asegura que el motor de física se detenga inmediatamente
        onEngineStop={() => {
          // Ya no necesitamos zoomToFit aquí porque usamos posiciones fijas
        }}
      />
    </div>
  );
};

export default Graph3D;
