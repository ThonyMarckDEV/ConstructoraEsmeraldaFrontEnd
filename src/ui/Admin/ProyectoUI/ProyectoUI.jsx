import React from 'react';
import Sidebar from '../../../components/ui/Sidebar';
import Proyecto from '../../../components/ui/Admin/ProyectoComponents/Proyecto';

// Componente Proyecto principal
const ProyectoUI = () => {
  
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      {/* Contenido principal sin margen izquierdo ya que el sidebar está oculto por defecto */}
      <div className="flex-1  md:ml-84">
        
       <Proyecto/>
      </div>
    </div>
  );
};

export default ProyectoUI;