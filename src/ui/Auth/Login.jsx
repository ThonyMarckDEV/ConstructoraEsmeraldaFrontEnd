import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';
import LoadingScreen from '../../components/LoadingScreen';
import LoginForm from '../../components/Auth/Login/LoginForm';
import ErrorsUtility from '../../utilities/ErrorsUtility';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, 
        { username, 
          password,
          remember_me: rememberMe  // Si pide recordar
        }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = response.data;

      const access_token = result.access_token;
      const refresh_token = result.refresh_token;

      // Configurar opciones de cookies según "Recordarme"
      const accessTokenExpiration = '; path=/; Secure; SameSite=Strict'; // Sesión (5 min se maneja en backend)
      const refreshTokenExpiration = rememberMe
        ? `; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; Secure; SameSite=Strict`
        : '; path=/; Secure; SameSite=Strict'; //7 dias igual que el refresh

      // Establecer cookies
      document.cookie = `access_token=${access_token}${accessTokenExpiration}`;
      document.cookie = `refresh_token=${refresh_token}${refreshTokenExpiration}`;

      const rol = jwtUtils.getUserRole(access_token);

      if (rol === 'cliente') {
        toast.success(`Login exitoso!!`);
        setTimeout(() => {
          window.location.href = '/cliente';
        }, 1500);
      } else if (rol === 'manager') {
        toast.success(`Login exitoso!!`);
        setTimeout(() => {
          window.location.href = '/encargado';
        }, 1500);
      }else{
        console.error('Rol no reconocido:', rol);
        toast.error(`Rol no reconocido: ${rol}`);
      }
    } catch (error) {
      if (error.response) {
        // Error del servidor con respuesta
        const errorMessage = ErrorsUtility.getErrorMessage(error.response.data);
        toast.error(errorMessage);
      } else {
        // Error de red o inesperado
        console.error('Error al intentar iniciar sesión:', error);
        toast.error('Error interno del servidor. Por favor, inténtelo de nuevo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-auto bg-gradient-to-b from-white to-green-900 flex items-center justify-center relative py-6">
      {loading && <LoadingScreen />}

      <LoginForm 
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
      />
    </div>
  );
};

export default Login;
