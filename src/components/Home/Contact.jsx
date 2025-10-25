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
                <span className="text-sm md:text-base">CAL. LIBERTAD NRO. 323 PIURa - SULLANA - BELLAVISTA</span>
              </div>
              {/* <div className="flex items-center">
                <div className="bg-green-700 p-2 rounded-full mr-3 flex-shrink-0">
                  <Phone className="text-white" size={18} />
                </div>
                <span className="text-sm md:text-base">+51 123 456 789</span>
              </div> */}
              <div className="flex items-center">
                <div className="bg-green-700 p-2 rounded-full mr-3 flex-shrink-0">
                  <Mail className="text-white" size={18} />
                </div>
                <span className="text-sm md:text-base">constructuraesmeralda@gmail.com</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="bg-white text-green-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </a>
              <a href="#" className="bg-white text-green-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2c-2.714 0-3.055.013-4.121.06-1.066.05-1.79.217-2.428.465a4.89 4.89 0 0 0-1.771 1.151A4.9 4.9 0 0 0 2.525 5.45c-.248.637-.416 1.363-.465 2.428C2.013 8.945 2 9.286 2 12c0 2.714.013 3.055.06 4.121.05 1.066.217 1.79.465 2.428a4.89 4.89 0 0 0 1.151 1.771 4.9 4.9 0 0 0 1.774 1.154c.637.248 1.363.416 2.428.465 1.066.047 1.407.06 4.121.06 2.714 0 3.055-.013 4.121-.06 1.066-.05 1.79-.217 2.428-.465a4.89 4.89 0 0 0 1.771-1.151 4.9 4.9 0 0 0 1.154-1.774c.248-.637.416-1.363.465-2.428.047-1.066.06-1.407.06-4.121 0-2.714-.013-3.055-.06-4.121-.05-1.066-.217-1.79-.465-2.428a4.89 4.89 0 0 0-1.151-1.771A4.9 4.9 0 0 0 18.55 2.525c-.637-.248-1.363-.416-2.428-.465C15.055 2.013 14.714 2 12 2Zm0 1.8c2.67 0 2.985.01 4.04.058.974.045 1.503.208 1.856.344.466.182.8.399 1.15.748.349.35.566.684.748 1.15.136.353.3.882.344 1.856.048 1.055.058 1.37.058 4.041 0 2.67-.01 2.985-.058 4.04-.045.974-.208 1.503-.344 1.856-.182.466-.399.8-.748 1.15-.35.349-.684.566-1.15.748-.353.136-.882.3-1.856.344-1.055.048-1.37.058-4.041.058-2.67 0-2.985-.01-4.04-.058-.974-.045-1.503-.208-1.856-.344-.466-.182-.8-.399-1.15-.748a3.09 3.09 0 0 1-.748-1.15c-.136-.353-.3-.882-.344-1.856-.048-1.055-.058-1.37-.058-4.041 0-2.67.01-2.985.058-4.04.045-.974.208-1.503.344-1.856.182-.466.399-.8.748-1.15.35-.349.684-.566 1.15-.748.353-.136.882-.3 1.856-.344 1.055-.048 1.37-.058 4.041-.058Zm0 12.073a3.89 3.89 0 0 1-3.873-3.874A3.89 3.89 0 0 1 12 7.127a3.89 3.89 0 0 1 3.873 3.873A3.89 3.89 0 0 1 12 14.873Zm0-9.747a5.88 5.88 0 0 0-5.873 5.873A5.88 5.88 0 0 0 12 16.873a5.88 5.88 0 0 0 5.873-5.874A5.88 5.88 0 0 0 12 5.127Zm7.5-.625a1.38 1.38 0 1 1-2.76 0 1.38 1.38 0 0 1 2.76 0Z"></path>
                </svg>
              </a>
              <a href="#" className="bg-white text-green-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                  <path d="M2 0a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm3.447 4.422a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM6.66 12h3.34v10H6.66V12Zm5.34 0h3.5v1.5c.43-1.13 1.87-1.8 3.5-1.5 2.5 0 3.5 1.5 3.5 3.5V22h-3.5v-6c0-.6-.06-1.5-1.5-1.5-1.5 0-1.5 1.5-1.5 1.5v6h-4V12Z"></path>
                </svg>
              </a>
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