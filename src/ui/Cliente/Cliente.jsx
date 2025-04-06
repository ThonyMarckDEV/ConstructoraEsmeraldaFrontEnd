import React, { useState } from 'react';
import Sidebar from '../../components/ui/Sidebar';

const Cliente = () => {
    
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar username="Cliente" />
      
      {/* Contenido principal con margen izquierdo para compensar la sidebar fija */}
      <div className="flex-1 p-9 md:ml-84">
        <div className="p-4 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p>Bienvenido a tu panel de control</p>
          
          {/* Aquí puedes añadir el resto del contenido */}
        </div>
      </div>
    </div>
  );
};

export default Cliente;