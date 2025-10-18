import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import LoadingSkeleton from './LoadingSkeleton';
import { Link } from 'react-router-dom'; // Importar Link

const ClientCharts = () => {
  // Estados simplificados para cada pieza de datos
  const [kpis, setKpis] = useState({
    total_proyectos: 0,
    proyectos_en_progreso: 0,
    proyectos_finalizados: 0,
    proyectos_retrasados: 0,
    porcentaje_retrasados: 0
  });
  const [listaProyectos, setListaProyectos] = useState([]);
  const [estadoChartData, setEstadoChartData] = useState([]);
  const [faseChartData, setFaseChartData] = useState([]);
  const [retrasoChartData, setRetrasoChartData] = useState([]);
  const [fasesRetrasadasList, setFasesRetrasadasList] = useState([]);
  const [radarData, setRadarData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Colores
  const STATUS_COLORS = {
    'En Progreso': '#0088FE',
    'Finalizado': '#00C49F',
    'Sin Proyectos': '#D1D5DB'
  };
  const DELAY_COLORS = {
    'En Tiempo': '#00C49F',
    'Retrasados': '#FF8042',
    'Sin Proyectos': '#D1D5DB'
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const response = await fetchWithAuth(`${API_BASE_URL}/api/client/projects/analytics`);
        const jsonData = await response.json();
        
        if (jsonData && jsonData.success === true && jsonData.data) {
          // Asignar datos a cada estado
          setKpis(jsonData.data.kpis);
          setListaProyectos(jsonData.data.lista_proyectos);
          setEstadoChartData(jsonData.data.estado_proyectos_chart);
          setFaseChartData(jsonData.data.fase_actual_chart);
          setRetrasoChartData(jsonData.data.retraso_fases_chart);
          setFasesRetrasadasList(jsonData.data.lista_fases_retrasadas);
          setRadarData(jsonData.data.radar_data);
        } else {
          throw new Error(jsonData.message || 'Error al cargar los datos');
        }
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  // Helpers para renderizar contenido vacío
  const renderEmptyChart = (title) => (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex items-center justify-center h-64 text-gray-500">
        No hay datos disponibles
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      
      {/* 1. KPIs */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Resumen de Tus Proyectos</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-sm font-medium text-gray-500">Total Proyectos</div>
            <div className="text-xl font-bold text-blue-600">
              {kpis.total_proyectos}
            </div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <div className="text-sm font-medium text-gray-500">En Progreso</div>
            <div className="text-xl font-bold text-yellow-600">
              {kpis.proyectos_en_progreso}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-sm font-medium text-gray-500">Finalizados</div>
            <div className="text-xl font-bold text-green-600">
              {kpis.proyectos_finalizados}
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <div className="text-sm font-medium text-gray-500">Proyectos Retrasados</div>
            <div className="text-xl font-bold text-red-600">
              {kpis.proyectos_retrasados} 
              <span className="text-sm ml-1">({kpis.porcentaje_retrasados}%)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 2. Gráficos Principales (Radar y Estado) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Salud General de Proyectos</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Estado %" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Estado Proyectos (Pie) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Tus Proyectos por Estado</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={estadoChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {estadoChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* 3. Gráficos Secundarios (Fase Actual y Retraso de Fases) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Proyectos por Fase Actual (Bar) */}
        {faseChartData.length > 0 ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Fase Actual (Proy. en Progreso)</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={faseChartData} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" name="Cantidad" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          renderEmptyChart("Fase Actual (Proy. en Progreso)")
        )}
        
        {/* Retraso Fases Actuales (Pie) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Estado de Fases Actuales</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={retrasoChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {retrasoChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DELAY_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Tabla Principal: Progreso de Proyectos */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Progreso de Tus Proyectos</h3>
        {listaProyectos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Proyecto</th>
                  <th className="py-2 px-4 border-b text-center">Fase Actual</th>
                  <th className="py-2 px-4 border-b text-center">Progreso Fase</th>
                  <th className="py-2 px-4 border-b text-center">Días Restantes (Proyecto)</th>
                  <th className="py-2 px-4 border-b text-center">Estado Proyecto</th>
                </tr>
              </thead>
              <tbody>
                {listaProyectos.map((project, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-4 border-b font-medium">
                      <Link to={`/cliente/proyecto/${project.id}`} className="text-blue-600 hover:underline">
                        {project.nombre}
                      </Link>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <span className={`py-1 px-2 rounded-full text-xs ${
                        project.estado === 'Finalizado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.estado === 'Finalizado' ? 'Completado' : project.fase}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full bg-blue-600"
                          style={{ width: `${project.progreso_tiempo}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-center mt-1">{project.progreso_tiempo}%</div>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <span className={`py-1 px-2 rounded-full text-xs ${
                        project.estado === 'Finalizado' ? 'bg-gray-100 text-gray-800' :
                        project.dias_restantes < 0 ? 'bg-red-100 text-red-800' :
                        project.dias_restantes < 15 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {project.estado === 'Finalizado' ? 'N/A' :
                         project.dias_restantes < 0 ? `${Math.abs(project.dias_restantes)} días de retraso` : 
                         `${project.dias_restantes} días`}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${project.retrasado ? 'bg-red-100 text-red-800' : 
                          project.estado === 'Finalizado' ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'}`}>
                        {project.estado === 'Finalizado' ? 'Finalizado' : project.retrasado ? 'Retrasado' : 'En Tiempo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No tienes proyectos asignados</div>
        )}
      </div>

      {/* 5. Tabla: Proyectos con Fases Retrasadas */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Proyectos con Fases Actuales Retrasadas</h3>
        {fasesRetrasadasList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Proyecto</th>
                  <th className="py-2 px-4 border-b text-left">Fase Retrasada</th>
                  <th className="py-2 px-4 border-b text-center">Días de Retraso</th>
                  <th className="py-2 px-4 border-b text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {fasesRetrasadasList.map((project, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-4 border-b font-medium">{project.nombre}</td>
                    <td className="py-2 px-4 border-b">
                      <span className="bg-red-100 text-red-800 py-1 px-2 rounded-full text-xs">
                        {project.fase_retrasada}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b text-center font-bold text-red-700">
                      {project.dias_retraso} días
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <Link 
                        to={`/cliente/proyecto/${project.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Ver Detalles
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">¡Felicidades! Ningún proyecto tiene fases actuales retrasadas.</div>
        )}
      </div>
    </div>
  );
};

export default ClientCharts;