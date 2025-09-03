import { useState } from 'react';
import './Cuentas.css';
import NavBar from '../Componentes/navBar/navBar';
import CartsCuentas from '../Componentes/Carts/Cuentas/CartsCuentas';
import CrearCuenta from '../Componentes/CrearCuenta/CrearCuenta';
import ListaCuentas from '../Componentes/Cuenta/ListaCuentas';

export default function Cuentas() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // 👈 clave para forzar refetch

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleCuentaCreada = () => {
    setRefreshKey((prev) => prev + 1); // 👈 cada vez que se crea, recarga lista y cards
    setMostrarFormulario(false); // 👈 opcional: cerrar formulario después de crear
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
        <ListaCuentas key={refreshKey} />
      </section>
    </>
  );
}
