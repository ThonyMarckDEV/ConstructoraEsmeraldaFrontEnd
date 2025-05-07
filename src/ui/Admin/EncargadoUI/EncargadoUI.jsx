import React from 'react';
import Sidebar from '../../../components/ui/Sidebar';
import Encargado from '../../../components/ui/Admin/EncargadoComponents/Encargado';

// Componente Proyecto principal
const EncargadoUI = () => {
  
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      {/* Contenido principal sin margen izquierdo ya que el sidebar está oculto por defecto */}
      <div className="flex-1  md:ml-84">
        
       <Encargado />
      </div>
    </div>
  );
};

export default EncargadoUI;