import './navBar.css';
import './../../Globals/Styles.css';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // evitar que el <a> recargue la página

    try {
      // 🔹 Llamar al backend para borrar la cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // 🔹 Limpiar localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // 🔹 Redirigir al login
      navigate('/');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      alert('No se pudo cerrar sesión ❌');
    }
  };

  return (
    <div className="Header">
      <div className="Container">
        <div className="header_opciones">
          <div className="Header-content">
            <ul>
              <li>
                <a href="/dashboard">Dashboard</a>
              </li>
              <li>
                <a href="/cuentas">Cuentas</a>
              </li>
              <li>
                <a href="/transaction">Transacciones</a>
              </li>
              <li>
                <a href="/presupuesto">Presupuesto</a>
              </li>
              <li>
                <a href="/dashboard">Metas</a>
              </li>
              <li>
                <a href="/categoria">Categoria</a>
              </li>
              <li>
                {/* 🔹 Link que actúa como logout */}
                <a href="/" onClick={handleLogout}>
                  Cerrar Sesión
                </a>
              </li>
            </ul>
            <div className="Notificaciones"></div>
          </div>
          <div className="Notificaciones">
            <img src="./noti.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
