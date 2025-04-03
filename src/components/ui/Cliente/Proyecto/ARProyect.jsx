import React, { useEffect } from 'react';

const ARProyect = () => {
  useEffect(() => {
    console.log('Componente ARProyect montado.');
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <a-scene
        embedded
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; debugUIEnabled: false;"
      >
        {/* Marcador "hiro" para detectar el modelo */}
        <a-marker preset="hiro">
          {/* Carga el modelo de astronauta */}
          <a-entity
            gltf-model="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
            scale="0.5 0.5 0.5"
            rotation="0 180 0"
            position="0 0 0"
          ></a-entity>
        </a-marker>

        {/* Cámara de AR */}
        <a-entity camera></a-entity>
      </a-scene>
    </div>
  );
};

export default ARProyect;
