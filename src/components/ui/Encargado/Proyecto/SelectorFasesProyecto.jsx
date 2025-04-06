import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';

const SelectorFasesProyecto = ({ proyectoId, fase, fases, onFaseChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentFase, setCurrentFase] = useState(fase || '');
  
  // Actualiza currentFase cuando cambia la prop fase
  useEffect(() => {
    setCurrentFase(fase || '');
  }, [fase]);
  
  const handleFaseChange = async (nuevaFase) => {
    if (nuevaFase === currentFase) {
      setIsOpen(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/manager/project/update-phase/${proyectoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fase: nuevaFase }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar la fase del proyecto');
      }
      
      window.location.reload(); // Recarga la página para reflejar el cambio de fase
    } catch (error) {
      console.error("Error updating project phase:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };
  
  // Encuentra el nombre de la fase actual
  const getCurrentPhaseName = () => {
    if (!currentFase) return 'No definida';
    
    // Si la fase es un número (índice)
    if (!isNaN(parseInt(currentFase))) {
      const index = parseInt(currentFase) - 1;
      return index >= 0 && index < fases.length ? fases[index].nombreFase : 'Fase ' + currentFase;
    }
    
    // Si la fase es un nombre
    return currentFase;
  };
  
  return (
    <div className="relative">
      <div className="mt-2 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fase del Proyecto
        </label>
        
        {/* Dropdown button */}
        <div className="relative">
          <button
            type="button"
            className={`w-full bg-white border ${isOpen ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} rounded-md py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className="block truncate">{getCurrentPhaseName()}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute right-10 top-2">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          
          {/* Dropdown menu */}
          {isOpen && (
            <ul
              className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              tabIndex="-1"
              role="listbox"
            >
              {fases.map((fase, index) => (
                <li
                  key={fase.idFase}
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${
                    (currentFase === fase.nombreFase || currentFase === (index + 1).toString()) ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  }`}
                  onClick={() => handleFaseChange(fase.nombreFase)}
                  role="option"
                >
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{index + 1}.</span>
                    <span className={`block truncate ${(currentFase === fase.nombreFase || currentFase === (index + 1).toString()) ? 'font-medium' : 'font-normal'}`}>
                      {fase.nombreFase}
                    </span>
                  </div>
                  
                  {(currentFase === fase.nombreFase || currentFase === (index + 1).toString()) && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default SelectorFasesProyecto;