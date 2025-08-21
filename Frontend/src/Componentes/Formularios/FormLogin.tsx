import { Link } from 'react-router-dom';
import './FormLogin.css';

export default function FormLogin() {
  return (
    <div className="Login-wrapper">
      <div className="Container-form">
        <form>
          <h1>Aplicacion financiera</h1>
          <hr />
          <h2>Inicia sesion</h2>
          <div className="container-input">
            <span>Correo</span>
            <input type="text" placeholder="Correo" />
          </div>
          <div className="container-input">
            <span>Contraseña</span>
            <input type="password" placeholder="Contraseña" />
          </div>
          <button type="submit">Iniciar Sesión</button>
          <p>
            ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
