import React from 'react';
import Sidebar from '../../../components/ui/Sidebar'; 
import Header from '../../../components/Header';      
import Charts from '../../../components/ui/Admin/Inicio/Charts';   

const AdminInicio = () => {
    
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar para Admin */}
      <Sidebar username="Admin" />
      
      {/* Contenido principal con margen para la sidebar */}
      <div className="flex-1 p-9 md:ml-84">

        <Header 
          title="Dashboard Administrativo" 
          description="Resumen global de usuarios y proyectos de la empresa." 
        />
        
        {/* Llamamos al componente AdminDashboard directamente.
            No necesita 'ResponsiveContainer' aquí porque el componente ya maneja 
            su propio layout (Grid, KPIs, etc.) internamente.
        */}
        <div className="mt-6 w-full">
            <Charts />
        </div>

      </div>
    </div>
  );
};

export default AdminInicio;