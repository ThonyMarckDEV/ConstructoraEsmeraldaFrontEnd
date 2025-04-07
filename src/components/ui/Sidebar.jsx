import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Home, FileText, ChartBarIcon, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import jwtUtils from '../../utilities/jwtUtils';
import { logout } from '../../js/logout';
import logo from '../../img/logo/logoconstructora.jpg';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const sidebarRef = useRef(null);
  const hoverAreaRef = useRef(null);
  const isMobile = useRef(window.innerWidth < 768);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const refresh_token = jwtUtils.getRefreshTokenFromCookie();
  const role = jwtUtils.getUserRole(refresh_token);

  // Definir los menús primero
  const menuItemsCliente = [
    { name: "Inicio", icon: <Home size={20} />, path: "/cliente" },
    { name: "Proyectos", icon: <FileText size={20} />, path: "/cliente/proyectos" },
    { name: "Configuración", icon: <Settings size={20} />, path: "/cliente/configuracion" }
  ];

  const menuItemsManager = [
    { name: "Inicio", icon: <Home size={20} />, path: "/encargado" },
    { name: "Proyectos", icon: <FileText size={20} />, path: "/encargado/proyectos" },
    { name: "Configuración", icon: <Settings size={20} />, path: "/encargado/configuracion" }
  ];

  const menuItemsAdmin = [
    { name: "Inicio", icon: <Home size={20} />, path: "/admin" },
    { name: "Usuarios", icon: <FileText size={20} />, path: "/admin/usuarios" },
    { name: "Configuración", icon: <Settings size={20} />, path: "/admin/configuracion" }
  ];

  const getMenuItems = () => {
    switch(role) { // Usar toLowerCase para hacer coincidir sin importar mayúsculas
      case 'cliente':
        return menuItemsCliente;
      case 'manager':
        return menuItemsManager;
      case 'admin':
        return menuItemsAdmin;
      default:
        return [];
    }
  };

  const getRoleText = () => {
    switch(role) {
      case 'cliente':
        return "Cliente";
      case 'manager':
        return "Encargado";
      case 'admin':
        return "Administrador";
      default:
        return "";
    }
  };

    const username = jwtUtils.getUsername(refresh_token);
    const menuItems = getMenuItems(); // Definir menuItems aquí, después de todas las dependencias

  // Detectar si es dispositivo móvil o PC
  useEffect(() => {
    const handleResize = () => {
      isMobile.current = window.innerWidth < 768;
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Manejar hover en el borde izquierdo (solo para PC)
  useEffect(() => {
    if (!isMobile.current && isHovering) {
      setIsOpen(true);
    }
  }, [isHovering]);

  // Cerrar el sidebar al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && 
          !sidebarRef.current.contains(event.target) && 
          !hoverAreaRef.current?.contains(event.target) && 
          isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Área de hover en toda la parte izquierda (solo visible en PC) */}
      <div 
        ref={hoverAreaRef}
        className="hidden md:block fixed top-0 left-0 w-3 h-full z-20"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      />

      {/* Botón de hamburguesa para móviles y PC */}
      <button 
        onClick={toggleSidebar} 
        className="fixed z-20 top-4 left-4 p-2 rounded-md bg-black text-white md:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      {/* Overlay cuando el sidebar está abierto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed h-full w-64 bg-white border-r border-gray-200 shadow-lg z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "left-0" : "-left-64"
        }`}
        onMouseLeave={() => {
          if (!isMobile.current && isHovering) {
            setIsOpen(false);
            setIsHovering(false);
          }
        }}
      >
        {/* Header del sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <img 
              src={logo}
              alt="Logo de la empresa" 
              className="h-12" // Cambiado de h-8 a h-12 para un logo más grande
            />
          </div>
          <button 
            onClick={toggleSidebar} 
            className="text-black"
            aria-label="Cerrar menú"
          >
            <X size={24} />
          </button>
        </div>

        {/* Información del usuario */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
              {username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-black">{username}</p>
              <p className="text-sm text-gray-500">{getRoleText()}</p>
            </div>
          </div>
        </div>

        {/* Menú */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="flex items-center space-x-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-gray-500">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-500"><LogOut size={20} /></span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;