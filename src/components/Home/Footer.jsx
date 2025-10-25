import React from 'react';
import { Building } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="mr-2 bg-white rounded-full p-1">
                <Building className="text-green-800" size={24} />
              </div>
              <span className="font-bold text-xl">Constructora Esmeralda</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Soluciones de construcción integrales con tecnología de punta y atención personalizada.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8"> 
                
            <div>
              <h3 className="font-bold mb-4 text-lg">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Clientes</a></li>
              </ul>
            </div>
          </div>
          
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 mb-4 md:mb-0">© 2025 Constructora Esmeralda. Todos los derechos reservados.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;