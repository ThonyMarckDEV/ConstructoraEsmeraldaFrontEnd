import React, { useEffect } from "react";

const ARProyect = () => {
  useEffect(() => {
    console.log("Componente ARProyect montado.");
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <a-scene
        embedded
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; debugUIEnabled: false"
      >
        {/* Marcador de realidad aumentada */}
        <a-marker preset="hiro">
          {/* Modelo 3D predefinido de una casa */}
          <a-entity
            gltf-model="https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/House/glTF/House.gltf"
            scale="0.5 0.5 0.5"
            rotation="0 180 0"
            position="0 0 0"
          ></a-entity>
        </a-marker>

        {/* Cámara ajustada para ocupar toda la pantalla */}
        <a-entity camera position="0 0 0" look-controls-enabled="false"></a-entity>
      </a-scene>
    </div>
  );
};

export default ARProyect;
