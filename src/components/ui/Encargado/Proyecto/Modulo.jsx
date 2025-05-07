import React, { useState, useEffect } from "react";
import { FileCard, FileGrid } from "./FileCard";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import FileModal from "./FileModal";
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from "../../../../js/urlHelper";
import { FileText, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

// Para fases
import defaultImage from '../../../../img/default.jpg';
import planningImg from '../../../../img/Fases/planning.jpg';
import terrainPrepImg from '../../../../img/Fases/terrainPrep.jpg';
import foundationImg from '../../../../img/Fases/foundation.jpg';
import structureImg from '../../../../img/Fases/structure.jpg';
import installationsImg from '../../../../img/Fases/installations.jpg';
import finishesImg from '../../../../img/Fases/finishes.jpg';
import inspectionImg from '../../../../img/Fases/inspection.jpg';
import deliveryImg from '../../../../img/Fases/delivery.jpg';

const Modulo = ({ proyectoId }) => {
  const [projectData, setProjectData] = useState(null);
  const [expandedModuleId, setExpandedModuleId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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
        const response = await fetchWithAuth(`${API_BASE_URL}/api/manager/project/${proyectoId}/details`);
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

  const handleFileUpload = async (faseId, event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Verificar el tipo de archivo
    const allowedTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/acad'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['pdf', 'xls', 'xlsx', 'doc', 'docx', 'dwg'];
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      toast.error('Tipo de archivo no permitido. Se permiten: PDF, XLS, DOCX, DWG');
      return;
    }
    
    // Verificar tamaño (20MB máximo)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('El archivo es demasiado grande. El tamaño máximo es 20MB');
      return;
    }
    
    try {
      setUploadingFile(true);
      
      const formData = new FormData();
      formData.append('archivo<Void>archivo', file);
      formData.append('descripcion', 'Archivo subido: ' + file.name);
      formData.append('idFase', faseId);
      formData.append('idProyecto', proyectoId);
      
      const response = await fetchWithAuth(`${API_BASE_URL}/api/manager/project/fase/upload-file`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }
      
      // Recargar los datos del proyecto para mostrar el nuevo archivo
      const projectResponse = await fetchWithAuth(`${API_BASE_URL}/api/manager/project/${proyectoId}/details`);
      if (!projectResponse.ok) throw new Error('Error al recargar los detalles del proyecto');
      const data = await projectResponse.json();
      setProjectData(data);
      
      toast.success('Archivo subido correctamente');
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error('Error al subir el archivo: ' + err.message);
    } finally {
      setUploadingFile(false);
      event.target.value = '';
    }
  };
  
  const handlePhotoUpload = async (faseId, event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Verificar el tipo de imagen
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/avif', 'image/webp'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'avif', 'webp'];
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      toast.error('Tipo de imagen no permitido. Se permiten: JPG, JPEG, PNG, AVIF, WEBP');
      return;
    }
    
    // Verificar tamaño (5MB máximo para imágenes)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande. El tamaño máximo es 5MB');
      return;
    }
    
    try {
      setUploadingPhoto(true);
      
      const formData = new FormData();
      formData.append('foto', file);
      formData.append('descripcion', 'Foto subida: ' + file.name);
      formData.append('idFase', faseId);
      formData.append('idProyecto', proyectoId);
      
      const response = await fetchWithAuth(`${API_BASE_URL}/api/manager/project/fase/upload-photo`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }
      
      // Recargar los datos del proyecto para mostrar la nueva foto
      const projectResponse = await fetchWithAuth(`${API_BASE_URL}/api/manager/project/${proyectoId}/details`);
      if (!projectResponse.ok) throw new Error('Error al recargar los detalles del proyecto');
      const data = await projectResponse.json();
      setProjectData(data);
      
      toast.success('Imagen subida correctamente');
    } catch (err) {
      console.error("Error uploading photo:", err);
      toast.error('Error al subir la imagen: ' + err.message);
    } finally {
      setUploadingPhoto(false);
      event.target.value = '';
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const isPhoto = fileId.startsWith('photo-');
      const realId = fileId.replace(isPhoto ? 'photo-' : 'file-', '');
  
      const response = await fetchWithAuth(`${API_BASE_URL}/api/manager/project/files/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: realId,
          type: isPhoto ? 'foto' : 'archivo'
        })
      });
  
      if (!response.ok) throw new Error('Error al eliminar el archivo');
  
      setProjectData(prevData => {
        const updatedFases = prevData.fases.map(fase => {
          if (isPhoto) {
            const updatedFotos = fase.fotos?.filter(foto => `photo-${foto.idFoto}` !== fileId) || [];
            return { ...fase, fotos: updatedFotos };
          } else {
            const updatedArchivos = fase.archivos?.filter(archivo => `file-${archivo.idArchivo}` !== fileId) || [];
            return { ...fase, archivos: updatedArchivos };
          }
        });
        
        return { ...prevData, fases: updatedFases };
      });
  
    } catch (err) {
      console.error("Error deleting file:", err);
      alert('Error al eliminar el archivo: ' + err.message);
    }
  };

  const handleViewFile = (file) => {
    const isImage = ['jpg', 'jpeg', 'png', 'avif', 'webp'].includes(file.fileType.toLowerCase());
    const isPDF = file.fileType.toLowerCase() === 'pdf';
  
    if (isImage || isPDF) {
      setSelectedFile(file);
      setModalOpen(true);
    } else {
      handleDownloadFile(file);
    }
  };
  
  const handleDownloadFile = async (file) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/project/files/download/${file.path}`);
      if (!response.ok) {
        throw new Error("Error en la descarga");
      }
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

      <div className="w-full lg:w-3/4 mt-6 lg:mt-0">
        {projectData.fases.map((fase) => {
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold uppercase">{fase.nombreFase}</h2>
                        <p className="text-sm mt-1">{fase.descripcion}</p>
                        {fase.es_actual && (
                          <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Fase actual del proyecto
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4 mt-4 sm:mt-0">
                        <div className="relative">
                          <label htmlFor={`upload-file-${fase.idFase}`} className="cursor-pointer">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:bg-gray-400 transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:rotate-6 active:scale-95 active:rotate-0">
                              {uploadingFile ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <FileText size={20} className="transition-transform duration-300 hover:scale-110" />
                              )}
                            </div>
                          </label>
                          <input
                            type="file"
                            id={`upload-file-${fase.idFase}`}
                            className="hidden"
                            onChange={(e) => handleFileUpload(fase.idFase, e)}
                            accept=".pdf,.xls,.xlsx,.doc,.docx,.dwg"
                            disabled={uploadingFile}
                          />
                        </div>
                        <div className="relative">
                          <label htmlFor={`upload-photo-${fase.idFase}`} className="cursor-pointer">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:bg-gray-400 transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:-rotate-6 active:scale-95 active:rotate-0">
                              {uploadingPhoto ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Image size={20} className="transition-transform duration-300 hover:scale-110" />
                              )}
                            </div>
                          </label>
                          <input
                            type="file"
                            id={`upload-photo-${fase.idFase}`}
                            className="hidden"
                            onChange={(e) => handlePhotoUpload(fase.idFase, e)}
                            accept=".jpg,.jpeg,.png,.avif,.webp"
                            disabled={uploadingPhoto}
                          />
                        </div>
                        <Link 
                          to={`/encargado/proyecto/ar/${proyectoId}/${fase.idFase}`} 
                          className="flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full hover:bg-green-700 transform transition-all duration-300 hover:scale-110 hover:shadow-lg"
                        >
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.59961 5.60001L18.3996 18.4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 2V4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 20V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20 12H22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12H4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container mx-auto">
                {allFiles.length > 0 ? (
                  <FileGrid 
                    files={allFiles}
                    onView={handleViewFile}
                    onDownload={handleDownloadFile}
                    onDelete={handleDeleteFile}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay archivos disponibles para esta fase
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
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