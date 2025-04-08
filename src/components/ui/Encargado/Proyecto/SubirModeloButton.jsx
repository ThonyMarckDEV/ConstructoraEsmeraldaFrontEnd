import React, { useState } from 'react';
import API_BASE_URL from '../../../../js/urlHelper';
import { fetchWithAuth } from '../../../../js/authToken';

const SubirModeloButton = ({ proyectoId, onSuccess = () => {}, onError = () => {} }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
  
    if (!file) return;
  
    // Create FormData
    const formData = new FormData();
    
    // Add file with explicit name and filename parameters
    formData.append('modelo', file, file.name);
    formData.append('idProyecto', proyectoId);
    
    // Debug FormData content
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? 
        `File: ${value.name}, ${value.size} bytes` : value);
    }
  
    try {
      setLoading(true);
      setError(null);
      
      console.log("Sending request with fetchWithAuth...");
      const response = await fetchWithAuth(`${API_BASE_URL}/api/manager/project/subir-modelo`, {
        method: 'POST',
        // Not setting any headers here, letting fetchWithAuth handle it
        body: formData
      });
  
      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response body:", responseText);
      
      // Process response as before...
      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || 'Error al subir el modelo');
        } catch (e) {
          throw new Error('Error al subir el modelo');
        }
      }
  
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse success response:", e);
        data = { success: true };
      }
  
      setLoading(false);
      onSuccess(data);
      alert('Modelo 3D subido correctamente');
      e.target.value = '';
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
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Formatos soportados: .glb (Máx. 50MB)
      </p>
    </div>
  );
};

export default SubirModeloButton;
