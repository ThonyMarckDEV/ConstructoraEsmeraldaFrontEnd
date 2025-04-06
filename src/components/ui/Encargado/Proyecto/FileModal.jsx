import React from "react";
import FileIcon from "./FileIcon";

const FileModal = ({ file, onClose, onDownload }) => {
  const fileTypeInfo = FileIcon.getFileIcon(file.fileType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold">{file.fileName}</h3>
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
        <div className="p-6">
          {/* Contenido del archivo iría aquí */}
          <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-md">
            {fileTypeInfo.emoji}
            <p className="text-lg font-medium mt-4">Vista previa del archivo</p>
            <p className="text-sm text-gray-500 mt-2">
              {file.fileType === 'pdf' && "Vista previa del PDF. En una implementación real, aquí se renderizaría el contenido del PDF."}
              {file.fileType === 'xlsx' && "Vista previa de Excel. En una implementación real, aquí se mostrarían tablas de datos."}
              {file.fileType === 'docx' && "Vista previa del documento Word. En una implementación real, aquí se mostraría el contenido formateado."}
            </p>
            <p className="mt-4 text-sm">{file.description}</p>
          </div>
        </div>
        <div className="p-4 border-t flex justify-end">
          <button 
            onClick={() => onDownload(file)}
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