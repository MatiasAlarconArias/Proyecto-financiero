import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormLogin from './Componentes/Formularios/FormLogin';
import FormRegister from './Componentes/Formularios/FormRegister'; // 👈 importar
import PrivateRoute from './Componentes/auth/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Cuentas from './pages/Cuentas';
import Transaction from './pages/Transaction';
import Presupuesto from './pages/Presupuesto';
import Categoria from './pages/Categoria';
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
        <Route
          path="/cuentas"
          element={
            <PrivateRoute>
              <Cuentas />
            </PrivateRoute>
          }
        />
        <Route
          path="/transaction"
          element={
            <PrivateRoute>
              <Transaction />
            </PrivateRoute>
          }
        />
        <Route
          path="/presupuesto"
          element={
            <PrivateRoute>
              <Presupuesto />
            </PrivateRoute>
          }
        />
        <Route
          path="/categoria"
          element={
            <PrivateRoute>
              <Categoria />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;
