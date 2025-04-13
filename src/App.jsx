//import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Contextos


// Componentes Home
import Home from './ui/Home';

import AR from './components/ui/AR/ARProyect';

// UIS AUTH
import ErrorPage from './components/ErrorPage';
import ErrorPage401 from './components/ErrorPage401';
import Login from './ui/Auth/Login';

// UIS Cliente
import Cliente from './ui/Cliente/Inicio/Cliente';
import ProyectosCliente from './ui/Cliente/Proyecto/Proyectos';
import ProyectoCliente from './ui/Cliente/Proyecto/Proyecto';

//UI Chat
import ChatWindows from './components/ui/Chat/ChatWindows'; 

// UIS Encargado
import Encargado from './ui/Encargado/Inicio/Encargado';
import ProyectosEncargado from './ui/Encargado/Proyecto/Proyectos';
import ProyectoEncargado from './ui/Encargado/Proyecto/Proyecto';


// Utilities
import ProtectedRouteHome from './utilities/ProtectedRouteHome';
import ProtectedRouteCliente from './utilities/ProtectedRouteCliente';
import ProtectedRouteManager from './utilities/ProtectedRouteManager';

//import ProtectedRouteToken from './utilities/ProtectedRouteToken';


function AppContent() {

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<ProtectedRouteHome element={<Home />} />} />

      <Route path="/login"  element={<ProtectedRouteHome element={<Login />}  />} />

      {/* Rutas cliente */}
      
      <Route path="/cliente" element={<ProtectedRouteCliente element={<Cliente />} />} />
      <Route path="/cliente/proyectos" element={<ProtectedRouteCliente element={<ProyectosCliente />} />} />
      <Route path="/cliente/proyecto/:id" element={<ProtectedRouteCliente element={<ProyectoCliente />} />} />
      <Route path="/cliente/proyecto/ar/:id"  element={<ProtectedRouteCliente element={<AR />} />} />
      <Route path="/cliente/proyecto/chat/:id"  element={<ChatWindows />} />

      {/* Rutas Managaer / encargado */}
      
      <Route path="/encargado"  element={<ProtectedRouteManager element={<Encargado />}  />} />
      <Route path="/encargado/proyectos"  element={<ProtectedRouteManager element={<ProyectosEncargado />} />} />
      <Route path="/encargado/proyecto/:id"   element={<ProtectedRouteManager element={<ProyectoEncargado />}  />} />
      <Route path="/encargado/proyecto/ar/:id"    element={<ProtectedRouteManager element={<AR />} />} />
      <Route path="/encargado/proyecto/chat/:id"   element={<ProtectedRouteManager element={<ChatWindows />} />} />

      {/* Ruta de error */}
      <Route path="/*" element={<ErrorPage />} />
      <Route path="/401" element={<ErrorPage401 />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      {/* ToastContainer global */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;