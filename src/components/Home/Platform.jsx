import React from 'react';
import { CheckCircle, MessageCircle } from 'lucide-react';
import video3dhouse from '../../img/3dmodernhouse.mp4';

const Platform = ({ isVisible, fadeInUp }) => {
  // Project phases sample
  const projectPhases = [
    "Planificación", 
    "Preparación del Terreno", 
    "Construcción de Cimientos", 
    "Estructura y Superestructura",
    "Instalaciones", 
    "Acabados", 
    "Inspección y Pruebas", 
    "Entrega"
  ];

  return (
    <section id="platform" className="py-16 md:py-20 px-4 md:px-12 bg-white">
      <div className={`max-w-6xl mx-auto transition-all duration-1000 ease-out ${fadeInUp(isVisible)}`}>
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-green-800">Seguimiento de Proyectos en Tiempo Real</h2>
            <p className="text-base md:text-lg text-gray-700 mb-6">
              En Constructora Esmeralda utilizamos tecnología de punta para mantener a nuestros clientes informados durante todo el proceso de construcción:
            </p>
            
            <div className="space-y-3 mb-6">
              <PlatformFeature text="Visualización de avances con realidad aumentada" />
              <PlatformFeature text="Chat en tiempo real con el encargado del proyecto" />
              <PlatformFeature text="Documentación y planos accesibles digitalmente" />
              <PlatformFeature text="Seguimiento detallado de cada fase del proyecto" />
              <PlatformFeature text="Galería de imágenes actualizada semanalmente" />
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <ProjectDashboard projectPhases={projectPhases} />
          </div>
        </div>
      </div>
    </section>
  );
};

const PlatformFeature = ({ text }) => {
  return (
    <div className="flex items-center">
      <CheckCircle className="text-green-600 mr-3 flex-shrink-0" size={20} />
      <span className="text-sm md:text-base text-gray-800">{text}</span>
    </div>
  );
};

const ProjectDashboard = ({ projectPhases }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg md:text-xl">Edificio Moderno</h3>
        <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs md:text-sm font-medium">En Progreso</span>
      </div>
      
      <div className="mb-4">
        <div className="relative w-full rounded-lg overflow-hidden mb-2">
          <video 
            autoPlay 
            loop 
            muted 
            className="w-full rounded-lg object-cover"
            style={{ height: '250px' }}
          >
            <source src={video3dhouse} type="video/mp4" />
            Su navegador no soporta videos HTML5.
          </video>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-bold text-sm md:text-base mb-2">Fase Actual: Preparación del Terreno</h4>
        <div className="flex mb-4 overflow-x-auto pb-2 space-x-2">
          {projectPhases.map((phase, index) => (
            <div
              key={index}
              className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                index <= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {phase}
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4 mb-4">
        <h4 className="font-bold text-sm md:text-base mb-3">Chat con Encargado del Proyecto</h4>
        <div className="bg-gray-50 p-2 md:p-3 rounded-lg mb-2">
          <p className="text-xs md:text-sm mb-1 font-semibold text-green-800">Juan Pérez - Encargado</p>
          <p className="text-xs md:text-sm">Buen día, esta semana completamos la nivelación del terreno y comenzaremos con las excavaciones.</p>
        </div>
        <div className="bg-green-50 p-2 md:p-3 rounded-lg mb-3 ml-4 md:ml-8">
          <p className="text-xs md:text-sm mb-1 font-semibold text-green-800">Cliente</p>
          <p className="text-xs md:text-sm">Excelente, ¿cuándo podremos ver los avances?</p>
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 border border-gray-300 rounded-l-lg px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
          />
          <button className="bg-green-600 text-white px-3 py-2 rounded-r-lg hover:bg-green-700">
            <MessageCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Platform;