import React from 'react';
import { useParams } from 'react-router-dom';
import BarraProgresoProyecto from '../../components/ui/Cliente/Proyecto/BarraProgresoProyecto';
import Modulo from '../../components/ui/Cliente/Proyecto/Modulo';
import Sidebar from '../../components/ui/Cliente/Sidebar';

// Componente Proyecto principal
const Proyecto = () => {
  const { id } = useParams(); // Extrae el ID del proyecto de la URL

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <Sidebar username="Cliente" />
      {/* Contenido principal con margen izquierdo para compensar la sidebar fija */}
      <div className="flex-1 p-4 md:ml-64">
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