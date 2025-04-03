import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ARProyect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [arSupported, setArSupported] = useState(false);
  const mountRef = useRef(null);
  const sessionRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const referenceSpaceRef = useRef(null);

  const MODEL_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf';

  useEffect(() => {
    const checkARSupport = async () => {
      if (navigator.xr) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          setArSupported(supported);
        } catch (err) {
          console.error("Error comprobando compatibilidad AR:", err);
          setArSupported(false);
        }
      }
      setLoading(false);
    };

    checkARSupport();

    return () => {
      if (sessionRef.current) {
        sessionRef.current.end();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  const startARSession = async () => {
    if (!mountRef.current || !arSupported) return;

    try {
      // 1. Configurar escena, cámara y renderer
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      rendererRef.current = renderer;

      // 2. Solicitar sesión AR
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local', 'hit-test']
      });
      sessionRef.current = session;

      // 3. Configurar XRWebGLLayer
      const glLayer = new XRWebGLLayer(session, renderer.getContext());
      session.updateRenderState({ baseLayer: glLayer });

      // 4. Solicitar espacio de referencia
      const referenceSpace = await session.requestReferenceSpace('local');
      referenceSpaceRef.current = referenceSpace;

      // 5. Agregar luces a la escena
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(0, 5, 5);
      scene.add(directionalLight);
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));

      // 6. Cargar modelo 3D
      const loader = new GLTFLoader();
      loader.load(MODEL_URL, (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.1, 0.1, 0.1);
        model.position.set(0, 0, -1);
        scene.add(model);
      });

      // 7. Loop de renderizado usando directamente el callback de setAnimationLoop
      renderer.setAnimationLoop((time, frame) => {
        if (frame) {
          const pose = frame.getViewerPose(referenceSpace);
          if (pose) {
            const view = pose.views[0];
            camera.projectionMatrix.fromArray(view.projectionMatrix);
          }
        }
        renderer.render(scene, camera);
      });

      // 8. Manejo del redimensionamiento de la ventana
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // 9. Agregar el canvas al DOM
      mountRef.current.appendChild(renderer.domElement);

    } catch (err) {
      console.error('Error al iniciar AR:', err);
      setError('Error al iniciar AR. Asegúrate de usar un dispositivo móvil compatible.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p>{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black">
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
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
              Iniciar AR
            </>
          ) : (
            "AR no soportado"
          )}
        </button>
      </div>
      {!arSupported && (
        <div className="absolute top-4 left-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700">
            Usa un dispositivo móvil compatible (iOS 12+ o Android 8+ con Chrome)
          </p>
        </div>
      )}
    </div>
  );
};

export default ARProyect;
