import './navBar.css';
import './../../Globals/Styles.css';

export default function NavBar() {
  return (
    <>
      <div className="Header">
        <div className="Container">
          <div className="header_opciones">
            <div className="Header-content">
              <ul>
                <li>
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li>
                  <a href="/dashboard">Cuentas</a>
                </li>
                <li>
                  <a href="/dashboard">Transacciones</a>
                </li>
                <li>
                  <a href="/dashboard">Presupuesto</a>
                </li>
                <li>
                  <a href="/dashboard">Metas</a>
                </li>
                <li>
                  <a href="/dashboard">Categoria</a>
                </li>
                <li>
                  <a href="/">Cerrar Sesion</a>
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
    </>
  );
}
