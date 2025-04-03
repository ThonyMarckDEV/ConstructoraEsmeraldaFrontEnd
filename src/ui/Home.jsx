import React from 'react';
import { useNavigate } from 'react-router-dom';

// Componente Home principal
const Home = () => {
  const navigate = useNavigate();
  
  // Función para navegar a diferentes rutas
  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
          {/* Botón para Módulo 1 */}
          <button 
            onClick={() => navigateTo('/login')}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <span>Módulo Component</span>

          </button>
    </div>
  );
};

export default Home;