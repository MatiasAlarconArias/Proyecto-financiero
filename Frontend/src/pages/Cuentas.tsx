import NavBar from '../Componentes/navBar/navBar';
import CartsCuentas from '../Componentes/Carts/Cuentas/CartsCuentas';
import CrearCuenta from '../Componentes/CrearCuenta/CrearCuenta';

export default function Cuentas() {
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
      <section className="Container">
        <button>Crear Cuenta</button>
        <CrearCuenta />
      </section>
    </>
  );
}
