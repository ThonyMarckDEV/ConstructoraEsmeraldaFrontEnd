// import React, { useState, useEffect } from 'react';
// import { fetchWithAuth } from '../../../../js/authToken';
// import API_BASE_URL from '../../../../js/urlHelper';

// const BarraProgresoProyecto = ({ proyectoId }) => {
//   const [proyecto, setProyecto] = useState(null);
//   const [fases, setFases] = useState([]);
//   const [archivos, setArchivos] = useState([]);
//   const [fotos, setFotos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
//   useEffect(() => {
//     const fetchProjectData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch project details
//         const proyectoResponse = await fetchWithAuth(`${API_BASE_URL}/api/client/projects/${proyectoId}`);
//         const proyectoData = await proyectoResponse.json();
        
//         if (!proyectoResponse.ok) {
//           throw new Error(proyectoData.message || 'Error al obtener datos del proyecto');
//         }
        
//         setProyecto(proyectoData);
        
//         // Fetch project phases
//         const fasesResponse = await fetchWithAuth(`${API_BASE_URL}/api/client/projects/${proyectoId}/phases`);
//         const fasesData = await fasesResponse.json();
        
//         if (!fasesResponse.ok) {
//           throw new Error(fasesData.message || 'Error al obtener fases del proyecto');
//         }
        
//         setFases(fasesData);
        
//       } catch (error) {
//         console.error("Error fetching project data:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     if (proyectoId) {
//       fetchProjectData();
//     }
//   }, [proyectoId]);
  
//   // Find current phase index by name or by number
//   const getCurrentPhaseIndex = () => {
//     if (!proyecto?.fase || proyecto.fase.trim() === "") {
//       return 0; // No phase defined
//     }
    
//     // If fase is a number, parse it directly
//     if (!isNaN(parseInt(proyecto.fase))) {
//       return parseInt(proyecto.fase);
//     }
    
//     // If fase is a string, find the corresponding phase by name
//     const phaseIndex = fases.findIndex(
//       fase => fase.nombreFase.toLowerCase() === proyecto.fase.toLowerCase()
//     );
    
//     // If found, return 1-based index (to match existing logic), otherwise return 0
//     return phaseIndex !== -1 ? phaseIndex + 1 : 0;
//   };
  
//   const hasFase = proyecto?.fase && proyecto.fase.trim() !== "";
//   const currentPhase = getCurrentPhaseIndex();
  
//   // Calculate progress percentage - if no phase is defined, progress is 0
//   const progressPercentage = hasFase && fases.length > 0 && currentPhase > 0 ? (currentPhase / fases.length) * 100 : 0;
  
//   if (loading) {
//     return (
//       <div className="w-full bg-white shadow-lg p-6 flex justify-center items-center h-40">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }
  
//   if (error) {
//     return (
//       <div className="w-full bg-white shadow-lg p-6">
//         <div className="bg-red-50 border-l-4 border-red-500 p-4">
//           <p className="text-red-700">Error: {error}</p>
//         </div>
//       </div>
//     );
//   }
  
//   if (!proyecto || fases.length === 0) {
//     return (
//       <div className="w-full bg-white shadow-lg p-6">
//         <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
//           <p className="text-yellow-700">No se encontraron datos del proyecto o sus fases.</p>
//         </div>
//       </div>
//     );
//   }

//   // Get current phase name
//   const currentPhaseName = hasFase ? (
//     currentPhase > 0 && currentPhase <= fases.length 
//       ? fases[currentPhase - 1]?.nombreFase 
//       : proyecto.fase // Use the original phase name from API if no match found
//   ) : '';

//   return (
//     <div className="w-full bg-white shadow-lg">
//       {/* Enhanced Header with background image - full width */}
//       <div className="relative h-40 md:h-48 bg-gradient-to-r from-blue-800 to-blue-600 overflow-hidden w-full">
//         {/* Background Image Placeholder */}
//         <div className="absolute inset-0 opacity-20 bg-cover bg-center" 
//              style={{backgroundImage: `url('/api/placeholder/1920/300')`}} />
        
