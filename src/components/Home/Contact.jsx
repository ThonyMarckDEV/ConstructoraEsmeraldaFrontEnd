import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact = ({ isVisible, fadeInUp }) => {
  return (
    <section id="contact" className="py-16 md:py-20 px-4 md:px-12 bg-green-800 text-white">
      <div className={`max-w-6xl mx-auto transition-all duration-1000 ease-out ${fadeInUp(isVisible)}`}>
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Contáctanos</h2>
            <p className="text-base md:text-lg mb-6">
              Estamos aquí para ayudarte a hacer realidad tu próximo proyecto. No dudes en contactarnos para más información.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <div className="bg-green-700 p-2 rounded-full mr-3 flex-shrink-0">
                  <MapPin className="text-white" size={18} />
                </div>
                <span className="text-sm md:text-base">CAL. LIBERTAD NRO. 323 PIURA - SULLANA - BELLAVISTA</span>
              </div>
              <div className="flex items-center">
                <div className="bg-green-700 p-2 rounded-full mr-3 flex-shrink-0">
                  <Mail className="text-white" size={18} />
                </div>
                <span className="text-sm md:text-base">constructuraesmeralda@gmail.com</span>
              </div>
            </div>

          </div>
          
          <div className="w-full md:w-1/2 bg-white text-black p-4 md:p-6 rounded-lg shadow-lg">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-green-800">Envíanos un mensaje</h3>
            
            <form className="space-y-3 md:space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Nombre</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                  placeholder="Tu nombre"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                  placeholder="ejemplo@correo.com"
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-gray-700">Teléfono</label>
                <input 
                  type="tel" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-600"
                  placeholder="+51 123 456 789"
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium text-gray-700">Mensaje</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-28 focus:outline-none focus:ring-1 focus:ring-green-600"
                  placeholder="¿En qué podemos ayudarte?"
                ></textarea>
              </div>
              
              <button type="submit" className="w-full bg-green-800 hover:bg-green-700 text-white font-bold py-3 rounded-md transition-colors">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;