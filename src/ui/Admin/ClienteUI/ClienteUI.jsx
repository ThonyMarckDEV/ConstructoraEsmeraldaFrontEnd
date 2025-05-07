import React from 'react';
import Sidebar from '../../../components/ui/Sidebar';
import Cliente from '../../../components/ui/Admin/ClienteComponents/Cliente';

// Componente Proyecto principal
const ClienteUI = () => {
  
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      {/* Contenido principal sin margen izquierdo ya que el sidebar está oculto por defecto */}
      <div className="flex-1  md:ml-84">
        
       <Cliente/>
      </div>
    </div>
  );
};

export default ClienteUI;