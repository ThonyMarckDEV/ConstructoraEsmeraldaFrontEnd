import React, { useEffect } from 'react';

const ARProyect = () => {
  // Debido a que A-Frame trabaja con elementos personalizados en el DOM,
  // es buena práctica asegurarse de que el componente se monte completamente.
  useEffect(() => {
    // Esto es opcional, pero se puede usar para depuración o inicialización adicional.
    console.log("Componente ARProyect montado.");
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <a-scene 
        embedded
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; debugUIEnabled: false;">
        {/* El marcador "hiro" se usa para activar la experiencia AR */}
        <a-marker preset="hiro">
          {/* Reemplaza la URL del modelo GLB con la de tu modelo de casa */}
          <a-entity 
            gltf-model="url(https://your-domain.com/path/to/house-model.glb)" 
            scale="0.1 0.1 0.1"
            rotation="0 0 0"
            position="0 0 0">
          </a-entity>
        </a-marker>
        {/* Cámara para la experiencia AR */}
        <a-entity camera></a-entity>
      </a-scene>
    </div>
  );
};

export default ARProyect;
