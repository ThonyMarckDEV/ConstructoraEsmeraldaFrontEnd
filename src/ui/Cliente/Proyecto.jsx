import React from 'react';
import { useParams } from 'react-router-dom';
import BarraProgresoProyecto from '../../components/ui/Cliente/Proyecto/BarraProgresoProyecto';
import Modulo from '../../components/ui/Cliente/Proyecto/Modulo';
import Sidebar from '../../components/ui/Sidebar';

// Componente Proyecto principal
const Proyecto = () => {
  const { id } = useParams(); // Extrae el ID del proyecto de la URL
  
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      {/* Contenido principal sin margen izquierdo ya que el sidebar está oculto por defecto */}
      <div className="flex-1 p-9 md:ml-84">
        <div className="mb-4">
          <BarraProgresoProyecto proyectoId={id} />
        </div>
        <div className="mt-4">
          <Modulo proyectoId={id} />
        </div>
      </div>
    </div>
  );
};

export default Proyecto;