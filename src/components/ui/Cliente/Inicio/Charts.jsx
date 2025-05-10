import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Area
} from 'recharts';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import jwtUtils from '../../../../utilities/jwtUtils';
import LoadingSkeleton from './LoadingSkeleton';

const ClientCharts = () => {
  const [projectData, setProjectData] = useState([]);
  const [projectStats, setProjectStats] = useState({
    total_proyectos: 0,
    proyectos_por_estado: {},
    proyectos_por_fase: {},
    proyectos_retrasados: { count: 0, percentage: 0 },
    fases_porcentaje_completado: {},
    fases_tiempo_promedio: {},
    proyectos_con_fases_retrasadas: [],
    tendencia_finalizacion: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];
  const STATUS_COLORS = {
    'En Progreso': '#0088FE',
    'Finalizado': '#00C49F'
  };
  
  const PHASE_COLORS = {
    'Planificación': '#0088FE',
    'Preparación del Terreno': '#00C49F',
    'Construcción de Cimientos': '#FFBB28',
    'Estructura y Superestructura': '#FF8042',
    'Instalaciones': '#8884d8',
    'Acabados': '#82ca9d',
    'Inspección y Pruebas': '#ffc658',
    'Entrega': '#8dd1e1'
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const refresh_token = jwtUtils.getRefreshTokenFromCookie();
        const userId = jwtUtils.getUserID(refresh_token);

        if (!userId) {
          throw new Error('User ID not found');
        }

        // Fetch analytics for client's projects
        const response = await fetchWithAuth(`${API_BASE_URL}/api/client/projects/analytics`);
        
        // Parse the response as JSON
        const jsonData = await response.json();
        
        // Check if response is successful and contains data
        if (jsonData && jsonData.success === true && jsonData.data) {
          setProjectData(jsonData.data.data || []);
          setProjectStats({
            total_proyectos: jsonData.data.total_proyectos || 0,
            proyectos_por_estado: jsonData.data.proyectos_por_estado || {},
            proyectos_por_fase: jsonData.data.proyectos_por_fase || {},
            proyectos_retrasados: jsonData.data.proyectos_retrasados || { count: 0, percentage: 0 },
            fases_porcentaje_completado: jsonData.data.fases_porcentaje_completado || {},
            fases_tiempo_promedio: jsonData.data.fases_tiempo_promedio || {},
            proyectos_con_fases_retrasadas: jsonData.data.proyectos_con_fases_retrasadas || [],
            tendencia_finalizacion: jsonData.data.tendencia_finalizacion || []
          });
        } else {
          console.error("Invalid response format:", jsonData);
          setError(jsonData.message || 'Received invalid data format from server');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError('Failed to load analytics data: ' + (err.message || 'Unknown error'));
        setLoading(false);
      }
    };

    fetchProjectData();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  
  // Transform phase data for chart
  const phaseChartData = Object.entries(projectStats.proyectos_por_fase || {}).map(([phase, count]) => ({
    name: phase,
    count: count
  }));

  // Transform status data for pie chart
  const statusChartData = Object.entries(projectStats.proyectos_por_estado || {}).map(([status, value]) => ({
    name: status,
    value: value
  }));

  // Prepare timeline data for projects
  const timelineData = projectData.map(project => ({
    name: project.nombre?.substring(0, 15) + (project.nombre?.length > 15 ? '...' : '') || 'Unnamed',
    duration: project.duration || 0
  }));
  
  // Prepare phase completion data
  const phaseCompletionData = Object.entries(projectStats.fases_porcentaje_completado || {}).map(([phase, percentage]) => ({
    name: phase,
    porcentaje: percentage
  }));
  
  // Prepare phase average time data
  const phaseTimeData = Object.entries(projectStats.fases_tiempo_promedio || {}).map(([phase, time]) => ({
    name: phase,
    dias: time
  }));
  
  // Format project completion trend data
  const completionTrendData = projectStats.tendencia_finalizacion || [];
  
  // Calculate projects by delay status
  const projectsByDelayStatus = [
    { name: 'En Tiempo', value: projectData.filter(p => !p.retrasado).length },
    { name: 'Retrasados', value: projectStats.proyectos_retrasados.count }
  ];
  
  // Get the 5 projects with the least remaining days (closest to deadline)
  const projectsNearDeadline = [...projectData]
    .filter(p => p.estado === 'En Progreso' && p.dias_restantes >= 0)
    .sort((a, b) => a.dias_restantes - b.dias_restantes)
    .slice(0, 5)
    .map(p => ({
      name: p.nombre?.substring(0, 15) + (p.nombre?.length > 15 ? '...' : '') || 'Unnamed',
      dias: p.dias_restantes
    }));

  // Check if we have data for each chart
  const hasPhaseData = phaseChartData.length > 0;
  const hasStatusData = statusChartData.length > 0;
  const hasTimelineData = timelineData.length > 0;
  const hasCompletionData = phaseCompletionData.length > 0;
  const hasTimeData = phaseTimeData.length > 0;
  const hasTrendData = completionTrendData.length > 0;
  const hasDeadlineData = projectsNearDeadline.length > 0;

  // Radar data for overall project health
  const radarData = [
    {
      subject: 'En Tiempo',
      A: 100 - projectStats.proyectos_retrasados.percentage,
      fullMark: 100,
    },
    {
      subject: 'Fases Completadas',
      A: Object.values(projectStats.fases_porcentaje_completado || {})
        .reduce((acc, val) => acc + val, 0) / 
        (Object.values(projectStats.fases_porcentaje_completado || {}).length || 1),
      fullMark: 100,
    },
    {
      subject: 'Proyectos Finalizados',
      A: (projectStats.proyectos_por_estado['Finalizado'] || 0) / 
         (projectStats.total_proyectos || 1) * 100,
      fullMark: 100,
    },
    {
      subject: 'Progreso General',
      A: projectData
        .filter(p => p.progreso_tiempo)
        .reduce((acc, p) => acc + p.progreso_tiempo, 0) / 
        (projectData.length || 1),
      fullMark: 100,
    }
  ];

  return (
    <div className="p-4">
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Resumen de Tus Proyectos</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-sm font-medium text-gray-500">Total Proyectos</div>
            <div className="text-xl font-bold text-blue-600">
              {projectStats.total_proyectos}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-sm font-medium text-gray-500">Proyectos Finalizados</div>
            <div className="text-xl font-bold text-green-600">
              {projectStats.proyectos_por_estado['Finalizado'] || 0}
            </div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <div className="text-sm font-medium text-gray-500">Proyectos En Progreso</div>
            <div className="text-xl font-bold text-yellow-600">
              {projectStats.proyectos_por_estado['En Progreso'] || 0}
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <div className="text-sm font-medium text-gray-500">Proyectos Retrasados</div>
            <div className="text-xl font-bold text-red-600">
              {projectStats.proyectos_retrasados.count} 
              <span className="text-sm ml-1">
                ({projectStats.proyectos_retrasados.percentage}%)
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Radar Chart for Project Health */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Estado General de Tus Proyectos</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Estado %" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      
        {/* Projects By Status */}
        {hasStatusData ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Tus Proyectos por Estado</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Tus Proyectos por Estado</h3>
            <div className="flex items-center justify-center h-64">No hay datos de estado</div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Projects By Phase */}
        {hasPhaseData ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Tus Proyectos por Fase</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={phaseChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Cantidad" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Tus Proyectos por Fase</h3>
            <div className="flex items-center justify-center h-64">No hay datos de fase</div>
          </div>
        )}
        
        {/* Projects By Delay Status */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Estado de Retraso</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectsByDelayStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#00C49F" />
                  <Cell fill="#FF8042" />
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Phase Completion Percentage */}
        {hasCompletionData ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Progreso de Fases</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={phaseCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="porcentaje" name="% Completado" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Progreso de Fases</h3>
            <div className="flex items-center justify-center h-64">No hay datos disponibles</div>
          </div>
        )}
        
        {/* Phase Average Time */}
        {hasTimeData ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Tiempo Promedio por Fase (Días)</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={phaseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="dias" name="Días" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Tiempo Promedio por Fase (Días)</h3>
            <div className="flex items-center justify-center h-64">No hay datos disponibles</div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Project Completion Trend */}
        {hasTrendData ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Historial de Finalización</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={completionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Proyectos Finalizados" barSize={20} fill="#413ea0" />
                  <Line type="monotone" dataKey="count" stroke="#ff7300" />
                  <Area type="monotone" dataKey="count" fill="#8884d8" stroke="#8884d8" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Historial de Finalización</h3>
            <div className="flex items-center justify-center h-64">No hay datos de tendencia disponibles</div>
          </div>
        )}
        
        {/* Projects Near Deadline */}
        {hasDeadlineData ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Proyectos Próximos a Entrega</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectsNearDeadline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="dias" name="Días Restantes" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Proyectos Próximos a Entrega</h3>
            <div className="flex items-center justify-center h-64">No hay proyectos próximos a vencer</div>
          </div>
        )}
      </div>
      
      {/* Project Duration Timeline */}
      {hasTimelineData ? (
        <div className="bg-white p-4 rounded-lg shadow md:col-span-1 mb-6">
          <h3 className="text-lg font-semibold mb-4">Duración de Tus Proyectos (Meses)</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="duration" name="Meses" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow md:col-span-1 mb-6">
          <h3 className="text-lg font-semibold mb-4">Duración de Tus Proyectos (Meses)</h3>
          <div className="flex items-center justify-center h-64">No hay datos de duración disponibles</div>
        </div>
      )}
      
      {/* Projects with Delayed Phases */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Proyectos con Fases Retrasadas</h3>
        {projectStats.proyectos_con_fases_retrasadas && projectStats.proyectos_con_fases_retrasadas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Proyecto</th>
                  <th className="py-2 px-4 border-b text-center">Fases Retrasadas</th>
                  <th className="py-2 px-4 border-b text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {projectStats.proyectos_con_fases_retrasadas.map((project, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-4 border-b">{project.nombre}</td>
                    <td className="py-2 px-4 border-b text-center">
                      <span className="bg-red-100 text-red-800 py-1 px-2 rounded-full">
                        {project.fases_retrasadas}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                        onClick={() => console.log(`Ver detalles de ${project.nombre}`)}
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No hay proyectos con fases retrasadas</div>
        )}
      </div>
      
      {/* Project Progress Dashboard */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Progreso de Tus Proyectos</h3>
        {projectData && projectData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Proyecto</th>
                  <th className="py-2 px-4 border-b text-center">Fase Actual</th>
                  <th className="py-2 px-4 border-b text-center">Progreso</th>
                  <th className="py-2 px-4 border-b text-center">Días Restantes</th>
                  <th className="py-2 px-4 border-b text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {projectData.filter(p => p.estado === 'En Progreso').slice(0, 5).map((project, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-4 border-b font-medium">{project.nombre}</td>
                    <td className="py-2 px-4 border-b text-center">
                      <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs">
                        {project.fase}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${project.progreso_tiempo > 90 ? 'bg-green-600' : 
                            project.progreso_tiempo > 60 ? 'bg-green-500' : 
                            project.progreso_tiempo > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${project.progreso_tiempo}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-center mt-1">{project.progreso_tiempo}%</div>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <span className={`py-1 px-2 rounded-full text-xs ${
                        project.dias_restantes < 0 ? 'bg-red-100 text-red-800' :
                        project.dias_restantes < 15 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {project.dias_restantes < 0 ? `${Math.abs(project.dias_restantes)} días de retraso` : 
                         `${project.dias_restantes} días`}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${project.retrasado ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {project.retrasado ? 'Retrasado' : 'En Tiempo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No tienes proyectos en progreso</div>
        )}
      </div>
      
      {/* Project Timeline Distribution Analysis */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Distribución de Tiempo en Fases</h3>
        <div className="text-sm text-gray-500 mb-4">
          Este gráfico muestra cuánto tiempo promedio se dedica a cada fase en tus proyectos.
        </div>
        {hasTimeData ? (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={phaseTimeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="dias"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {phaseTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PHASE_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} días`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No hay datos suficientes para mostrar la distribución de tiempo
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientCharts;