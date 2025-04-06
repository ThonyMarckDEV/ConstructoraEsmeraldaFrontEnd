import React, { useState } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';

const SubirModeloButton = ({ proyectoId, onSuccess = () => {}, onError = () => {} }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  
  // Update your handleFileChange function
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Only check for file extension, not MIME type
    if (!file.name.toLowerCase().endsWith('.glb')) {
      setError('Solo se permiten archivos de tipo GLB.');
      onError('Solo se permiten archivos de tipo GLB.');
      e.target.value = '';
      return;
    }
      
    // Validar tamaño (50MB máximo)
    const maxSize = 50 * 1024 * 1024; // 50MB en bytes
    if (file.size > maxSize) {
      setError(`El archivo es demasiado grande. Máximo ${maxSize / (1024 * 1024)}MB permitido.`);
      onError(`El archivo es demasiado grande. Máximo ${maxSize / (1024 * 1024)}MB permitido.`);
      e.target.value = '';
      return;
    }
    
    // Preparar FormData
    const formData = new FormData();
    formData.append('modelo', file);
    formData.append('idProyecto', proyectoId);
    
    try {
      setLoading(true);
      setError(null);
      
      // Usar fetchWithAuth con un objeto controller de AbortController para monitoreo
      const controller = new AbortController();
      
      // Crear un controlador de progreso
      const progressController = new WritableStream({
        size(chunk) {
          // Calcular progreso basado en chunks, si es posible
          // Esto es una aproximación ya que fetch no expone directamente el progreso
          setProgress(Math.min(progress + 10, 95)); // Incremento aproximado
        }
      });
      
      // Configurar intervalo para simular progreso mientras se carga
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 500);
      
      // Realizar la petición con fetchWithAuth
      const response = await fetchWithAuth(`${API_BASE_URL}/api/manager/project/subir-modelo`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      // Limpiar el intervalo de progreso
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al subir el modelo');
      }
      
      // Procesar respuesta
      const data = await response.json();
      
      // Establecer progreso al 100% al finalizar
      setProgress(100);
      
      // Pequeña espera para mostrar el 100% antes de ocultar la barra
      setTimeout(() => {
        // Manejar respuesta exitosa
        setLoading(false);
        onSuccess(data);
        
        // Mostrar mensaje de éxito
        alert('Modelo 3D subido correctamente');
        
        // Reiniciar el input file
        e.target.value = '';
      }, 500);

      // console.log('Sending file:', file);
      // console.log('File type:', file.type);
      // console.log('File name:', file.name);
      // console.log('File size:', file.size);
      // console.log('Proyecto ID:', proyectoId);

      
    } catch (error) {
      console.error("Error al subir el modelo:", error);
      setError('Error al subir el modelo. Inténtelo de nuevo.');
      onError(error);
      setLoading(false);
      e.target.value = '';
    }
  };
  
  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <label 
          className={`relative flex items-center justify-center px-4 py-2 rounded-lg border ${
            loading ? 'bg-gray-100 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-medium transition-all cursor-pointer`}
        >
          <input
            type="file"
            accept=".glb"
            onChange={handleFileChange}
            className="absolute inset-0 w-0 h-0 opacity-0 cursor-pointer"
            disabled={loading}
          />
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {loading ? 'Subiendo...' : 'Subir Modelo 3D (.glb)'}
        </label>
        
        {loading && (
          <span className="text-sm text-gray-600 ml-2">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      
      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        Formatos soportados: .glb (Máx. 50MB)
      </p>
    </div>
  );
};

export default SubirModeloButton;