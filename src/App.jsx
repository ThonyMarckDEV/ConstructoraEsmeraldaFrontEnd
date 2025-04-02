//import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './index.css';

//Contextos


// Componentes Home
import Home from './ui/Home';

// UIS AUTH
import ErrorPage from './components/ErrorPage';
import ErrorPage401 from './components/ErrorPage401';
import Login from './ui/Auth/Login';

// UIS Cliente
import Cliente from './ui/Cliente/Cliente';


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

      {/* Rutas cliente */}
      
      <Route path="/cliente" element={<ProtectedRouteCliente element={<Cliente />} />} />
      
      
    
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