import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import { fetchWithAuth } from '../../../../js/authToken'; 
import API_BASE_URL from '../../../../js/urlHelper';       
import LoadingSkeleton from './LoadingSkeleton';           

const Charts = () => {
  const [stats, setStats] = useState({
    usuarios: { clientes: 0, managers: 0, total: 0 },
    proyectos: { total: 0, por_fase: [] }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colores para el Pie Chart (Usuarios)
  const USER_COLORS = ['#0088FE', '#00C49F']; // Azul (Cliente), Verde (Manager)

  // Colores para el Bar Chart (Fases) - Un solo color o varios
  const BAR_COLOR = '#8884d8';

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);

        const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/dashboard/stats`);
        const jsonData = await response.json();

        if (jsonData.success) {
          setStats(jsonData.data);
        } else {
          throw new Error(jsonData.message || 'Error al cargar datos');
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  const userDataChart = [
    { name: 'Clientes', value: stats.usuarios.clientes },
    { name: 'Encargados', value: stats.usuarios.managers },
  ];

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Administrativo</h2>

      {/* 1. Tarjetas de KPIs (Resumen Numérico) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-gray-500 text-sm font-medium uppercase">Total Clientes</div>
          <div className="mt-2 text-3xl font-bold text-gray-800">{stats.usuarios.clientes}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-gray-500 text-sm font-medium uppercase">Total Encargados</div>
          <div className="mt-2 text-3xl font-bold text-gray-800">{stats.usuarios.managers}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="text-gray-500 text-sm font-medium uppercase">Total Proyectos</div>
          <div className="mt-2 text-3xl font-bold text-gray-800">{stats.proyectos.total}</div>
        </div>
      </div>

      {/* 2. Sección de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico de Usuarios (Pie Chart) */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Distribución de Usuarios</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDataChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDataChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={USER_COLORS[index % USER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Proyectos por Fase (Bar Chart) */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Proyectos por Fase</h3>
          {stats.proyectos.por_fase.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.proyectos.por_fase}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="fase" 
                    tick={{fontSize: 10}} 
                    interval={0} 
                    angle={-15} 
                    textAnchor="end" 
                    height={60}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" name="Cantidad de Proyectos" fill={BAR_COLOR} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No hay proyectos registrados aún.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Charts;