//         {/* Overlay with construction icons - hidden on mobile */}
//         <div className="absolute inset-0 hidden md:flex items-center justify-center">
//           <div className="grid grid-cols-4 gap-4 opacity-10">
//             <span className="text-6xl">🏗️</span>
//             <span className="text-6xl">🏢</span>
//             <span className="text-6xl">🔧</span>
//             <span className="text-6xl">📐</span>
//           </div>
//         </div>
        
//         {/* Text content */}
//         <div className="absolute inset-0 flex flex-col justify-center p-4 md:p-6 text-white">
//           <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">PROYECTO DE CONSTRUCCIÓN</h1>
//           <h2 className="text-lg md:text-xl font-semibold">{proyecto.nombre}</h2>
          
//           <div className="mt-2 md:mt-4 flex items-center">
//             <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold text-lg md:text-xl border-2 md:border-4 border-blue-300">
//               {progressPercentage ? Math.round(progressPercentage) : 0}%
//             </div>
//             <div className="ml-3 md:ml-4">
//               <p className="text-base md:text-lg font-medium">Estado: {proyecto.estado || 'En Progreso'}</p>
//               <p className="text-xs md:text-sm opacity-80">
//                 Actualizado: {new Date(proyecto.updated_at).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Progress section */}
//       <div className="p-4 md:p-6">
//         {/* Main progress bar */}
//         <div className="w-full bg-gray-200 rounded-full h-3 md:h-4 mb-4 md:mb-6">
//           <div 
//             className="bg-blue-600 h-3 md:h-4 rounded-full transition-all duration-500 ease-out"
//             style={{ width: `${progressPercentage}%` }}
//           />
//         </div>

//         {/* Current phase highlight box - only shown if we have a phase */}
//         {hasFase ? (
//           <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 mb-4 md:mb-6">
//             <div className="flex items-center">
//               {currentPhase > 0 && (
//                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-2 md:mr-3 text-sm md:text-base">
//                   {currentPhase}
//                 </div>
//               )}
//               <div className="flex-1">
//                 <h3 className="text-base md:text-lg font-semibold text-blue-800">Fase actual:</h3>
//                 <p className="text-sm md:text-base text-blue-700">
//                   {currentPhaseName || 'No encontrada'}
//                 </p>
//               </div>
//               <button 
//                 onClick={() => setIsDetailsOpen(!isDetailsOpen)}
//                 className="md:hidden text-blue-600 p-1"
//               >
//                 {isDetailsOpen ? '▲' : '▼'}
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-gray-50 border-l-4 border-gray-300 p-3 md:p-4 mb-4 md:mb-6">
//             <div className="flex items-center">
//               <div className="flex-1">
//                 <h3 className="text-base md:text-lg font-semibold text-gray-600">Fase actual:</h3>
//                 <p className="text-sm md:text-base text-gray-500">
//                   No definida
//                 </p>
//               </div>
//               <button 
//                 onClick={() => setIsDetailsOpen(!isDetailsOpen)}
//                 className="md:hidden text-gray-600 p-1"
//               >
//                 {isDetailsOpen ? '▲' : '▼'}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Scrollable phase indicators - For desktop */}
//         <div className="relative mt-6 mb-4 hidden md:block">
//           {/* Connecting line */}
//           <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 -translate-y-1/2" />
          
