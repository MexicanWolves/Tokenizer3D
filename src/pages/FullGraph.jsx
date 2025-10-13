import ForceGraph3D from "react-force-graph-3d";
import data from "../data/data.json";
import { useEffect, useRef } from "react";
import SpriteText from "three-spritetext";

const FullGraph = () => {
  const fgRef = useRef();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '5px',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif'
      }}>
        4000 words being rendered
      </div>
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
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
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
        onEngineStop={() => fgRef.current.zoomToFit(800, 100)}
      />
    </div>
  );
};

export default FullGraph;