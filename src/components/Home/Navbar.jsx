import React, { useState } from 'react';
import { Building, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className="bg-green-800 text-white py-4 px-4 md:px-12 flex justify-between items-center relative z-20">
        <div className="flex items-center">
          <div className="mr-3 bg-white rounded-full p-1">
            <Building className="text-green-800" size={24} />
          </div>
          <span className="font-bold text-lg md:text-xl">Constructora Esmeralda</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <a href="#about" className="hover:text-green-300 transition-colors">Nosotros</a>
          <a href="#projects" className="hover:text-green-300 transition-colors">Proyectos</a>
          <a href="#platform" className="hover:text-green-300 transition-colors">Plataforma</a>
          <a href="#contact" className="hover:text-green-300 transition-colors">Contacto</a>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <a 
            href="/login"
            className="bg-black hover:bg-gray-900 px-3 py-1 rounded-md transition-colors mr-2"
            aria-label="Área de Clientes"
          >
            Intranet
          </a>
          <button 
            onClick={toggleMobileMenu} 
            className="text-white p-2" 
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Desktop Client Area Button */}
        <a
          href="/login"
          className="hidden md:block bg-black hover:bg-gray-900 px-4 py-2 rounded-md transition-colors text-white text-center"
        >
          Intranet
        </a>
      </nav>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-green-800 z-10 pt-20 px-6 md:hidden">
          <div className="flex flex-col space-y-6 text-white text-xl">
            <a href="#about" className="border-b border-green-700 pb-2" onClick={toggleMobileMenu}>Nosotros</a>
            <a href="#projects" className="border-b border-green-700 pb-2" onClick={toggleMobileMenu}>Proyectos</a>
            <a href="#platform" className="border-b border-green-700 pb-2" onClick={toggleMobileMenu}>Plataforma</a>
            <a href="#contact" className="border-b border-green-700 pb-2" onClick={toggleMobileMenu}>Contacto</a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;