//           {/* Phase points and titles */}
//           <div className="flex justify-between relative">
//             {fases.map((fase, index) => (
//               <div 
//                 key={fase.idFase} 
//                 className={`flex flex-col items-center ${hasFase && currentPhase > 0 && index + 1 <= currentPhase ? 'text-blue-600' : 'text-gray-400'}`}
//               >
//                 <div 
//                   className={`w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 ${
//                     hasFase && currentPhase > 0 && index + 1 < currentPhase 
//                       ? 'bg-blue-600 text-white' 
//                       : hasFase && currentPhase > 0 && index + 1 === currentPhase 
//                         ? 'bg-white border-4 border-blue-600 text-blue-600' 
//                         : 'bg-white border-2 border-gray-300 text-gray-400'
//                   }`}
//                 >
//                   {index + 1}
//                 </div>
//                 <div className="mt-2 text-xs font-medium text-center max-w-16 whitespace-normal">
//                   {hasFase && currentPhase > 0 && index + 1 === currentPhase ? 
//                     <strong>{fase.nombreFase.split(' ')[0]}</strong> : 
//                     fase.nombreFase.split(' ')[0]
//                   }
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Mobile view - Horizontal scrollable timeline */}
//         <div className={`md:hidden ${isDetailsOpen ? 'block' : 'hidden'}`}>
//           <div className="overflow-x-auto pb-4">
//             <div className="relative min-w-max">
//               {/* Connecting line */}
//               <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300" />
              
//               {/* Phase points and titles */}
//               <div className="flex space-x-12 relative">
//                 {fases.map((fase, index) => (
//                   <div 
//                     key={fase.idFase} 
//                     className={`flex flex-col items-center ${hasFase && currentPhase > 0 && index + 1 <= currentPhase ? 'text-blue-600' : 'text-gray-400'}`}
//                   >
//                     <div 
//                       className={`w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 ${
//                         hasFase && currentPhase > 0 && index + 1 < currentPhase 
//                           ? 'bg-blue-600 text-white' 
//                           : hasFase && currentPhase > 0 && index + 1 === currentPhase 
//                             ? 'bg-white border-4 border-blue-600 text-blue-600' 
//                             : 'bg-white border-2 border-gray-300 text-gray-400'
//                       }`}
//                     >
//                       {index + 1}
//                     </div>
//                     <div className="mt-2 text-xs font-medium text-center max-w-20">
//                       {fase.nombreFase}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//           <div className="text-center text-xs text-gray-500 -mt-2">
//             ← Desliza para ver todas las fases →
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BarraProgresoProyecto;

import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import { Link } from 'react-router-dom';

