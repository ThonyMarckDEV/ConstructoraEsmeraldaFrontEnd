// jwtUtils.jsx
import API_BASE_URL from '../js/urlHelper';
import { jwtDecode } from "jwt-decode";



// Función para obtener si el correo está verificado
export const getEmailVerified = (refresh_token) => {
  const decodedToken = jwtDecode(refresh_token);
  
  // Imprimir el valor de emailVerified
  if (decodedToken) {
   // console.log("emailVerified:", decodedToken.emailVerified);
  }

  // Devolver el valor tal cual está en el token
  return decodedToken ? decodedToken.emailVerified : 0; // Devuelve 0 si no está definido
};

// Otras funciones (como getPerfil, getIdUsuario, etc.)
export const getPerfil = (refresh_token) => {
  const decodedToken = jwtDecode(refresh_token);
  return decodedToken?.profilePictureUrl ? `${decodedToken.profilePictureUrl}` : '';
};

// Función para obtener el ID del usuario
//export const getIdUsuario = (token) => decodeToken(token)?.idUsuario ?? null;

export const getClaims = (refresh_token) => {
  try {
    return jwtDecode(refresh_token) ?? null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Función para obtener el username de usuario
//export const getUsername = (token) => decodeToken(token)?.sub ?? null;

export const getUsername = (refresh_token) => jwtDecode(refresh_token)?.username ?? null;

// Función para obtener el nombre de usuario
export const getFullName = (refresh_token) => jwtDecode(refresh_token)?.fullName ?? null;

// Función para obtener el rol del usuario
export const getUserRole = (refresh_token) => jwtDecode(refresh_token)?.rol ?? null;

// Función para obtener el rol del usuario
export const getEmail= (refresh_token) => jwtDecode(refresh_token)?.email ?? null;

// // Función para verificar si el token está expirado
export const isTokenExpired = (refresh_token) => {
  const decodedToken = jwtDecode(refresh_token);
  if (decodedToken?.exp) {
    const currentTime = Date.now() / 1000; // Tiempo actual en segundos
    return decodedToken.exp < currentTime;
  }
  return true; // Si no hay exp, considera el token como expirado
};


// Función para obtener la fecha de expiración
export const getTokenExpirationDate = (refresh_token) => {
  const exp = jwtDecode(refresh_token)?.exp;
  return exp ? new Date(exp * 1000) : null;
};

// Función para verificar el token de manera general
export const verifyToken = (refresh_token) => {
  if (!refresh_token) {
    return { valid: false, message: "Token no proporcionado" };
  }
  
  if (isTokenExpired(refresh_token)) {
    return { valid: false, message: "Token expirado" };
  }
  
  return { valid: true, message: "Token válido" };
};

// Función para obtener el valor de una cookie por su nombre
const getCookie = (name) => {
  const cookieString = document.cookie;
  const cookies = cookieString.split(';').map(cookie => cookie.trim());

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue); // Decodifica el valor de la cookie
    }
  }

  return null; // Si no se encuentra la cookie, devuelve null
};

// // Función para obtener el token JWT de la cookie
export const getAccessTokenFromCookie = () => {
  const access_token = 'access_token'; // Nombre de la cookie donde se almacena el token
  return getCookie(access_token);
};

// // Función para obtener el token JWT de la cookie
export const getRefreshTokenFromCookie = () => {
  const refresh_token = 'refresh_token'; // Nombre de la cookie donde se almacena el token
  return getCookie(refresh_token);
};


export const removeTokensFromCookie = () => {
  // Elimina el token de la cookie
  document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};


// New function to get the created at date
export const getCreatedAt = (refresh_token) => {
  try {
    const decodedToken = jwtDecode(refresh_token);
    return decodedToken?.createdAt 
      ? new Date(decodedToken.createdAt).toLocaleDateString('es', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) 
      : "Usuario desde 2023";
  } catch (error) {
    console.error("Error decoding token for createdAt:", error);
    return "Usuario desde 2023";
  }
};

export const setAccessTokenInCookie = (accessToken) => {
  if (!accessToken) return;

  // Configurar opciones de cookies según "Recordarme"
  const cookieOptions = '; Path=/; Secure; SameSite=Strict'; // 5 minutos

  // Establecer la cookie con el token
  document.cookie = `access_token=${accessToken}${cookieOptions}`;
};


export default {
  getEmailVerified,
  getPerfil,
  getUsername,
  getFullName,
  getUserRole,
  isTokenExpired,
  getTokenExpirationDate,
  verifyToken,
  removeTokensFromCookie,
  getEmail,
  getCreatedAt,
  getAccessTokenFromCookie,
  getRefreshTokenFromCookie,
  setAccessTokenInCookie
};
