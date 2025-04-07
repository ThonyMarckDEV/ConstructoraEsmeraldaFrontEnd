import React, { useState } from "react";
import FileIcon from "./FileIcon";
import FileMenu from "./FileMenu";

const FileCard = ({ file, onView, onDownload, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileTypeInfo = FileIcon.getFileIcon(file.fileType);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleView = () => {
    onView(file);
    closeMenu();
  };

  const handleDownload = () => {
    onDownload(file);
    closeMenu();
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de querer eliminar ${file.fileName}?`)) {
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(file.id);
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setIsDeleting(false);
      closeMenu();
    }
  };

  return (
    <div className="col-span-1">
      <div 
        className="relative w-full bg-white rounded-lg shadow-sm border border-gray-200 p-3 transition-all duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center">
          <div className="w-10 h-10 flex items-center justify-center text-2xl mr-3 text-gray-600">
            {fileTypeInfo.icon || fileTypeInfo.emoji}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-gray-800 truncate" title={file.fileName}>
              {file.fileName}
            </div>
            <div className="flex text-xs text-gray-500 mt-0.5">
              <span className="uppercase mr-1.5">{file.fileType}</span>
            </div>
          </div>
          
          {(isHovered || isMenuOpen) && (
            <button 
              className="p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onClick={toggleMenu}
              aria-label="File options"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <circle cx="12" cy="6" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="18" r="1.5" />
              </svg>
            </button>
          )}
        </div>
        
        {isMenuOpen && (
          <FileMenu 
            onView={handleView}
            onDownload={handleDownload}
            onDelete={handleDelete}
            isDeleting={isDeleting}
            fileType={file.fileType}
            onClose={closeMenu}
          />
        )}
        
        {file.description && (
          <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-dashed border-gray-200">
            {file.description}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente contenedor del grid
export const FileGrid = ({ files, onView, onDownload, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onView={onView}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export { FileCard };