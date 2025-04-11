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
      const response = await fetchWithAuth(`${API_BASE_URL}/api/project/files/download/${file.path}`);
      if (!response.ok) {
        throw new Error("Error en la descarga");
      }
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
          setContent(
            <div className="flex justify-center items-center w-full h-full">
              <img 
                src={`${API_BASE_URL}/storage/${file.path}`} 
                alt={file.fileName} 
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-sm"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                  setLoading(false);
                }}
                onLoad={() => setLoading(false)}
              />
            </div>
          );
        } else if (file.fileType === 'pdf') {
          setContent(
            <div className="h-[60vh] md:h-[75vh] w-full bg-gray-50 rounded-lg overflow-hidden">
              <iframe 
                src={`${API_BASE_URL}/storage/${file.path}#view=fitH`} 
                className="w-full h-full border-0"
                title={`PDF Viewer - ${file.fileName}`}
                onLoad={() => setLoading(false)}
              ></iframe>
            </div>
          );
        } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'dwg'].includes(file.fileType)) {
          setContent(
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg h-64 w-full">
              <div className="text-5xl mb-6">{fileTypeInfo.emoji}</div>
              <p className="text-lg font-medium text-gray-800">{file.fileType.toUpperCase()}</p>
              <p className="text-sm text-gray-500 mt-3">
                Descarga el archivo para ver su contenido
              </p>
            </div>
          );
          setLoading(false);
        } else {
          setContent(
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg h-64 w-full">
              <div className="text-5xl mb-6">{fileTypeInfo.emoji}</div>
              <p className="text-lg font-medium text-gray-800">Vista previa no disponible</p>
              <p className="text-sm text-gray-500 mt-3">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full md:w-[90%] max-h-[90vh] md:max-h-[95vh] overflow-hidden shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className={`text-2xl ${fileTypeInfo.color}`}>{fileTypeInfo.emoji}</span>
            <div className="overflow-hidden">
              <h3 className="font-semibold text-gray-800 truncate">{file.fileName}</h3>
              <p className="text-xs text-gray-500 truncate">{file.fileType.toUpperCase()}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-grow overflow-auto relative p-4 sm:p-6">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          {error && (
            <div className="p-4 mb-4 bg-red-50 border border-red-100 text-red-600 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            </div>
          )}
          {content}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 sm:px-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-between sm:justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            Cerrar
          </button>
          <button 
            onClick={handleDownload}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
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