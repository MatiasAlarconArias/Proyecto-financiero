import { Link } from 'react-router-dom';
import './FormLogin.css';

export default function FormRegister() {
  return (
    <div className="Login-wrapper">
      <div className="Container-form">
        <form>
          <h1>Aplicacion financiera</h1>
          <hr />
          <h2>Regístrate</h2>

          <div className="container-input">
            <span>Nombre</span>
            <input type="text" placeholder="Tu nombre" required />
          </div>

          <div className="container-input">
            <span>Apellido</span>
            <input type="text" placeholder="Tu apellido" required />
          </div>

          <div className="container-input">
            <span>Correo</span>
            <input type="email" placeholder="ejemplo@correo.com" required />
          </div>

          <div className="container-input">
            <span>Contraseña</span>
            <input type="password" placeholder="Contraseña" required />
          </div>

          <div className="container-input">
            <span>Teléfono (opcional)</span>
            <input type="text" placeholder="+56 9 1234 5678" />
          </div>

          <button type="submit">Crear Cuenta</button>
          <p>
            ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
