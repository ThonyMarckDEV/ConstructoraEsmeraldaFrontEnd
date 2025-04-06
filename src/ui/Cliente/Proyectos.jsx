import React from 'react';
import Sidebar from '../../components/ui/Sidebar';
import ProyectoClientes from '../../components/ui/Cliente/ProyectosCliente';

const Proyectos = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar username="Cliente" />
      
      {/* Contenido principal con margen izquierdo para compensar la sidebar fija */}
      <div className="flex-1 p-9 md:ml-84">
        <div className="p-4 bg-white rounded-lg shadow mb-6">
          <h1 className="text-2xl font-bold mb-4 font-serif text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Bienvenido a tu panel de control de proyectos.</p>
        </div>
        
        {/* Componente de proyectos */}
        <div className="p-4 bg-white rounded-lg shadow">
          <ProyectoClientes />
        </div>
      </div>
    </div>
  );
};

export default Proyectos;