import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import jwtUtils from '../../../../utilities/jwtUtils';
import LoadingSkeleton from './LoadingSkeleton';
import { Link } from 'react-router-dom'; // Necesario para los enlaces

const Charts = () => {
  // Estados más específicos para cada dato del backend
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
  
  // Colores para los gráficos
  const STATUS_COLORS = {
    'En Progreso': '#0088FE', // Azul
    'Finalizado': '#00C49F', // Verde
    'Sin Proyectos': '#D1D5DB' // Gris
  };
  const DELAY_COLORS = {
    'En Tiempo': '#00C49F', // Verde
    'Retrasados': '#FF8042', // Naranja
    'Sin Proyectos': '#D1D5DB' // Gris
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const refresh_token = jwtUtils.getRefreshTokenFromCookie();
        const userId = jwtUtils.getUserID(refresh_token); // ID del encargado logueado

        if (!userId) {
          throw new Error('No se pudo obtener el ID del encargado');
        }

        // Llamada a la API con el ID del encargado
        const response = await fetchWithAuth(`${API_BASE_URL}/api/encargados/${userId}/projects/analytics`);
        const jsonData = await response.json();
        
        if (jsonData && jsonData.success === true && jsonData.data) {
          // Asigna los datos recibidos a los estados correspondientes
          setKpis(jsonData.data.kpis || kpis); // Usar kpis inicial si no viene nada
          setListaProyectos(jsonData.data.lista_proyectos || []);
          setEstadoChartData(jsonData.data.estado_proyectos_chart || []);
          setFaseChartData(jsonData.data.fase_actual_chart || []);
          setRetrasoChartData(jsonData.data.retraso_fases_chart || []);
          setFasesRetrasadasList(jsonData.data.lista_fases_retrasadas || []);
          setRadarData(jsonData.data.radar_data || []);
        } else {
          throw new Error(jsonData.message || 'Formato de respuesta inválido');
        }
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(`Error al cargar analíticas: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // El array vacío asegura que se ejecute solo una vez

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  // Función para renderizar un mensaje cuando no hay datos para un gráfico
  const RenderEmptyChart = ({ title }) => (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex items-center justify-center h-64 text-gray-500">
        No hay datos suficientes para mostrar este gráfico.
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-6 bg-gray-50"> {/* Fondo ligeramente gris */}
      
      {/* 1. KPIs */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Resumen General</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg text-center shadow-sm">
            <div className="text-sm font-medium text-blue-800">Total Proyectos</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{kpis.total_proyectos}</div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center shadow-sm">
            <div className="text-sm font-medium text-yellow-800">En Progreso</div>
            <div className="text-2xl font-bold text-yellow-600 mt-1">{kpis.proyectos_en_progreso}</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center shadow-sm">
            <div className="text-sm font-medium text-green-800">Finalizados</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{kpis.proyectos_finalizados}</div>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center shadow-sm">
            <div className="text-sm font-medium text-red-800">Proyectos Retrasados</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {kpis.proyectos_retrasados} <span className="text-base">({kpis.porcentaje_retrasados}%)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 2. Gráficos Principales (Radar y Estado) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Salud General de Proyectos</h3>
          <div className="w-full h-72"> {/* Aumentar altura */}
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="80%" data={radarData}> {/* Usar % */}
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Salud %" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip formatter={(value) => `${value}%`} /> {/* Mostrar % en tooltip */}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Estado Proyectos (Pie) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Proyectos por Estado</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={estadoChartData} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius="80%" 
                  label={({name, percent}) => `${name}: ${Math.round(percent * 100)}%`}
                >
                  {estadoChartData.map((entry, index) => (
                    <Cell key={`cell-status-${index}`} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36}/>
                <Tooltip formatter={(value, name) => [value, name]}/>
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
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Fase Actual (Proyectos Activos)</h3>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                {/* Gráfico de barras vertical si hay muchas fases, horizontal si hay pocas */}
                {faseChartData.length > 5 ? (
                   <BarChart data={faseChartData} layout="vertical" margin={{ left: 120 }}> {/* Más margen */}
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis type="number" allowDecimals={false}/>
                     <YAxis dataKey="name" type="category" width={120} interval={0} />
                     <Tooltip />
                     <Bar dataKey="count" name="Cantidad" fill="#3B82F6" /> {/* Azul */}
                   </BarChart>
                ) : (
                  <BarChart data={faseChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" name="Cantidad" fill="#3B82F6" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <RenderEmptyChart title="Fase Actual (Proyectos Activos)" />
        )}
        
        {/* Retraso Fases Actuales (Pie) */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Estado Fases Actuales (Proyectos Activos)</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={retrasoChartData} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius="80%"
                  label={({name, percent}) => `${name}: ${Math.round(percent * 100)}%`}
                >
                  {retrasoChartData.map((entry, index) => (
                    <Cell key={`cell-delay-${index}`} fill={DELAY_COLORS[entry.name]} />
                  ))}
                </Pie>
                 <Legend verticalAlign="bottom" height={36}/>
                 <Tooltip formatter={(value, name) => [value, name]}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Tabla Principal: Progreso de Proyectos */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Panel de Progreso de Proyectos</h3>
        {listaProyectos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-3 border-b text-left text-sm font-semibold text-gray-600">Proyecto</th>
                  <th className="py-2 px-3 border-b text-center text-sm font-semibold text-gray-600">Fase Actual</th>
                  <th className="py-2 px-3 border-b text-center text-sm font-semibold text-gray-600 w-1/4">Progreso Fase</th> {/* Ancho fijo */}
                  <th className="py-2 px-3 border-b text-center text-sm font-semibold text-gray-600">Días Rest. (Proy.)</th>
                  <th className="py-2 px-3 border-b text-center text-sm font-semibold text-gray-600">Estado Proy.</th>
                </tr>
              </thead>
              <tbody>
                {listaProyectos.map((project, index) => (
                  <tr key={project.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                    <td className="py-2 px-3 border-b text-sm font-medium">
                      {/* Enlace al detalle del proyecto */}
                      <Link to={`/encargado/proyecto/${project.id}`} className="text-blue-600 hover:underline">
                        {project.nombre}
                      </Link>
                    </td>
                    <td className="py-2 px-3 border-b text-center text-xs">
                      <span className={`py-1 px-2 rounded-full font-medium ${
                        project.estado === 'Finalizado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.estado === 'Finalizado' ? 'Completado' : project.fase}
                      </span>
                    </td>
                    <td className="py-2 px-3 border-b text-sm">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${project.progreso_fase_actual > 75 ? 'bg-green-500' : project.progreso_fase_actual > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${project.progreso_fase_actual}%` }}
                          title={`${project.progreso_fase_actual}% completado`}
                        ></div>
                      </div>
                      <div className="text-xs text-center mt-1 text-gray-600">{project.progreso_fase_actual}%</div>
                    </td>
                    <td className="py-2 px-3 border-b text-center text-xs font-medium">
                      <span className={`py-1 px-2 rounded-full ${
                        project.estado === 'Finalizado' ? 'bg-gray-100 text-gray-500' :
                        project.dias_restantes === null ? 'bg-gray-100 text-gray-500' : // Sin fecha estimada
                        project.retrasado ? 'bg-red-100 text-red-800' :
                        project.dias_restantes < 15 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {project.estado === 'Finalizado' ? '--' :
                         project.dias_restantes === null ? 'Sin fecha' :
                         project.retrasado ? `${Math.abs(project.dias_restantes)} días tarde` : 
                         `${project.dias_restantes} días`}
                      </span>
                    </td>
                    <td className="py-2 px-3 border-b text-center text-xs font-medium">
                      <span className={`py-1 px-2 rounded-full ${
                          project.estado === 'Finalizado' ? 'bg-green-100 text-green-800' :
                          project.retrasado ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.estado === 'Finalizado' ? 'Finalizado' : project.retrasado ? 'Retrasado' : 'En Tiempo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No tienes proyectos asignados.</div>
        )}
      </div>

      {/* 5. Tabla: Proyectos con Fases Retrasadas */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-red-700">⚠️ Proyectos con Fases Actuales Retrasadas</h3>
        {fasesRetrasadasList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-red-50">
                <tr>
                  <th className="py-2 px-3 border-b text-left text-sm font-semibold text-red-800">Proyecto</th>
                  <th className="py-2 px-3 border-b text-left text-sm font-semibold text-red-800">Fase Retrasada</th>
                  <th className="py-2 px-3 border-b text-center text-sm font-semibold text-red-800">Días de Retraso</th>
                  <th className="py-2 px-3 border-b text-center text-sm font-semibold text-red-800">Acción</th>
                </tr>
              </thead>
              <tbody>
                {fasesRetrasadasList.map((project, index) => (
                  <tr key={`delayed-${project.id}`} className="hover:bg-red-50">
                    <td className="py-2 px-3 border-b text-sm font-medium">{project.nombre}</td>
                    <td className="py-2 px-3 border-b text-xs font-medium text-red-700">
                       {project.fase_retrasada}
                    </td>
                    <td className="py-2 px-3 border-b text-center font-bold text-red-600 text-sm">
                      {project.dias_retraso} días
                    </td>
                    <td className="py-2 px-3 border-b text-center">
                      <Link 
                        to={`/encargado/proyecto/${project.id}`} // Enlace al proyecto específico
                        className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded shadow-sm"
                      >
                        Revisar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-green-700 font-medium">✅ ¡Excelente! Ningún proyecto tiene su fase actual retrasada.</div>
        )}
      </div>
    </div>
  );
};

export default Charts;