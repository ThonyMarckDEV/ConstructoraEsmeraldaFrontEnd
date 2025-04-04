import React, { useEffect } from 'react';
import { FaRegAngry } from 'react-icons/fa';

const ErrorPage = () => {
  // Efecto de animación al cargar la página
  useEffect(() => {
    const elementsToAnimate = document.querySelectorAll('.animate-in');
    
    elementsToAnimate.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-show');
      }, 200 * index);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 to-black text-white">
      {/* Partículas de fondo (puramente CSS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              animation: `float ${Math.random() * 10 + 10}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="flex-grow flex justify-center items-center relative z-10">
        <div className="text-center p-6 md:p-12">
          {/* Ícono con animación */}
          <div className="animate-in opacity-0 transform translate-y-8 transition-all duration-700 ease-out">
            <FaRegAngry className="text-8xl text-white mb-8 mx-auto animate-bounce-slow" />
          </div>
          
          {/* Título "404" con efecto de glow */}
          <h1 className="animate-in opacity-0 transform translate-y-8 transition-all duration-700 ease-out text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4 glow-text">
            401
          </h1>
          
          {/* Texto con animación */}
          <p className="animate-in opacity-0 transform translate-y-8 transition-all duration-700 ease-out text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Que haces aca????
          </p>
          
          {/* Botón con animación */}
          <div className="animate-in opacity-0 transform translate-y-8 transition-all duration-700 ease-out">
            <a
              href="/"
              className="inline-block px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-lg shadow-glow hover:shadow-glow-intense transition-all duration-300 transform hover:scale-105 hover:bg-gray-100"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </div>

      {/* Estilos CSS para las animaciones */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
        
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        
        .glow-text {
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
        }
        
        .shadow-glow {
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
        }
        
        .shadow-glow-intense {
          box-shadow: 0 0 25px rgba(255, 255, 255, 0.5);
        }
        
        .animate-in {
          transition-property: opacity, transform;
        }
        
        .animate-show {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;