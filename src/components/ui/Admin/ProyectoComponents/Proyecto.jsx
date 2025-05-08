import React, { useState, useEffect, useRef } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from '../../../../components/LoadingScreen';
import SweetAlert from '../../../../components/SweetAlert';

const Proyecto = () => {
  const [activeTab, setActiveTab] = useState('gestionar');
  const [proyectos, setProyectos] = useState([]);
  const [encargados, setEncargados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin_estimada: '',
    estado: 'En Progreso',
    fase: 'Planificación',
    fases: [
      { nombreFase: 'Planificación', fecha_inicio: '', fecha_fin: '', descripcion: '' },
      { nombreFase: 'Preparación del Terreno', fecha_inicio: '', fecha_fin: '', descripcion: '' },
      { nombreFase: 'Construcción de Cimientos', fecha_inicio: '', fecha_fin: '', descripcion: '' },
      { nombreFase: 'Estructura y Superestructura', fecha_inicio: '', fecha_fin: '', descripcion: '' },
      { nombreFase: 'Instalaciones', fecha_inicio: '', fecha_fin: '', descripcion: '' },
      { nombreFase: 'Acabados', fecha_inicio: '', fecha_fin: '', descripcion: '' },
      { nombreFase: 'Inspección y Pruebas', fecha_inicio: '', fecha_fin: '', descripcion: '' },
      { nombreFase: 'Entrega', fecha_inicio: '', fecha_fin: '', descripcion: '' },
    ],
  });
  const [assignData, setAssignData] = useState({
    idEncargado: '',
    idCliente: '',
    idProyecto: '',
  });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    fetchProyectos();
    fetchEncargados();
    fetchClientes();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchProyectos = async () => {
    try {
      setLoadingFetch(true);
      const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/proyectos`);
      if (!response.ok) throw new Error('Error al cargar proyectos');
      const data = await response.json();
      if (isMounted.current) {
        setProyectos(data);
        setLoadingFetch(false);
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Error al cargar proyectos:', error);
        toast.error('Error al cargar proyectos', { toastId: 'fetch-error' });
        setLoadingFetch(false);
      }
    }
  };

  const fetchEncargados = async () => {
    try {
      setLoadingFetch(true);
      const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/encargados`);
      if (!response.ok) throw new Error('Error al cargar encargados');
      const data = await response.json();
      if (isMounted.current) {
        setEncargados(data.filter(user => user.idRol === 3)); // idRol 3 = manager
        setLoadingFetch(false);
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Error al cargar encargados:', error);
        toast.error('Error al cargar encargados', { toastId: 'fetch-encargados-error' });
        setLoadingFetch(false);
      }
    }
  };

  const fetchClientes = async () => {
    try {
      setLoadingFetch(true);
      const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/clientes`);
      if (!response.ok) throw new Error('Error al cargar clientes');
      const data = await response.json();
      if (isMounted.current) {
        setClientes(data.filter(user => user.idRol === 2)); // idRol 2 = cliente
        setLoadingFetch(false);
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Error al cargar clientes:', error);
        toast.error('Error al cargar clientes', { toastId: 'fetch-clientes-error' });
        setLoadingFetch(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhaseChange = (index, field, value) => {
    const updatedFases = [...formData.fases];
    updatedFases[index] = { ...updatedFases[index], [field]: value };
    setFormData({ ...formData, fases: updatedFases });
  };

  const handleAssignChange = (e) => {
    const { name, value } = e.target;
    setAssignData({ ...assignData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.fecha_inicio) newErrors.fecha_inicio = 'La fecha de inicio es obligatoria';
    if (!formData.fecha_fin_estimada) newErrors.fecha_fin_estimada = 'La fecha de fin estimada es obligatoria';
    formData.fases.forEach((fase, index) => {
      if (fase.fecha_inicio && !fase.fecha_fin) {
        newErrors[`fase_${index}_fecha_fin`] = `Fecha de fin requerida para ${fase.nombreFase}`;
      }
      if (fase.fecha_fin && !fase.fecha_inicio) {
        newErrors[`fase_${index}_fecha_inicio`] = `Fecha de inicio requerida para ${fase.nombreFase}`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAssignForm = () => {
    const newErrors = {};
    if (!assignData.idEncargado) newErrors.idEncargado = 'Seleccione un encargado';
    if (!assignData.idCliente) newErrors.idCliente = 'Seleccione un cliente';
    if (!assignData.idProyecto) newErrors.idProyecto = 'Seleccione un proyecto';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoadingAction(true);
      const payload = { ...formData, fases: formData.fases.filter(fase => fase.fecha_inicio || fase.fecha_fin || fase.descripcion) };
      if (editMode) {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/proyectos/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al actualizar proyecto');
        }
        toast.success('Proyecto actualizado exitosamente', { toastId: 'update-success' });
      } else {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/proyectos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al crear proyecto');
        }
        toast.success('Proyecto creado exitosamente', { toastId: 'create-success' });
      }
      if (isMounted.current) {
        setFormData({
          nombre: '',
          descripcion: '',
          fecha_inicio: '',
          fecha_fin_estimada: '',
          estado: 'En Progreso',
          fase: 'Planificación',
          fases: [
            { nombreFase: 'Planificación', fecha_inicio: '', fecha_fin: '', descripcion: '' },
            { nombreFase: 'Preparación del Terreno', fecha_inicio: '', fecha_fin: '', descripcion: '' },
            { nombreFase: 'Construcción de Cimientos', fecha_inicio: '', fecha_fin: '', descripcion: '' },
            { nombreFase: 'Estructura y Superestructura', fecha_inicio: '', fecha_fin: '', descripcion: '' },
            { nombreFase: 'Instalaciones', fecha_inicio: '', fecha_fin: '', descripcion: '' },
            { nombreFase: 'Acabados', fecha_inicio: '', fecha_fin: '', descripcion: '' },
            { nombreFase: 'Inspección y Pruebas', fecha_inicio: '', fecha_fin: '', descripcion: '' },
            { nombreFase: 'Entrega', fecha_inicio: '', fecha_fin: '', descripcion: '' },
          ],
        });
        fetchProyectos();
        setEditMode(false);
        setEditId(null);
        setActiveTab('gestionar');
        setLoadingAction(false);
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Error al guardar proyecto:', error);
        toast.error(error.message || 'Error al guardar proyecto', { toastId: 'save-error' });
        setLoadingAction(false);
      }
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!validateAssignForm()) return;
    try {
      setLoadingAction(true);
      const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/proyectos/asignar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al asignar proyecto');
      }
      if (isMounted.current) {
        toast.success('Proyecto asignado exitosamente', { toastId: 'assign-success' });
        setAssignData({ idEncargado: '', idCliente: '', idProyecto: '' });
        fetchProyectos();
        setActiveTab('gestionar');
        setLoadingAction(false);
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Error al asignar proyecto:', error);
        toast.error(error.message || 'Error al asignar proyecto', { toastId: 'assign-error' });
        setLoadingAction(false);
      }
    }
  };

  const handleEdit = (proyecto) => {
    const fases = [
      'Planificación',
      'Preparación del Terreno',
      'Construcción de Cimientos',
      'Estructura y Superestructura',
      'Instalaciones',
      'Acabados',
      'Inspección y Pruebas',
      'Entrega',
    ].map((nombreFase) => {
      const fase = proyecto.fases.find((f) => f.nombreFase === nombreFase) || {};
      return {
        nombreFase,
        fecha_inicio: fase.fecha_inicio || '',
        fecha_fin: fase.fecha_fin || '',
        descripcion: fase.descripcion || '',
      };
    });
    setFormData({
      nombre: proyecto.nombre || '',
      descripcion: proyecto.descripcion || '',
      fecha_inicio: proyecto.fecha_inicio || '',
      fecha_fin_estimada: proyecto.fecha_fin_estimada || '',
      estado: proyecto.estado || 'En Progreso',
      fase: proyecto.fase || 'Planificación',
      fases,
    });
    setEditMode(true);
    setEditId(proyecto.idProyecto);
    setActiveTab('agregar');
  };

  const handleDelete = async (id) => {
    try {
      const result = await SweetAlert.showConfirmationAlert(
        '¿Estás seguro de eliminarlo?',
        'Esta acción es irreversible'
      );
      if (result.isConfirmed) {
        setLoadingAction(true);
        const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/proyectos/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al eliminar proyecto');
        }
        if (isMounted.current) {
          toast.success('Proyecto eliminado exitosamente', { toastId: 'delete-success' });
          fetchProyectos();
        }
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Error al eliminar proyecto:', error);
        toast.error(error.message || 'Error al eliminar proyecto', { toastId: 'delete-error' });
      }
    } finally {
      if (isMounted.current) setLoadingAction(false);
    }
  };

  const filteredProyectos = proyectos.filter(
    (proyecto) =>
      proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative p-6 bg-white min-h-screen font-sans">
      {loadingAction && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
          <LoadingScreen />
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Gestión de Proyectos</h1>
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          {['gestionar', 'agregar', 'asignar'].map((tab) => (
            <button
              key={tab}
              className={`pb-3 font-medium text-lg transition-colors ${
                activeTab === tab ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-900'
              }`}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'agregar') {
                  setEditMode(false);
                  setEditId(null);
                  setFormData({
                    nombre: '',
                    descripcion: '',
                    fecha_inicio: '',
                    fecha_fin_estimada: '',
                    estado: 'En Progreso',
                    fase: 'Planificación',
                    fases: [
                      { nombreFase: 'Planificación', fecha_inicio: '', fecha_fin: '', descripcion: '' },
                      { nombreFase: 'Preparación del Terreno', fecha_inicio: '', fecha_fin: '', descripcion: '' },
                      { nombreFase: 'Construcción de Cimientos', fecha_inicio: '', fecha_fin: '', descripcion: '' },
                      { nombreFase: 'Estructura y Superestructura', fecha_inicio: '', fecha_fin: '', descripcion: '' },
                      { nombreFase: 'Instalaciones', fecha_inicio: '', fecha_fin: '', descripcion: '' },
                      { nombreFase: 'Acabados', fecha_inicio: '', fecha_fin: '', descripcion: '' },
                      { nombreFase: 'Inspección y Pruebas', fecha_inicio: '', fecha_fin: '', descripcion: '' },
                      { nombreFase: 'Entrega', fecha_inicio: '', fecha_fin: '', descripcion: '' },
                    ],
                  });
                } else if (tab === 'asignar') {
                  setAssignData({ idEncargado: '', idCliente: '', idProyecto: '' });
                }
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'gestionar' ? (
          <div>
            <div className="mb-6 max-w-md relative">
              <input
                type="text"
                placeholder="Buscar proyectos..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">Encargado</th>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">Cliente</th>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">Fase</th>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loadingFetch ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredProyectos.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No hay proyectos disponibles</td>
                    </tr>
                  ) : (
                    filteredProyectos.map((proyecto) => (
                      <tr key={proyecto.idProyecto} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-900">{proyecto.nombre}</td>
                        <td className="px-6 py-4 text-gray-900">{proyecto.encargado?.datos?.nombre || 'No asignado'}</td>
                        <td className="px-6 py-4 text-gray-900">{proyecto.cliente?.datos?.nombre || 'No asignado'}</td>
                        <td className="px-6 py-4 text-gray-900">{proyecto.fase}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${proyecto.estado === 'En Progreso' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {proyecto.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button onClick={() => handleEdit(proyecto)} className="text-green-600 hover:text-green-800 mr-4 transition-colors">Editar</button>
                          <button onClick={() => handleDelete(proyecto.idProyecto)} className="text-red-500 hover:text-red-700 transition-colors">Eliminar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'agregar' ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{editMode ? 'Editar Proyecto' : 'Agregar Nuevo Proyecto'}</h2>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Detalles del Proyecto</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-50 border ${errors.nombre ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio *</label>
                    <input
                      type="date"
                      name="fecha_inicio"
                      value={formData.fecha_inicio}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-50 border ${errors.fecha_inicio ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    {errors.fecha_inicio && <p className="text-red-500 text-xs mt-1">{errors.fecha_inicio}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin Estimada *</label>
                    <input
                      type="date"
                      name="fecha_fin_estimada"
                      value={formData.fecha_fin_estimada}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-50 border ${errors.fecha_fin_estimada ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    {errors.fecha_fin_estimada && <p className="text-red-500 text-xs mt-1">{errors.fecha_fin_estimada}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="En Progreso">En Progreso</option>
                      <option value="Finalizado">Finalizado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fase Actual</label>
                    <select
                      name="fase"
                      value={formData.fase}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {[
                        'Planificación',
                        'Preparación del Terreno',
                        'Construcción de Cimientos',
                        'Estructura y Superestructura',
                        'Instalaciones',
                        'Acabados',
                        'Inspección y Pruebas',
                        'Entrega',
                      ].map((fase) => (
                        <option key={fase} value={fase}>{fase}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Fases del Proyecto</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b min-w-[200px]">Fase</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b min-w-[150px]">Fecha de Inicio</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b min-w-[150px]">Fecha de Fin</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b min-w-[250px]">Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.fases.map((fase, index) => (
                          <tr key={fase.nombreFase} className="border-b">
                            <td className="px-4 py-2 text-sm text-gray-900">{fase.nombreFase}</td>
                            <td className="px-4 py-2">
                              <input
                                type="date"
                                value={fase.fecha_inicio}
                                onChange={(e) => handlePhaseChange(index, 'fecha_inicio', e.target.value)}
                                className={`w-full px-2 py-1 bg-gray-50 border ${errors[`fase_${index}_fecha_inicio`] ? 'border-red-500' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm`}
                              />
                              {errors[`fase_${index}_fecha_inicio`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`fase_${index}_fecha_inicio`]}</p>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="date"
                                value={fase.fecha_fin}
                                onChange={(e) => handlePhaseChange(index, 'fecha_fin', e.target.value)}
                                className={`w-full px-2 py-1 bg-gray-50 border ${errors[`fase_${index}_fecha_fin`] ? 'border-red-500' : 'border-gray-200'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm`}
                              />
                              {errors[`fase_${index}_fecha_fin`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`fase_${index}_fecha_fin`]}</p>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <textarea
                                value={fase.descripcion}
                                onChange={(e) => handlePhaseChange(index, 'descripcion', e.target.value)}
                                className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                rows="2"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('gestionar')}
                  className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  disabled={loadingAction}
                >
                  {loadingAction ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </span>
                  ) : (
                    'Guardar'
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAssignSubmit} className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Asignar Proyecto</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto *</label>
                <select
                  name="idProyecto"
                  value={assignData.idProyecto}
                  onChange={handleAssignChange}
                  className={`w-full px-4 py-2 bg-gray-50 border ${errors.idProyecto ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  {loadingFetch ? (
                    <option value="">Cargando...</option>
                  ) : (
                    <>
                      <option value="">Seleccione un proyecto</option>
                      {proyectos.map((proyecto) => (
                        <option key={proyecto.idProyecto} value={proyecto.idProyecto}>{proyecto.nombre}</option>
                      ))}
                    </>
                  )}
                </select>
                {errors.idProyecto && <p className="text-red-500 text-xs mt-1">{errors.idProyecto}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Encargado *</label>
                <select
                  name="idEncargado"
                  value={assignData.idEncargado}
                  onChange={handleAssignChange}
                  className={`w-full px-4 py-2 bg-gray-50 border ${errors.idEncargado ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  {loadingFetch ? (
                    <option value="">Cargando...</option>
                  ) : (
                    <>
                      <option value="">Seleccione un encargado</option>
                      {encargados.map((encargado) => (
                        <option key={encargado.idUsuario} value={encargado.idUsuario}>{encargado.datos?.nombre || 'Sin nombre'} {encargado.datos?.apellido || ''}</option>
                      ))}
                    </>
                  )}
                </select>
                {errors.idEncargado && <p className="text-red-500 text-xs mt-1">{errors.idEncargado}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                <select
                  name="idCliente"
                  value={assignData.idCliente}
                  onChange={handleAssignChange}
                  className={`w-full px-4 py-2 bg-gray-50 border ${errors.idCliente ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  {loadingFetch ? (
                    <option value="">Cargando...</option>
                  ) : (
                    <>
                      <option value="">Seleccione un cliente</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.idUsuario} value={cliente.idUsuario}>{cliente.datos?.nombre || 'Sin nombre'} {cliente.datos?.apellido || ''}</option>
                      ))}
                    </>
                  )}
                </select>
                {errors.idCliente && <p className="text-red-500 text-xs mt-1">{errors.idCliente}</p>}
              </div>
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('gestionar')}
                  className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  disabled={loadingAction}
                >
                  {loadingAction ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy deshabilita los select cuando este en true loadingAction="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Asignando...
                    </span>
                  ) : (
                    'Asignar'
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        limit={1}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default Proyecto;