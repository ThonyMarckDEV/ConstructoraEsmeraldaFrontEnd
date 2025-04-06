
import React, { useState, useEffect } from "react";
import FileIcon from "./FileIcon";
import API_BASE_URL from "../../../../js/urlHelper";
import { fetchWithAuth } from '../../../../js/authToken';

const FileModal = ({ file, onClose }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileTypeInfo = FileIcon.getFileIcon(file.fileType);

  const handleDownload = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/manager/project/files/download/${file.path}`);
      if (!response.ok) {
        throw new Error("Error en la descarga");
      }
      // Convierte la respuesta a blob para generar un URL de descarga
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error descargando el archivo", err);
    }
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        
        if (file.isPhoto) {
          // Para imágenes - solo vista previa
          setContent(
            <div className="flex justify-center">
              <img 
                src={`${API_BASE_URL}/storage/${file.path}`} 
                alt={file.fileName} 
                className="max-h-[70vh] max-w-full object-contain"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                  setLoading(false);
                }}
                onLoad={() => setLoading(false)}
              />
            </div>
          );
        } else if (file.fileType === 'pdf') {
          // Para PDFs - solo vista previa
          setContent(
            <div className="h-[50vh] sm:h-[75vh] flex flex-col items-center justify-center bg-gray-100 rounded-md">
              <iframe 
                src={`${API_BASE_URL}/storage/${file.path}#view=fitH`} 
                className="w-full h-full border-0"
                title={`PDF Viewer - ${file.fileName}`}
                onLoad={() => setLoading(false)}
              ></iframe>
            </div>
          );
        } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'dwg'].includes(file.fileType)) {
          // Para archivos sin vista previa integrada
          setContent(
            <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-md">
              <div className="text-4xl mb-4">{fileTypeInfo.emoji}</div>
              <p className="text-lg font-medium">Archivo {file.fileType.toUpperCase()}</p>
              <p className="text-sm text-gray-500 mt-2">
                Descarga el archivo para ver su contenido
              </p>
            </div>
          );
          setLoading(false);
        } else {
          // Para otros tipos de archivo
          setContent(
            <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-md">
              {fileTypeInfo.emoji}
              <p className="text-lg font-medium mt-4">Vista previa no disponible</p>
              <p className="text-sm text-gray-500 mt-2">
                Descarga el archivo para ver su contenido
              </p>
            </div>
          );
          setLoading(false);
        }
      } catch (err) {
        setError('Error al cargar la vista previa');
        setLoading(false);
        console.error('Error loading file preview:', err);
      }
    };

    loadContent();
  }, [file]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full sm:w-[90%] max-h-[90vh] sm:max-h-[95vh] overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={fileTypeInfo.color}>{fileTypeInfo.emoji}</span>
            <h3 className="font-bold truncate max-w-xs">{file.fileName}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="p-6 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {content}
        </div>
        
        <div className="p-4 border-t flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors"
          >
            Cerrar
          </button>
          <button 
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileModal;