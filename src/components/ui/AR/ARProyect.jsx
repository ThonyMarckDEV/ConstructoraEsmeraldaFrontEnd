import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import jwtUtils from '../../../utilities/jwtUtils';
import { fetchWithAuth } from '../../../js/authToken';
import API_BASE_URL from '../../../js/urlHelper';

const ARProject = () => {
  const { id, idFase } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [modelPath, setModelPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = jwtUtils.getRefreshTokenFromCookie();

  const getUserRoleNormalized = () => {
    const role = jwtUtils.getUserRole(token);
    if (role === 'manager') return 'encargado';
    if (role === 'admin') return 'admin';
    return role || 'cliente';
  };

  const role = getUserRoleNormalized();
  const backUrl = id ? `/${role}/proyecto/${id}` : `/${role}/proyectos`;

  useEffect(() => {
    const fetchModel = async () => {
      if (!id || !idFase) {
        setError('ID de proyecto o fase no proporcionado');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
    
        const metaResponse = await fetchWithAuth(`${API_BASE_URL}/api/project/${id}/${idFase}/modelo`);
        
        if (!metaResponse.ok) {
          throw new Error(`Error ${metaResponse.status} al obtener metadatos del modelo`);
        }
    
        const metaData = await metaResponse.json();
        
        if (!metaData.success) {
          throw new Error('No se pudo obtener información del modelo');
        }
    
        const modelUrl = metaData.data.modelo_url;
        if (!modelUrl) {
          throw new Error('URL del modelo no encontrada en la respuesta');
        }
    
        const modelResponse = await fetchWithAuth(modelUrl, {
          headers: {
            'Accept': 'model/gltf-binary'
          }
        });
        
        if (!modelResponse.ok) {
          const errorText = await modelResponse.text();
          throw new Error(`Error ${modelResponse.status} al descargar modelo: ${errorText}`);
        }
    
        const blob = await modelResponse.blob();
        
        if (blob.size === 0) {
          throw new Error('El archivo recibido está vacío');
        }
    
        const objectUrl = URL.createObjectURL(blob);
        setModelPath(objectUrl);
    
      } catch (err) {
        console.error('Error fetching model:', err);
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModel();
  }, [id, idFase]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-row h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <div className="bg-gradient-to-r from-green-800 to-green-600 text-white p-4 shadow-md flex justify-between items-center">
          <h1 className="text-xl font-bold">Visualización AR de la fase</h1>
          <Link 
            to={backUrl}
            className="flex items-center bg-white text-green-600 hover:bg-blue-50 rounded-lg shadow px-3 py-2 border border-green-200 font-medium transition duration-300 ease-in-out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Volver</span>
          </Link>
        </div>

        <div className="bg-blue-50 border-l-4 border-green-500 p-3 mx-4 mt-4 text-green-700">
          <p className="font-medium">Instrucciones:</p>
          <ol className="list-decimal pl-5 text-sm mt-1">
            <li>Utiliza los controles para rotar y hacer zoom al modelo</li>
            <li>Pulsa el botón "Ver en AR" para experimentar en realidad aumentada</li>
            <li>Mueve tu dispositivo para posicionar el modelo en tu entorno real</li>
          </ol>
        </div>
        
        <div className="flex-1 relative overflow-hidden m-4 bg-white rounded-lg shadow-lg">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
              <div className="text-green-600">
                <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50">
              <div className="text-red-600 text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="font-medium">{error}</p>
                <p className="text-sm mt-2">Verifica la conexión e intenta de nuevo</p>
              </div>
            </div>
          )}
          
          {!loading && !error && modelPath && (
            <model-viewer
              src={modelPath}
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
              <button 
                slot="ar-button" 
                className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg shadow-lg border-2 border-white font-medium transition duration-300 ease-in-out flex items-center"
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
          )}
        </div>
        
        <div className="bg-gray-100 p-3 text-center text-gray-500 text-sm">
          Mueve, rota y escala el modelo utilizando gestos. Para una mejor experiencia AR, asegúrate de estar en una zona bien iluminada.
        </div>
      </div>
    </div>
  );
};

export default ARProject;