import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import edificio from '../../../../glb/old_building.glb';

const ARProject = () => {
  // Obtener el ID del proyecto directamente de los parámetros de la URL
  const { id } = useParams();
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Detectar cambios en el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Verificar que tengamos un ID válido para la navegación
  const backUrl = id ? `/cliente/proyecto/${id}` : '/cliente/proyectos';

  useEffect(() => {
    // Registrar el ID del proyecto cuando el componente se monta
    console.log('ID del proyecto:', id);
  }, [id]);

  return (
    <div className="flex flex-row h-screen bg-gray-50">
      {/* Main content container */}
      <div className="flex-1 flex flex-col">
        {/* Header con botón para volver */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 shadow-md flex justify-between items-center">
          <h1 className="text-xl font-bold">Visualización AR del Proyecto</h1>
          <Link 
            to={backUrl}
            className="flex items-center bg-white text-blue-600 hover:bg-blue-50 rounded-lg shadow px-3 py-2 border border-blue-200 font-medium transition duration-300 ease-in-out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Volver</span>
          </Link>
        </div>
        
        {/* Instrucciones para el usuario */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mx-4 mt-4 text-blue-700">
          <p className="font-medium">Instrucciones:</p>
          <ol className="list-decimal pl-5 text-sm mt-1">
            <li>Utiliza los controles para rotar y hacer zoom al modelo</li>
            <li>Pulsa el botón "Ver en AR" para experimentar en realidad aumentada</li>
            <li>Mueve tu dispositivo para posicionar el modelo en tu entorno real</li>
          </ol>
        </div>
        
        {/* Contenedor principal del modelo */}
        <div className="flex-1 relative overflow-hidden m-4 bg-white rounded-lg shadow-lg">
          <model-viewer
            src={edificio}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            style={{ width: '100%', height: '100%' }}
            alt="Modelo 3D del edificio del proyecto"
            environment-image="neutral"
            shadow-intensity="1"
            exposure="0.8"
          >
            {/* Botón AR personalizado para mantener consistencia con el diseño */}
            <button 
              slot="ar-button" 
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-lg border-2 border-white font-medium transition duration-300 ease-in-out flex items-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.59961 5.60001L18.3996 18.4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2V4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 12H22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Ver en AR
            </button>
          </model-viewer>
          
        </div>
        
        {/* Footer con información adicional */}
        <div className="bg-gray-100 p-3 text-center text-gray-500 text-sm">
          Mueve, rota y escala el modelo utilizando gestos. Para una mejor experiencia AR, asegúrate de estar en una zona bien iluminada.
        </div>
      </div>
    </div>
  );
};

export default ARProject;