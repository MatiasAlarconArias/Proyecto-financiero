import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormLogin from './Componentes/Formularios/FormLogin';
import FormRegister from './Componentes/Formularios/FormRegister'; // 👈 importar
import PrivateRoute from './Componentes/auth/PrivateRoute';
import Dashboard from './pages/Dashboard';
import './Globals/Styles.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<FormLogin />} />
        <Route path="/register" element={<FormRegister />} /> {/* 👈 nueva ruta */}
        {/* Ruta privada */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;
