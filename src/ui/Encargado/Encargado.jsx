import React, { useState } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/Header';

const Encargado = () => {
    
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar username="Cliente" />
      
      {/* Contenido principal con margen izquierdo para compensar la sidebar fija */}
      <div className="flex-1 p-9 md:ml-84">

        <Header 
          title="Dashboard" 
          description="Bienvenido a tu panel de control." 
        />
        
          {/* Aquí puedes añadir el resto del contenido */}
      </div>
    </div>
  );
};

export default Encargado;