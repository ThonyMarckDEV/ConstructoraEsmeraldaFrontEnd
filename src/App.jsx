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
import Proyectos from './ui/Cliente/Proyectos';
import Proyecto from './ui/Cliente/Proyecto';


// Components


// Utilities
import ProtectedRouteHome from './utilities/ProtectedRouteHome';
import ProtectedRouteCliente from './utilities/ProtectedRouteCliente';
//import ProtectedRouteToken from './utilities/ProtectedRouteToken';

// Scripts
//import { updateLastActivity } from './js/lastActivity';


function AppContent() {

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<ProtectedRouteHome element={<Home />} />} />

      <Route path="/login"  element={<Login />} />

      <Route path="/cliente/proyecto/ar/:id"  element={<AR />} />

      {/* Rutas cliente */}
      
      <Route path="/cliente" element={<ProtectedRouteCliente element={<Cliente />} />} />
      <Route path="/cliente/proyectos" element={<ProtectedRouteCliente element={<Proyectos />} />} />
      <Route path="/cliente/proyecto/:id" element={<ProtectedRouteCliente element={<Proyecto />} />} />
    
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