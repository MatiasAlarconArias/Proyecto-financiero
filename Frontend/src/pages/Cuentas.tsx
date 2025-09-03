import { useState } from 'react';
import NavBar from '../Componentes/navBar/navBar';
import CartsCuentas from '../Componentes/Carts/Cuentas/CartsCuentas';
import CrearCuenta from '../Componentes/CrearCuenta/CrearCuenta';

export default function Cuentas() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  return (
    <>
      <div>
        <NavBar />
      </div>
      <section>
        <div className="Container">
          <CartsCuentas />
        </div>
      </section>
      <section className="Container Crear-cuenta">
        <button onClick={toggleFormulario}>{mostrarFormulario ? 'Cerrar' : 'Crear Cuenta'}</button>
        {mostrarFormulario && <CrearCuenta />}
      </section>
    </>
  );
}
