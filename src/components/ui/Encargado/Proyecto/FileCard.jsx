// export default FileCard;
import React, { useState } from "react";
import FileIcon from "./FileIcon";
import FileMenu from "./FileMenu";

const FileCard = ({ file, onView, onDownload, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
          <div className="relative flex-shrink-0 ">
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
                onDelete={handleDelete}
                isDeleting={isDeleting}
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


export { FileCard };

