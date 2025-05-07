import React from 'react';
import Sidebar from '../../../components/ui/Sidebar';
import Header from '../../../components/Header';

const Cliente = () => {
    
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar username="Admin" />
      
      {/* Contenido principal con margen izquierdo para compensar la sidebar fija */}
      <div className="flex-1 p-9 md:ml-84">

        <Header 
          title="Dashboard" 
          description="Bienvenido a tu panel de control." 
        />

      </div>
    </div>
  );
};

export default Cliente;