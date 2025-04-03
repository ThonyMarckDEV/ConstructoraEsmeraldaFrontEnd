// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { fetchWithAuth } from '../../../../js/authToken';
// import API_BASE_URL from '../../../../js/urlHelper';

// const ARProyect = () => {
//   const { proyectoId } = useParams();
//   const navigate = useNavigate();
//   const [modelo3D, setModelo3D] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [arSupported, setArSupported] = useState(false);
//   const mountRef = useRef(null);

//   useEffect(() => {
//     // Verificar soporte AR
//     const checkARSupport = async () => {
//       if ('xr' in navigator) {
//         try {
//           const supported = await navigator.xr.isSessionSupported('immersive-ar');
//           setArSupported(supported);
//         } catch (e) {
//           console.error("Error checking AR support:", e);
//           setArSupported(false);
//         }
//       }
//     };

//     // Cargar modelo
//     const fetchModel = async () => {
//       try {
//         const response = await fetchWithAuth(`${API_BASE_URL}/api/projects/${proyectoId}/ar-model`);
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || 'Failed to load AR model');
//         setModelo3D(data.modelUrl);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkARSupport();
//     fetchModel();

//     return () => {
//       if (mountRef.current) {
//         mountRef.current.innerHTML = '';
//       }
//     };
//   }, [proyectoId]);

//   const startARSession = async () => {
//     if (!modelo3D || !mountRef.current) return;

//     // Configuración básica de Three.js
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.xr.enabled = true;
//     mountRef.current.appendChild(renderer.domElement);

//     // Luz
//     const light = new THREE.AmbientLight(0xffffff, 1);
//     scene.add(light);

//     // Cargar modelo
//     const loader = new GLTFLoader();
//     loader.load(
//       modelo3D,
//       (gltf) => {
//         scene.add(gltf.scene);
//       },
//       undefined,
//       (error) => {
//         console.error('Error loading model:', error);
//         setError('Failed to load 3D model');
//       }
//     );

//     // Iniciar sesión AR
//     try {
//       const session = await navigator.xr.requestSession('immersive-ar');
//       renderer.xr.setSession(session);

//       const animate = () => {
//         renderer.setAnimationLoop(() => {
//           renderer.render(scene, camera);
//         });
//       };

//       animate();
//     } catch (err) {
//       console.error('AR session failed:', err);
//       setError('Failed to start AR session');
//     }
//   };

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="error">
//         <p>{error}</p>
//         <button onClick={() => navigate(-1)}>Back</button>
//       </div>
//     );
//   }

//   return (
//     <div className="ar-container">
//       <div ref={mountRef} className="ar-viewport" />
//       <button 
//         onClick={startARSession} 
//         disabled={!arSupported}
//         className={`ar-button ${!arSupported ? 'disabled' : ''}`}
//       >
//         {arSupported ? 'Start AR' : 'AR Not Supported'}
//       </button>
//     </div>
//   );
// };

// export default ARProyect;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ARProyect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [arSupported, setArSupported] = useState(false);
  const mountRef = useRef(null);

  // Modelo 3D predefinido (ejemplo: casa simple)
  const MODELO_PREDEFINIDO = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf';

  useEffect(() => {
    // Verificar soporte AR
    const checkARSupport = async () => {
      if ('xr' in navigator) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          setArSupported(supported);
        } catch (e) {
          console.error("Error checking AR support:", e);
          setArSupported(false);
        }
      }
    };

    checkARSupport();
    setLoading(false); // No hay que esperar por la carga del modelo

    return () => {
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, []);

  const startARSession = async () => {
    if (!mountRef.current) return;

    // Configuración básica de Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Luz
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    // Luz direccional para mejor visualización
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 0);
    scene.add(directionalLight);

    // Cargar modelo predefinido
    const loader = new GLTFLoader();
    loader.load(
      MODELO_PREDEFINIDO,
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        model.position.set(0, 0, -1);
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        setError('Failed to load 3D model');
      }
    );

    // Iniciar sesión AR
    try {
      const session = await navigator.xr.requestSession('immersive-ar');
      renderer.xr.setSession(session);

      const animate = () => {
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });
      };

      animate();
    } catch (err) {
      console.error('AR session failed:', err);
      setError('Failed to start AR session. Make sure you\'re using a compatible mobile device.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking AR capabilities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black">
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full"
      />
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <button
          onClick={startARSession}
          disabled={!arSupported}
          className={`px-6 py-3 rounded-full text-white flex items-center ${
            arSupported 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-500 cursor-not-allowed'
          }`}
        >
          {arSupported ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Start AR Experience
            </>
          ) : (
            "AR Not Supported"
          )}
        </button>
      </div>

      {!arSupported && (
        <div className="absolute top-4 left-4 right-4 bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700">
            For the best AR experience, use a compatible mobile device (iOS 12+ or Android 8+ with Chrome)
          </p>
        </div>
      )}
    </div>
  );
};

export default ARProyect;
