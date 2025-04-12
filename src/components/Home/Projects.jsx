import React from 'react';

const Projects = ({ isVisible, fadeInUp }) => {
  // Sample projects
  const projects = [
    {
      id: 1,
      name: "Edificio Moderno",
      phase: "Preparación del Terreno",
      description: "Edificio residencial con diseño contemporáneo y amplios espacios.",
      progress: 25
    },
    {
      id: 2,
      name: "Complejo Comercial Vertex",
      phase: "Estructura y Superestructura",
      description: "Centro comercial con tecnología inteligente y diseño sustentable.",
      progress: 65
    },
    {
      id: 3,
      name: "Residencial Los Pinos",
      phase: "Acabados",
      description: "Conjunto residencial con áreas verdes y amenidades de lujo.",
      progress: 85
    }
  ];

  return (
    <section id="projects" className="py-16 md:py-20 px-4 md:px-12 bg-gray-50">
      <div className={`max-w-6xl mx-auto transition-all duration-1000 ease-out ${fadeInUp(isVisible)}`}>
        <h2 className="text-2xl md:text-4xl font-bold mb-3 text-center text-green-800">Nuestros Proyectos</h2>
        <p className="text-base md:text-lg text-gray-600 text-center mb-8 md:mb-12">Descubre algunos de nuestros proyectos destacados</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
      <img 
        src={`/api/placeholder/400/250`} 
        alt={project.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold mb-2 text-green-800">{project.name}</h3>
        <p className="text-sm md:text-base text-gray-600 mb-4">{project.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs md:text-sm font-semibold">Fase: {project.phase}</span>
            <span className="text-xs md:text-sm font-semibold">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;