const BarraProgresoProyecto = ({ proyectoId }) => {
  const [proyecto, setProyecto] = useState(null);
  const [fases, setFases] = useState([]);
  const [archivos, setArchivos] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        // Fetch project details
        const proyectoResponse = await fetchWithAuth(`${API_BASE_URL}/api/client/projects/${proyectoId}`);
        const proyectoData = await proyectoResponse.json();
        
        if (!proyectoResponse.ok) {
          throw new Error(proyectoData.message || 'Error al obtener datos del proyecto');
        }
        
        setProyecto(proyectoData);
        
        // Fetch project phases
        const fasesResponse = await fetchWithAuth(`${API_BASE_URL}/api/client/projects/${proyectoId}/phases`);
        const fasesData = await fasesResponse.json();
        
        if (!fasesResponse.ok) {
          throw new Error(fasesData.message || 'Error al obtener fases del proyecto');
        }
        
        setFases(fasesData);
        
      } catch (error) {
        console.error("Error fetching project data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (proyectoId) {
      fetchProjectData();
    }
  }, [proyectoId]);
  
  // Find current phase index by name or by number
  const getCurrentPhaseIndex = () => {
    if (!proyecto?.fase || proyecto.fase.trim() === "") {
      return 0; // No phase defined
    }
    
    // If fase is a number, parse it directly
    if (!isNaN(parseInt(proyecto.fase))) {
      return parseInt(proyecto.fase);
    }
    
    // If fase is a string, find the corresponding phase by name
    const phaseIndex = fases.findIndex(
      fase => fase.nombreFase.toLowerCase() === proyecto.fase.toLowerCase()
    );
    
    // If found, return 1-based index (to match existing logic), otherwise return 0
    return phaseIndex !== -1 ? phaseIndex + 1 : 0;
  };
  
  const hasFase = proyecto?.fase && proyecto.fase.trim() !== "";
  const currentPhase = getCurrentPhaseIndex();
  
  // Calculate progress percentage - if no phase is defined, progress is 0
  const progressPercentage = hasFase && fases.length > 0 && currentPhase > 0 ? (currentPhase / fases.length) * 100 : 0;
  
  if (loading) {
    return (
      <div className="w-full bg-white shadow-lg p-6 flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
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

  // Get current phase name
  const currentPhaseName = hasFase ? (
    currentPhase > 0 && currentPhase <= fases.length 
      ? fases[currentPhase - 1]?.nombreFase 
      : proyecto.fase // Use the original phase name from API if no match found
  ) : '';

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
          <h2 className="text-lg md:text-xl font-semibold">{proyecto.nombre}</h2>
          
          <div className="mt-2 md:mt-4 flex items-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold text-lg md:text-xl border-2 md:border-4 border-blue-300">
              {progressPercentage ? Math.round(progressPercentage) : 0}%
            </div>
            <div className="ml-3 md:ml-4">
              <p className="text-base md:text-lg font-medium">Estado: {proyecto.estado || 'En Progreso'}</p>
              <p className="text-xs md:text-sm opacity-80">
                Actualizado: {new Date(proyecto.updated_at).toLocaleDateString()}
              </p>
            </div>
            
            {/* AR Button */}
            <Link 
              to={`/cliente/proyecto/ar/${proyectoId}`} 
              className="ml-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg transform transition-transform hover:scale-105 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.59961 5.60001L18.3996 18.4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2V4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 12H22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Ver en AR
            </Link>
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

        {/* Current phase highlight box - only shown if we have a phase */}
        {hasFase ? (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 mb-4 md:mb-6">
            <div className="flex items-center">
              {currentPhase > 0 && (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-2 md:mr-3 text-sm md:text-base">
                  {currentPhase}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-semibold text-blue-800">Fase actual:</h3>
                <p className="text-sm md:text-base text-blue-700">
                  {currentPhaseName || 'No encontrada'}
                </p>
              </div>
              <button 
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="md:hidden text-blue-600 p-1"
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

        {/* Scrollable phase indicators - For desktop */}
        <div className="relative mt-6 mb-4 hidden md:block">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 -translate-y-1/2" />
          
          {/* Phase points and titles */}
          <div className="flex justify-between relative">
            {fases.map((fase, index) => (
              <div 
                key={fase.idFase} 
                className={`flex flex-col items-center ${hasFase && currentPhase > 0 && index + 1 <= currentPhase ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 ${
                    hasFase && currentPhase > 0 && index + 1 < currentPhase 
                      ? 'bg-blue-600 text-white' 
                      : hasFase && currentPhase > 0 && index + 1 === currentPhase 
                        ? 'bg-white border-4 border-blue-600 text-blue-600' 
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
        
        {/* Mobile view - Horizontal scrollable timeline */}
        <div className={`md:hidden ${isDetailsOpen ? 'block' : 'hidden'}`}>
          <div className="overflow-x-auto pb-4">
            <div className="relative min-w-max">
              {/* Connecting line */}
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300" />
              
              {/* Phase points and titles */}
              <div className="flex space-x-12 relative">
                {fases.map((fase, index) => (
                  <div 
                    key={fase.idFase} 
                    className={`flex flex-col items-center ${hasFase && currentPhase > 0 && index + 1 <= currentPhase ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 ${
                        hasFase && currentPhase > 0 && index + 1 < currentPhase 
                          ? 'bg-blue-600 text-white' 
                          : hasFase && currentPhase > 0 && index + 1 === currentPhase 
                            ? 'bg-white border-4 border-blue-600 text-blue-600' 
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