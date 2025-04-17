import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import jwtUtils from '../../../../utilities/jwtUtils';
import LoadingSkeleton from './LoadingSkeleton';

const Charts = () => {
  const [projectData, setProjectData] = useState([]);
  const [projectStats, setProjectStats] = useState({
    total_proyectos: 0,
    proyectos_por_estado: {},
    proyectos_por_fase: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const refresh_token = jwtUtils.getRefreshTokenFromCookie();
        const userId = jwtUtils.getUserID(refresh_token);

        if (!userId) {
          throw new Error('User ID not found');
        }

        // Get the response from the API
        const response = await fetchWithAuth(`${API_BASE_URL}/api/encargados/${userId}/projects/analytics`);
        
        // Parse the response as JSON
        const jsonData = await response.json();
        // console.log("API Response:", jsonData);
        
        // Check if response is successful and contains data
        if (jsonData && jsonData.success === true && jsonData.data) {
          // Set projects data for the timeline chart
          setProjectData(jsonData.data.data || []);
          
          // Set statistics data for other charts
          setProjectStats({
            total_proyectos: jsonData.data.total_proyectos || 0,
            proyectos_por_estado: jsonData.data.proyectos_por_estado || {},
            proyectos_por_fase: jsonData.data.proyectos_por_fase || {}
          });
        } else {
          console.error("Invalid response format:", jsonData);
          setError('Received invalid data format from server');
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

  // Check if we have data for each chart
  const hasPhaseData = phaseChartData.length > 0;
  const hasStatusData = statusChartData.length > 0;
  const hasTimelineData = timelineData.length > 0;

  return (
    <div className="p-4">

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Resumen</h3>
        <div className="text-xl font-bold">
          Total Proyectos Encargados: {projectStats.total_proyectos}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hasPhaseData ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Proyectos por Fase</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={phaseChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Proyectos por Fase</h3>
            <div className="flex items-center justify-center h-64">No hay datos de la fase</div>
          </div>
        )}
        
        {hasStatusData ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Proyectos por Status</h3>
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Proyectos por Status</h3>
            <div className="flex items-center justify-center h-64">No hay datos del status</div>
          </div>
        )}
        
        {hasTimelineData ? (
          <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Duracion de Proyectos (Meses)</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="duration" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Project Duration (months)</h3>
            <div className="flex items-center justify-center h-64">No timeline data available</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;