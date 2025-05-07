import React, { useState } from 'react';
import API_BASE_URL from '../../../../js/urlHelper';
import { fetchWithAuth } from '../../../../js/authToken';
import { toast } from 'react-toastify';

const SubirModeloButton = ({ proyectoId, idFase, onSuccess = () => {}, onError = () => {} }) => {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
  
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb')) {
      toast.error('Solo se permiten archivos con extensión .glb');
      return;
    }

    // Verify file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('El archivo es demasiado grande. El tamaño máximo es 50MB');
      return;
    }
  
    // Create FormData
    const formData = new FormData();
    formData.append('modelo', file, file.name);
    formData.append('idProyecto', proyectoId);
    formData.append('idFase', idFase);
  
    try {
      setLoading(true);
      
      const response = await fetchWithAuth(`${API_BASE_URL}/api/manager/project/subir-modelo`, {
        method: 'POST',
        body: formData
      });
  
      const responseText = await response.text();
      
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
      toast.success('Modelo 3D subido correctamente');
      e.target.value = '';
    } catch (error) {
      console.error("Error al subir el modelo:", error);
      onError(error);
      toast.error(error.message || 'Error al subir el modelo');
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="relative">
      <label htmlFor={`upload-model-${idFase}`} className="cursor-pointer">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:rotate-6 active:scale-95 active:rotate-0 ${
          loading ? 'bg-gray-400 cursor-wait' : 'bg-green-500 hover:bg-green-600'
        }`}>
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
        </div>
      </label>
      <input
        type="file"
        id={`upload-model-${idFase}`}
        className="hidden"
        accept=".glb"
        onChange={handleFileChange}
        disabled={loading}
      />
    </div>
  );
};

export default SubirModeloButton;