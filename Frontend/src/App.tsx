import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormLogin from './Componentes/Formularios/FormLogin';
import './Globals/Styles.css';
import PrivateRoute from './Componentes/auth/PrivateRoute';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<FormLogin />} />
        </Routes>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <FormLogin />
            </PrivateRoute>
          }
        />
      </div>
    </Router>
  );
}

export default App;
