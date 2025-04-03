import React, { useState } from 'react';

const ProgressBar = ({ currentPhase = 2 }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const phases = [
    {
      id: 1,
      title: "Planificación y Diseño 📝"
    },
    {
      id: 2,
      title: "Preparación del Terreno 🌍"
    },
    {
      id: 3,
      title: "Construcción de Cimientos 🏗️"
    },
    {
      id: 4,
      title: "Estructura y Superestructura 🏢"
    },
    {
      id: 5,
      title: "Instalaciones ⚡"
    },
    {
      id: 6,
      title: "Acabados 🎨"
    },
    {
      id: 7,
      title: "Inspección y Pruebas 🔍"
    },
    {
      id: 8,
      title: "Entrega 🎉"
    }
  ];

  // Calculate progress percentage
  const progressPercentage = (currentPhase / phases.length) * 100;

  return (
    <div className="w-full bg-white shadow-lg">
      {/* Enhanced Header with background image - full width */}
      <div className="relative h-40 md:h-48 bg-gradient-to-r from-blue-800 to-blue-600 overflow-hidden w-full">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" 
             style={{backgroundImage: `url('/api/placeholder/1920/300')`}} />
        
        {/* Overlay with construction icons - hidden on mobile */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center">
          <div className="grid grid-cols-4 gap-4 opacity-10">
            <span className="text-6xl">🏗️</span>
            <span className="text-6xl">🏢</span>
            <span className="text-6xl">🔧</span>
            <span className="text-6xl">📐</span>
          </div>
        </div>
        
        {/* Text content */}
        <div className="absolute inset-0 flex flex-col justify-center p-4 md:p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">PROYECTO DE CONSTRUCCIÓN</h1>
          <h2 className="text-lg md:text-xl font-semibold">Casa en AV H, Los Geranios lote 1 Mz 5</h2>
          
          <div className="mt-2 md:mt-4 flex items-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold text-lg md:text-xl border-2 md:border-4 border-blue-300">
              {Math.round(progressPercentage)}%
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-base md:text-lg font-medium">Estado: En Progreso</p>
              <p className="text-xs md:text-sm opacity-80">Actualizado: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress section */}
      <div className="p-4 md:p-6">
        {/* Main progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 md:h-4 mb-4 md:mb-6">
          <div 
            className="bg-blue-600 h-3 md:h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Current phase highlight box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-2 md:mr-3 text-sm md:text-base">
              {currentPhase}
            </div>
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-semibold text-blue-800">Fase actual:</h3>
              <p className="text-sm md:text-base text-blue-700">{phases[currentPhase-1]?.title}</p>
            </div>
            <button 
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="md:hidden text-blue-600 p-1"
            >
              {isDetailsOpen ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {/* Scrollable phase indicators - For desktop */}
        <div className="relative mt-6 mb-4 hidden md:block">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 -translate-y-1/2" />
          
          {/* Phase points and titles */}
          <div className="flex justify-between relative">
            {phases.map((phase) => (
              <div 
                key={phase.id} 
                className={`flex flex-col items-center ${phase.id <= currentPhase ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 ${
                    phase.id < currentPhase 
                      ? 'bg-blue-600 text-white' 
                      : phase.id === currentPhase 
                        ? 'bg-white border-4 border-blue-600 text-blue-600' 
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                  }`}
                >
                  {phase.id}
                </div>
                <div className="mt-2 text-xs font-medium text-center max-w-16 whitespace-normal">
                  {phase.id === currentPhase ? <strong>{phase.title.split(' ')[0]}</strong> : phase.title.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile view - Horizontal scrollable timeline */}
        <div className={`md:hidden ${isDetailsOpen ? 'block' : 'hidden'}`}>
          <div className="overflow-x-auto pb-4">
            <div className="relative min-w-max">
              {/* Connecting line */}
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300" />
              
              {/* Phase points and titles */}
              <div className="flex space-x-12 relative">
                {phases.map((phase) => (
                  <div 
                    key={phase.id} 
                    className={`flex flex-col items-center ${phase.id <= currentPhase ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 ${
                        phase.id < currentPhase 
                          ? 'bg-blue-600 text-white' 
                          : phase.id === currentPhase 
                            ? 'bg-white border-4 border-blue-600 text-blue-600' 
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {phase.id}
                    </div>
                    <div className="mt-2 text-xs font-medium text-center max-w-20">
                      {phase.title}
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

export default ProgressBar;