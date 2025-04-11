import React from 'react';
import Sidebar from '../../components/ui/Sidebar';
import ProyectoClientes from '../../components/ui/Cliente/ProyectosCliente';
import Header from '../../components/Header';

const Proyectos = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar username="Cliente" />
      
      {/* Contenido principal con margen izquierdo para compensar la sidebar fija */}
      <div className="flex-1 p-9 md:ml-84">

        <Header 
          title="Proyectos" 
          description="Bienvenido a tu panel de control de proyectos." 
        />
        
        {/* Componente de proyectos */}
        <div className="p-4 bg-white rounded-lg shadow">
          <ProyectoClientes />
        </div>
      </div>
    </div>
  );
};

export default Proyectos;