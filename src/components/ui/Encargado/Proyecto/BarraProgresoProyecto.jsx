import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingBarraProgresoProyecto from './LoadingBarraProgresoProyecto';
import SelectorFasesProyecto from './SelectorFasesProyecto';
import { fetchProjectWithPhases, getChatIdByProyecto, updateProjectPhase } from './utilities/endpoints';

const BarraProgresoProyecto = ({ proyectoId }) => {
  const [proyecto, setProyecto] = useState(null);
  const [fases, setFases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatError, setChatError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setChatLoading(true);

        // Fetch combined project and phases data
        const data = await fetchProjectWithPhases(proyectoId);
        setProyecto(data.proyecto);
        setFases(data.fases);

        // Fetch chat ID
        try {
          const chatId = await getChatIdByProyecto(proyectoId);
          setChatId(chatId);
        } catch (chatErr) {
          setChatError('No se pudo cargar el chat para este proyecto.');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
        setChatLoading(false);
      }
    };

    if (proyectoId) {
      fetchData();
    }
  }, [proyectoId]);

  const getCurrentPhaseIndex = () => {
    if (!proyecto?.fase || proyecto.fase.trim() === '') {
      return 0;
    }
    if (!isNaN(parseInt(proyecto.fase))) {
      return parseInt(proyecto.fase);
    }
    const phaseIndex = fases.findIndex(
      fase => fase.nombreFase.toLowerCase() === proyecto.fase.toLowerCase()
    );
    return phaseIndex !== -1 ? phaseIndex + 1 : 0;
  };

  const handleFaseChange = async (nuevaFase) => {
    try {
      await updateProjectPhase(proyectoId, nuevaFase);
      setProyecto({
        ...proyecto,
        fase: nuevaFase
      });
    } catch (error) {
      console.error('Error updating phase:', error);
      setError(error.message);
    }
  };

  const hasFase = proyecto?.fase && proyecto.fase.trim() !== '';
  const currentPhase = getCurrentPhaseIndex();
  const progressPercentage = hasFase && fases.length > 0 && currentPhase > 0 ? (currentPhase / fases.length) * 100 : 0;
  const currentPhaseName = hasFase ? (
    currentPhase > 0 && currentPhase <= fases.length
      ? fases[currentPhase - 1]?.nombreFase
      : proyecto.fase
  ) : '';

  if (loading) {
    return <LoadingBarraProgresoProyecto />;
  }

  if (error) {
    return (
      <div className="w-full bg-white shadow-lg p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!proyecto || fases.length === 0) {
    return (
      <div className="w-full bg-white shadow-lg p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700">No se encontraron datos del proyecto o sus fases.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white shadow-lg">
      <div className="relative h-40 md:h-48 bg-gradient-to-r from-green-800 to-green-600 overflow-hidden w-full">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center"
             style={{backgroundImage: `url('/api/placeholder/1920/300')`}} />
        <div className="absolute inset-0 hidden md:flex items-center justify-center">
          <div className="grid grid-cols-4 gap-4 opacity-10">
            <span className="text-6xl">🏗️</span>
            <span className="text-6xl">🏢</span>
            <span className="text-6xl">🔧</span>
            <span className="text-6xl">📐</span>
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center p-4 md:p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Proyecto: {proyecto.nombre}</h1>
            </div>
            <div className="hidden md:flex space-x-2">
              {chatLoading ? (
                <div className="flex items-center bg-white text-green-600 rounded-lg shadow-lg px-3 py-2 border border-green-200 font-medium">
                  <svg className="animate-spin h-5 w-5 mr-2 text-green-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Cargando chat...</span>
                </div>
              ) : chatError ? (
                <div className="flex items-center bg-white text-red-600 rounded-lg shadow-lg px-3 py-2 border border-red-200 font-medium">
                  <span>{chatError}</span>
                </div>
              ) : (
                <Link
                  to={chatId ? `/encargado/proyecto/chat/${chatId}` : '#'}
                  className={`flex items-center bg-white text-green-600 hover:bg-green-50 rounded-lg shadow-lg px-3 py-2 border border-green-200 font-medium transition duration-300 ease-in-out transform hover:scale-105 ${!chatId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={(e) => !chatId && e.preventDefault()}
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  <span>Chat</span>
                </Link>
              )}
            </div>
          </div>
          <div className="mt-2 md:mt-4 flex items-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-green-700 flex items-center justify-center font-bold text-lg md:text-xl border-2 md:border-4 border-green-300">
              {progressPercentage ? Math.round(progressPercentage) : 0}%
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-base md:text-lg font-medium">Estado: {proyecto.estado || 'En Progreso'}</p>
              <p className="text-xs md:text-sm opacity-80">
                Actualizado: {new Date(proyecto.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 md:hidden z-10 flex flex-col space-y-2">
        {chatLoading ? (
          <div className="flex items-center justify-center bg-green-500 text-white rounded-full w-14 h-14 shadow-lg border-2 border-white">
            <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : chatError ? (
          <div className="flex items-center justify-center bg-red-500 text-white rounded-full w-14 h-14 shadow-lg border-2 border-white">
            <span className="text-xs text-center">Chat no disponible</span>
          </div>
        ) : (
          <Link
            to={chatId ? `/encargado/proyecto/chat/${chatId}` : '#'}
            className={`flex items-center justify-center bg-green-500 text-white rounded-full w-14 h-14 shadow-lg border-2 border-white transition duration-300 ease-in-out hover:bg-green-600 ${!chatId ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={(e) => !chatId && e.preventDefault()}
          >
            <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </Link>
        )}
      </div>

      <div className="p-4 md:p-6">
        <SelectorFasesProyecto
          proyectoId={proyectoId}
          fase={proyecto.fase}
          fases={fases}
          onFaseChange={handleFaseChange}
        />
        <div className="w-full bg-gray-200 rounded-full h-3 md:h-4 mb-4 md:mb-6">
          <div
            className="bg-green-600 h-3 md:h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        {hasFase ? (
          <div className="bg-blue-50 border-l-4 border-green-500 p-3 md:p-4 mb-4 md:mb-6">
            <div className="flex items-center">
              {currentPhase > 0 && (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold mr-2 md:mr-3 text-sm md:text-base">
                  {currentPhase}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-semibold text-green-800">Fase actual:</h3>
                <p className="text-sm md:text-base text-green-700">
                  {currentPhaseName || 'No encontrada'}
                </p>
              </div>
              <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="md:hidden text-green-600 p-1"
              >
                {isDetailsOpen ? '▲' : '▼'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border-l-4 border-gray-300 p-3 md:p-4 mb-4 md:mb-6">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-semibold text-gray-600">Fase actual:</h3>
                <p className="text-sm md:text-base text-gray-500">
                  No definida
                </p>
              </div>
              <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="md:hidden text-gray-600 p-1"
              >
                {isDetailsOpen ? '▲' : '▼'}
              </button>
            </div>
          </div>
        )}
        <div className="relative mt-6 mb-4 hidden md:block">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 -translate-y-1/2" />
          <div className="flex justify-between relative">
            {fases.map((fase, index) => (
              <div
                key={fase.idFase}
                className={`flex flex-col items-center ${hasFase && currentPhase > 0 && index + 1 <= currentPhase ? 'text-green-600' : 'text-gray-400'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 ${
                    hasFase && currentPhase > 0 && index + 1 < currentPhase
                      ? 'bg-green-600 text-white'
                      : hasFase && currentPhase > 0 && index + 1 === currentPhase
                        ? 'bg-white border-4 border-green-600 text-green-600'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="mt-2 text-xs font-medium text-center max-w-16 whitespace-normal">
                  {hasFase && currentPhase > 0 && index + 1 === currentPhase ?
                    <strong>{fase.nombreFase.split(' ')[0]}</strong> :
                    fase.nombreFase.split(' ')[0]
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`md:hidden ${isDetailsOpen ? 'block' : 'hidden'}`}>
          <div className="overflow-x-auto pb-4">
            <div className="relative min-w-max">
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300" />
              <div className="flex space-x-12 relative">
                {fases.map((fase, index) => (
                  <div
                    key={fase.idFase}
                    className={`flex flex-col items-center ${hasFase && currentPhase > 0 && index + 1 <= currentPhase ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 ${
                        hasFase && currentPhase > 0 && index + 1 < currentPhase
                          ? 'bg-green-600 text-white'
                          : hasFase && currentPhase > 0 && index + 1 === currentPhase
                            ? 'bg-white border-4 border-green-600 text-green-600'
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="mt-2 text-xs font-medium text-center max-w-20">
                      {fase.nombreFase}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-gray-500 -mt-2">
            ← Desliza para ver todas las fases →
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarraProgresoProyecto;