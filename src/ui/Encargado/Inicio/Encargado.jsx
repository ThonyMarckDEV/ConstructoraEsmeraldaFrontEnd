import Sidebar from '../../../components/ui/Sidebar';
import Header from '../../../components/Header';
import Charts from '../../../components/ui/Encargado/Inicio/Charts';
import { ResponsiveContainer } from 'recharts';

const Encargado = () => {
    
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar username="Cliente" />
      
      {/* Contenido principal con margen izquierdo para compensar la sidebar fija */}
      <div className="flex-1 p-9 md:ml-84">

        <Header 
          title="Dashboard" 
          description="Bienvenido a tu panel de control." 
        />
        
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <Charts />
          </ResponsiveContainer>
        </div>

 
      </div>

    </div>
  );
};

export default Encargado;