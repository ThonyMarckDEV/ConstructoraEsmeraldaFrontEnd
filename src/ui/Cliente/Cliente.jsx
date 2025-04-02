import React, { useState } from 'react';
import Sidebar from '../../components/ui/Cliente/Sidebar';
import { fetchWithAuth } from '../../js/authToken';
import API_BASE_URL from '../../js/urlHelper';

const Cliente = () => {
  const fetchUserProjects = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/clients/projects`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener los datos');
      }
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar username="Cliente" />
      
      {/* Contenido principal con margen izquierdo para compensar la sidebar fija */}
      <div className="flex-1 p-4 md:ml-64">
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