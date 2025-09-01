import NavBar from '../Componentes/navBar/navBar';
import CartsCuentas from '../Componentes/Carts/Cuentas/CartsCuentas';

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
    </>
  );
}
