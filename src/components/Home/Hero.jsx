import React from 'react';
import { Building } from 'lucide-react';

const Hero = ({ isVisible, fadeInUp }) => {
  return (
    <section className="px-4 md:px-12 py-16 md:py-32 bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
      <div className={`max-w-6xl mx-auto transition-all duration-1000 ease-out ${fadeInUp(isVisible)}`}>
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Construimos tu futuro con excelencia
            </h1>
            <p className="text-base md:text-xl mb-6 text-gray-100">
              En Constructora Esmeralda combinamos innovación, calidad y tecnología para brindar proyectos excepcionales con seguimiento en tiempo real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="border-2 border-white px-6 py-3 rounded-md font-bold hover:bg-white hover:text-green-800 transition-all w-full sm:w-auto">
                Contactar
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative mt-4 md:mt-0">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 shadow-xl">
              <img 
                src="/api/placeholder/600/400" 
                alt="Edificio moderno Constructora Esmeralda" 
                className="rounded-md w-full"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-green-600 p-3 rounded-full shadow-lg">
              <Building size={24} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;