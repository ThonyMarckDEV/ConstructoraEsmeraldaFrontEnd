import React, { useState, useEffect, useRef } from 'react';
import { fetchWithAuth } from '../../../../js/authToken';
import API_BASE_URL from '../../../../js/urlHelper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from '../../../../components/LoadingScreen';
import SweetAlert from '../../../../components/SweetAlert';

const Encargado = () => {
  const [activeTab, setActiveTab] = useState('gestionar');
  const [encargados, setEncargados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    dni: '',
    ruc: '',
    telefono: '',
    username: '',
    password: '',
    estado: 'activo'
  });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    fetchEncargados();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchEncargados = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/encargados`);
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      const data = await response.json();
      if (isMounted.current) {
        setEncargados(data);
        setLoading(false);
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Error al cargar encargados:', error);
        toast.dismiss();
        toast.error('Error al cargar encargados', { toastId: 'fetch-error' });
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El email no es válido';
    if (!formData.username.trim()) newErrors.username = 'El nombre de usuario es obligatorio';
    if (!editMode && !formData.password.trim()) newErrors.password = 'La contraseña es obligatoria';
    if (!editMode && formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      if (editMode) {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/encargados/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al actualizar encargado');
        }
        if (isMounted.current) {
          toast.dismiss();
          toast.success('Encargado actualizado exitosamente', { toastId: 'update-success' });
        }
      } else {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/encargados`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al crear encargado');
        }
        if (isMounted.current) {
          toast.dismiss();
          toast.success('Encargado creado exitosamente', { toastId: 'create-success' });
        }
      }
      if (isMounted.current) {
        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          direccion: '',
          dni: '',
          ruc: '',
          telefono: '',
          username: '',
          password: '',
          estado: 'activo'
        });
        fetchEncargados();
        setEditMode(false);
        setEditId(null);
        setActiveTab('gestionar');
        setLoading(false);
      }
    } catch (error) {
      if (isMounted.current) {
        if (error.response && error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          console.error('Error al guardar encargado:', error);
          toast.dismiss();
          toast.error(error.message || 'Error al guardar encargado', { toastId: 'save-error' });
        }
        setLoading(false);
      }
    }
  };

  const handleEdit = (encargado) => {
    setFormData({
      nombre: encargado.datos.nombre || '',
      apellido: encargado.datos.apellido || '',
      email: encargado.datos.email || '',
      direccion: encargado.datos.direccion || '',
      dni: encargado.datos.dni || '',
      ruc: encargado.datos.ruc || '',
      telefono: encargado.datos.telefono || '',
      username: encargado.username || '',
      password: '',
      estado: encargado.estado || 'activo'
    });
    setEditMode(true);
    setEditId(encargado.idUsuario);
    setActiveTab('agregar');
  };

    const handleDelete = async (id) => {
        try {
        const result = await SweetAlert.showConfirmationAlert(
            "¿Estás seguro de eliminarlo?",
            "Esta acción es irreversible"
        );
        
        // El objeto result tiene la propiedad isConfirmed que indica si el usuario confirmó
        if (result.isConfirmed) {
            setLoading(true);
            
            const response = await fetchWithAuth(`${API_BASE_URL}/api/admin/encargados/${id}`, {
            method: 'DELETE'
            });
            
            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar encargado');
            }
            
            if (isMounted.current) {
            toast.dismiss();
            toast.success('Encargado desactivado exitosamente', { toastId: 'delete-success' });
            fetchEncargados();
            }
        }
        } catch (error) {
        if (isMounted.current) {
            console.error('Error al eliminar encargado:', error);
            toast.dismiss();
            toast.error(error.message || 'Error al eliminar encargado', { toastId: 'delete-error' });
        }
        } finally {
        if (isMounted.current) {
            setLoading(false);
        }
        }
    };

  const filteredEncargados = encargados.filter(encargado => 
    (encargado.datos.nombre && encargado.datos.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (encargado.datos.apellido && encargado.datos.apellido.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (encargado.datos.email && encargado.datos.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (encargado.username && encargado.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="relative p-6 bg-white min-h-screen font-sans">
      {loading && activeTab === 'agregar' && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
          <LoadingScreen />
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
          Gestión de Encargados
        </h1>
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          <button
            className={`pb-3 font-medium text-lg transition-colors ${
              activeTab === 'gestionar'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('gestionar')}
          >
            Gestionar
          </button>
          <button
            className={`pb-3 font-medium text-lg transition-colors ${
              activeTab === 'agregar'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={() => {
              setActiveTab('agregar');
              setEditMode(false);
              setEditId(null);
              setFormData({
                nombre: '',
                apellido: '',
                email: '',
                direccion: '',
                dni: '',
                ruc: '',
                telefono: '',
                username: '',
                password: '',
                estado: 'activo'
              });
            }}
          >
            Agregar
          </button>
        </div>

        {activeTab === 'gestionar' ? (
          <div>
            <div className="mb-6 max-w-md relative">
              <input
                type="text"
                placeholder="Buscar encargados..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredEncargados.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No hay encargados disponibles
                      </td>
                    </tr>
                  ) : (
                    filteredEncargados.map((encargado) => (
                      <tr key={encargado.idUsuario} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-900">
                          {encargado.datos.nombre} {encargado.datos.apellido}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {encargado.datos.email}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {encargado.datos.telefono}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {encargado.username}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              encargado.estado === 'activo'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {encargado.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleEdit(encargado)}
                            className="text-green-600 hover:text-green-800 mr-4 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(encargado.idUsuario)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {editMode ? 'Editar Encargado' : 'Agregar Nuevo Encargado'}
            </h2>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Datos Personales
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-50 border ${
                        errors.nombre ? 'border-red-500' : 'border-gray-200'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    {errors.nombre && (
                      <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-50 border ${
                        errors.apellido ? 'border-red-500' : 'border-gray-200'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    {errors.apellido && (
                      <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-50 border ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-50 border ${
                        errors.telefono ? 'border-red-500' : 'border-gray-200'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    {errors.telefono && (
                      <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <textarea
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Datos de Cuenta
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de usuario *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-50 border ${
                        errors.username ? 'border-red-500' : 'border-gray-200'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {editMode ? 'Contraseña (dejar en blanco para mantener la actual)' : 'Contraseña *'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-gray-50 border ${
                        errors.password ? 'border-red-500' : 'border-gray-200'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DNI
                    </label>
                    <input
                      type="text"
                      name="dni"
                      value={formData.dni}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RUC
                    </label>
                    <input
                      type="text"
                      name="ruc"
                      value={formData.ruc}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
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
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
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
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        limit={3}
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

export default Encargado;