import React, { useState } from "react";
import FileIcon from "./FileIcon";
import FileMenu from "./FileMenu";

// Individual FileCard component
const FileCard = ({ file, onView, onDownload }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileTypeInfo = FileIcon.getFileIcon(file.fileType);
  
  const toggleMenu = () => {
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
  
  return (
    <div className="border rounded-md mb-3">
      <div className="p-4">
        <div className="flex items-start sm:items-center justify-between gap-2">
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
            <div className="text-gray-700 pt-1 sm:pt-0">
              {fileTypeInfo.icon}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0 flex-1">
              <span className={`${fileTypeInfo.color} mb-1 sm:mb-0 flex-shrink-0`}>{fileTypeInfo.emoji}</span>
              <span className="font-medium truncate min-w-0">
                {file.fileName}
              </span>
            </div>
          </div>
          <div className="relative flex-shrink-0">
            <button
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              onClick={toggleMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
              </svg>
            </button>
            
            {/* Submenu */}
            {isMenuOpen && (
              <>
                <FileMenu
                  onView={handleView}
                  onDownload={handleDownload}
                  fileType={file.fileType.toLowerCase()}
                />
                <div
                  className="fixed inset-0 z-0"
                  onClick={closeMenu}
                ></div>
              </>
            )}
          </div>
        </div>
      </div>
      {file.description && (
        <div className="px-4 pb-4 pt-0">
          <p className="text-sm">{file.description}</p>
        </div>
      )}
    </div>
  );
};

// Componente padre con la lista de archivos
const FilesSection = ({ allFiles, handleViewFile, handleDownloadFile }) => {
  return (
    <div className="rounded-lg bg-white shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">Archivos</h2>
        <p className="text-sm text-gray-500">{allFiles.length} elementos</p>
      </div>
      
      {/* Lista de archivos con scroll vertical */}
      <div className="max-h-64 overflow-y-auto p-4">
        {allFiles.length > 0 ? (
          allFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onView={handleViewFile}
              onDownload={handleDownloadFile}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay archivos disponibles para esta fase
          </div>
        )}
      </div>
    </div>
  );
};

export { FileCard, FilesSection };