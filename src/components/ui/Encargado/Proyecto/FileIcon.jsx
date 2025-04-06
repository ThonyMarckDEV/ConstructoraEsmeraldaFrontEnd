import React from "react";

const FileIcon = {
  getFileIcon: (fileType) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return {
          icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 16H16V18H8V16ZM8 12H16V14H8V12ZM14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"
                fill="currentColor"
              />
            </svg>
          ),
          emoji: '📄',
          color: 'text-blue-500'
        };
      case 'xlsx':
      case 'xls':
        return {
          icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM10 13H7V11H10V13ZM17 13H12V11H17V13ZM10 17H7V15H10V17ZM17 17H12V15H17V17Z"
                fill="currentColor"
              />
            </svg>
          ),
          emoji: '📊',
          color: 'text-green-500'
        };
      case 'docx':
      case 'doc':
        return {
          icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM10 13H7V11H10V13ZM17 13H12V11H17V13ZM10 17H7V15H10V17ZM17 17H12V15H17V17Z"
                fill="currentColor"
              />
            </svg>
          ),
          emoji: '📋',
          color: 'text-red-500'
        };
      default:
        return {
          icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"
                fill="currentColor"
              />
            </svg>
          ),
          emoji: '📁',
          color: 'text-gray-500'
        };
    }
  }
};

export default FileIcon;