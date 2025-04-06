import React, { useState, useEffect } from "react";
import { FilesSection } from "./FileCard";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import FileModal from "./FileModal";
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from "../../../../js/urlHelper";

//Para fases
import defaultImage from '../../../../img/default.jpg';
import planningImg from '../../../../img/planning.jpg';
import terrainPrepImg from '../../../../img/terrainPrep.jpg';
import foundationImg from '../../../../img/foundation.jpg';
import structureImg from '../../../../img/structure.jpg';
import installationsImg from '../../../../img/installations.jpg';
import finishesImg from '../../../../img/finishes.jpg';
import inspectionImg from '../../../../img/inspection.jpg';
import deliveryImg from '../../../../img/delivery.jpg';

const Modulo = ({ proyectoId }) => {
  const [projectData, setProjectData] = useState(null);
  const [expandedModuleId, setExpandedModuleId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Objeto que asocia el nombre de la fase con su imagen correspondiente
  const phaseImages = {
    'Planificación': planningImg,
    'Preparación del Terreno': terrainPrepImg,
    'Construcción de Cimientos': foundationImg,
    'Estructura y Superestructura': structureImg,
    'Instalaciones': installationsImg,
    'Acabados': finishesImg,
    'Inspección y Pruebas': inspectionImg,
    'Entrega': deliveryImg,
  };


  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetchWithAuth(`${API_BASE_URL}/api/client/project/${proyectoId}/details`);
        if (!response.ok) throw new Error('Error al cargar los detalles del proyecto');
        const data = await response.json();
        
        setProjectData(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [proyectoId]);

  // Encuentra el índice de la fase actual
  const currentPhaseIndex = projectData?.fases?.findIndex(fase => fase.es_actual) ?? -1;

  const toggleExpand = (moduleId) => {
    const moduleIndex = projectData.fases.findIndex(f => f.idFase === moduleId);
    if (moduleIndex <= currentPhaseIndex) {
      setExpandedModuleId(currentId => currentId === moduleId ? null : moduleId);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFile(null);
  };

  
  const handleViewFile = (file) => {
    // Verificar si es una imagen o un PDF para mostrar vista previa
    const isImage = ['jpg', 'jpeg', 'png', 'avif', 'webp'].includes(file.fileType.toLowerCase());
    const isPDF = file.fileType.toLowerCase() === 'pdf';

    if (isImage || isPDF) {
      setSelectedFile(file);
      setModalOpen(true); // Abrir el modal para vista previa
    } else {
      // Para otros tipos de archivo, directamente descargar
      handleDownloadFile(file);
    }
  };
  
  const handleDownloadFile = async (file) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/client/project/files/download/${file.path}`);
      if (!response.ok) {
        throw new Error("Error en la descarga");
      }
      // Convierte la respuesta a blob para generar un URL de descarga
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error descargando el archivo", err);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error || !projectData) return <ErrorState error={error} />;


  return (
    <div className="w-full flex flex-col lg:flex-row">
      {/* Sidebar de módulos */}
      <div className="w-full lg:w-1/4 pr-0 lg:pr-4 bg-white z-10">
        <div className="lg:sticky lg:top-4 space-y-4">
          <h2 className="text-xl font-bold mb-4">Fases del Proyecto</h2>
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:overflow-visible">
            {projectData.fases.map((fase, index) => {
              const isLocked = index > currentPhaseIndex;
              const isCurrent = fase.es_actual;
              
              return (
                <div 
                  key={`phase-${fase.idFase}`}
                  className={`border rounded p-3 transition-all flex-shrink-0 lg:flex-shrink w-auto lg:w-full ${
                    expandedModuleId === fase.idFase 
                      ? "bg-blue-50 border-blue-200" 
                      : isLocked 
                        ? "bg-gray-100 cursor-not-allowed" 
                        : "bg-white hover:bg-gray-50 cursor-pointer"
                  } ${
                    isCurrent ? "border-2 border-green-500" : ""
                  }`}
                  onClick={() => !isLocked && toggleExpand(fase.idFase)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm whitespace-nowrap mr-2">
                      {index + 1}. {fase.nombreFase}
                      {isCurrent && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Actual
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      {isLocked && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          className="text-gray-400 mr-2"
                        >
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      )}
                      {expandedModuleId === fase.idFase ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m18 15-6-6-6 6"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="w-full lg:w-3/4 mt-6 lg:mt-0">
        {projectData.fases.map((fase) => {
          // Combinar archivos y fotos con IDs únicos
          const allFiles = [
            ...(fase.archivos || []).map(archivo => ({
              id: `file-${archivo.idArchivo}`,
              fileName: archivo.ruta ? archivo.ruta.split('/').pop() : 'archivo.pdf',
              fileType: archivo.tipo || 'pdf',
              description: archivo.descripcion || 'Sin descripción',
              path: archivo.ruta || '#',
              isPhoto: false
            })),
            ...(fase.fotos || []).map(foto => ({
              id: `photo-${foto.idFoto}`,
              fileName: foto.ruta ? foto.ruta.split('/').pop() : 'foto.jpg',
              fileType: foto.tipo || 'jpg',
              description: foto.descripcion || 'Fotografía',
              path: foto.ruta || '/placeholder-image.jpg',
              isPhoto: true
            }))
          ];
          
          return (
            <div 
              key={`phase-content-${fase.idFase}`}
              className={`transition-all duration-300 pb-20 mb-8 ${
                expandedModuleId === fase.idFase 
                  ? "block" 
                  : "hidden"
              }`}
            >
              {/* Cabecera del módulo */}
              <div className="border rounded-md mb-4">
                <div className="flex flex-col sm:flex-row items-start p-4 gap-4">
                  <div className="bg-gray-100 p-2 rounded-md min-w-[120px] w-[120px] h-[120px] flex items-center justify-center mx-auto sm:mx-0 overflow-hidden">
                    <img
                      src={phaseImages[fase.nombreFase] || defaultImage}
                      alt={fase.nombreFase}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold uppercase">{fase.nombreFase}</h2>
                    <p className="text-sm mt-1">{fase.descripcion}</p>
                    {fase.es_actual && (
                      <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Fase actual del proyecto
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Lista de archivos - CORREGIDO: No mapear el componente FilesSection */}
              {allFiles.length > 0 ? (
                <FilesSection 
                  allFiles={allFiles}
                  handleViewFile={handleViewFile}
                  handleDownloadFile={handleDownloadFile}
                />
              ) : (
                <div className="text-center py-8 text-gray-500 border rounded-lg bg-white shadow">
                  No hay archivos disponibles para esta fase
                </div>
              )}
            </div>
          );
        })}
        
        {/* Mensaje sin selección */}
        {expandedModuleId === null && (
          <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-4">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <line x1="10" y1="9" x2="8" y2="9"/>
            </svg>
            <p className="text-gray-600 text-center max-w-md px-4">
              Selecciona una Fase de la lista para ver sus detalles y archivos.
            </p>
          </div>
        )}
      </div>

      {/* Modal de archivo */}
      {modalOpen && selectedFile && (
        <FileModal 
          file={selectedFile} 
          onClose={closeModal} 
          onDownload={handleDownloadFile} 
        />
      )}
    </div>
  );
}

export default Modulo;