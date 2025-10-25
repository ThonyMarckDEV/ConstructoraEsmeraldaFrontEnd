import React from 'react';
import { Shield, Star, Users, Compass } from 'lucide-react';

const About = ({ isVisible, fadeInUp }) => {
  return (
    <section id="about" className="py-16 md:py-20 px-4 md:px-12 bg-white">
      <div className={`max-w-6xl mx-auto transition-all duration-1000 ease-out ${fadeInUp(isVisible)}`}>
        
        <div className="w-full max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-green-800 text-center">Sobre Constructora Esmeralda</h2>
          <p className="text-base md:text-lg text-gray-700 mb-6 text-center">
            Somos una empresa líder en el sector de la construcción con más de 20 años de experiencia. Nos especializamos en proyectos residenciales, comerciales e industriales, siempre con el compromiso de entregar la más alta calidad y excelencia en cada detalle.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <FeatureItem 
              icon={<Shield size={18} />} 
              title="Calidad Garantizada" 
              description="Los más altos estándares en cada proyecto" 
            />
            
            <FeatureItem 
              icon={<Star size={18} />} 
              title="Innovación" 
              description="Técnicas y materiales de vanguardia" 
            />
            
            <FeatureItem 
              icon={<Users size={18} />} 
              title="Equipo Profesional" 
              description="Expertos comprometidos con la excelencia" 
            />
            
            <FeatureItem 
              icon={<Compass size={18} />} 
              title="Sustentabilidad" 
              description="Comprometidos con el medio ambiente" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({ icon, title, description }) => {
  return (
    <div className="flex items-start">
      <div className="bg-green-100 p-2 rounded-md mr-3 flex-shrink-0">
        <div className="text-green-700">{icon}</div>
      </div>
      <div>
        <h3 className="font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default About;