//import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './index.css';

//Contextos


// Componentes Home
import Home from './ui/Home';

import AR from './components/ui/Cliente/Proyecto/ARProyect';

// UIS AUTH
import ErrorPage from './components/ErrorPage';
import ErrorPage401 from './components/ErrorPage401';
import Login from './ui/Auth/Login';

// UIS Cliente
import Cliente from './ui/Cliente/Cliente';
import ProyectosCliente from './ui/Cliente/Proyectos';
import Proyecto from './ui/Cliente/Proyecto';
import ChatWindows from './components/ui/Chat/ChatWindows';

// UIS Encargado
import Encargado from './ui/Encargado/Encargado';
import ProyectosEncargado from './ui/Encargado/Proyectos';

// Components


// Utilities
import ProtectedRouteHome from './utilities/ProtectedRouteHome';
import ProtectedRouteCliente from './utilities/ProtectedRouteCliente';

//import ProtectedRouteToken from './utilities/ProtectedRouteToken';


function AppContent() {

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<ProtectedRouteHome element={<Home />} />} />

      <Route path="/login"  element={<Login />} />



      {/* Rutas cliente */}
      
      <Route path="/cliente" element={<ProtectedRouteCliente element={<Cliente />} />} />
      <Route path="/cliente/proyectos" element={<ProtectedRouteCliente element={<ProyectosCliente />} />} />
      <Route path="/cliente/proyecto/:id" element={<ProtectedRouteCliente element={<Proyecto />} />} />
      <Route path="/cliente/proyecto/ar/:id"  element={<ProtectedRouteCliente element={<AR />} />} />
      <Route path="/cliente/proyecto/chat/:id"  element={<ChatWindows />} />

      {/* Rutas Managaer / encargado */}
      
      <Route path="/encargado"  element={<Encargado />} />
      <Route path="/encargado/proyectos" element={<ProyectosEncargado />} />
      <Route path="/encargado/proyecto/chat/:id"  element={<ChatWindows />} />


      {/* Ruta de error */}
      <Route path="/404" element={<ErrorPage />} />
      <Route path="/401" element={<ErrorPage401 />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;