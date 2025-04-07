import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../../js/authToken';
import API_BASE_URL from '../../../js/urlHelper';
import { useNavigate } from 'react-router-dom';
import LoadingProyectosClientes from './Proyectos/LoadingProyectosManager';

import default1 from '../../../img/default.jpg';
import default2 from '../../../img/default2.jpg';
import default3 from '../../../img/default3.jpg';
import default4 from '../../../img/default4.jpg';
import default5 from '../../../img/default5.jpg';
import default6 from '../../../img/default6.jpg';

const ProyectoEncargado = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const defaultImages = [default1, default2, default3, default4, default5, default6];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects with phases in a single request
        const response = await fetchWithAuth(`${API_BASE_URL}/api/manager/projects-with-phases`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Error al obtener los proyectos');
        }
        
        setProyectos(data);
        
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProyectoClick = (idProyecto) => {
    navigate(`/encargado/proyecto/${idProyecto}`);
  };

  // Función para calcular el progreso basado en la fase actual
  const calcularProgreso = (proyecto) => {
    // Si no hay fase definida, retornar 0%
    if (!proyecto.fase || proyecto.fase.trim() === "") return 0;
    
    const fases = proyecto.fases || [];
    if (fases.length === 0) return 0;
    
    // Encontrar el índice de la fase actual (1-based)
    const faseActualIndex = fases.findIndex(
      fase => fase.nombreFase.toLowerCase() === proyecto.fase.toLowerCase()
    ) + 1;
    
    // Si no se encuentra la fase, retornar 0%
    if (faseActualIndex === 0) return 0;
    
    // Calcular porcentaje (faseActualIndex / totalFases)
    return Math.round((faseActualIndex / fases.length) * 100);
  };

  // Función para formatear fechas
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return <LoadingProyectosClientes />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-gray-800">Proyectos Encargados</h2>
        <div className="text-sm text-gray-500">{proyectos.length} proyectos en total</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectos.map((proyecto) => {
          const progreso = calcularProgreso(proyecto);
          const totalFases = proyecto.fases?.length || 0;
          
          return (
            <div
              key={proyecto.idProyecto}
              onClick={() => handleProyectoClick(proyecto.idProyecto)}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
            >
              {/* Imagen del proyecto */}
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img 
                  src={defaultImages[Math.floor(Math.random() * defaultImages.length)]} 
                  alt={proyecto.nombre} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                {proyecto.fase && (
                  <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs uppercase tracking-wider py-1 px-2 rounded">
                    {proyecto.fase}
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 font-serif mb-2 group-hover:text-blue-600 transition-colors">
                  {proyecto.nombre}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span>
                    Cliente: {proyecto.cliente ? `${proyecto.cliente.nombre} ${proyecto.cliente.apellido}` : 'No asignado'}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>
                    {formatearFecha(proyecto.fecha_inicio)} - {formatearFecha(proyecto.fecha_fin_estimada)}
                  </span>
                </div>
                
                {/* Barra de progreso */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${progreso}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progreso</span>
                  <span className="font-medium">
                    {progreso}% ({totalFases > 0 ? 
                      `Fase ${Math.round((progreso/100) * totalFases)} de ${totalFases}` : 
                      'Sin fases definidas'})
                  </span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Ver detalles</span>
                  <svg className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {proyectos.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No hay proyectos disponibles</h3>
          <p className="text-gray-500">Actualmente no tienes proyectos asignados.</p>
        </div>
      )}
    </div>
  );
};

export default ProyectoEncargado;