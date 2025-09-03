import { useState } from 'react';
import './Cuentas.css';
import NavBar from '../Componentes/navBar/navBar';
import CartsCuentas from '../Componentes/Carts/Cuentas/CartsCuentas';
import CrearCuenta from '../Componentes/CrearCuenta/CrearCuenta';
import ListaCuentas from '../Componentes/Cuenta/ListaCuentas';

export default function Cuentas() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleCuentaCreada = () => {
    setRefreshKey((prev) => prev + 1);
    setMostrarFormulario(false);
  };

  const handleCuentaEliminada = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <NavBar />

      <section>
        <div className="Container">
          <CartsCuentas key={refreshKey} />
        </div>
      </section>

      <section className="Container Crear-cuenta">
        <button onClick={toggleFormulario}>
          {mostrarFormulario ? 'Cerrar' : '+ Agregar Cuenta'}
        </button>
        {mostrarFormulario && <CrearCuenta onCuentaCreada={handleCuentaCreada} />}
      </section>

      <section className="Container">
        <ListaCuentas key={refreshKey} onCuentaEliminada={handleCuentaEliminada} />
      </section>
    </>
  );
}
