import React from 'react';
import Sidebar from '../../../../components/ui/Cliente/Sidebar';
import edificio from '../../../../glb/building_04.glb';

const ARProject = ({ proyectoId }) => {
  return (
    <div>
      <Sidebar username="Cliente" />
      <div style={{ width: '100%', height: '100vh' }}>
        <model-viewer
          // src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
          src={edificio}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          style={{ width: '100%', height: '100%' }}
          alt="Astronaut 3D model"
          environment-image="neutral"
          shadow-intensity="1"
        >
          <button slot="ar-button" style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            background: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Ver en AR
          </button>
        </model-viewer>
      </div>
    </div>
  );
};

export default ARProject;