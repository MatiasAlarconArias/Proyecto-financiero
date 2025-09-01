import NavBar from '../Componentes/navBar/navBar';
import CartsDashboard from '../Componentes/Carts/Dashboard/CartsDashboard';
import OpcionesRapidas from '../Componentes/OpcionesRapidas/OpcionesRapidas';

export default function Dashboard() {
  return (
    <>
      <div>
        <NavBar />
      </div>
      <section>
        <div className="Container">
          <CartsDashboard />
        </div>
      </section>
      <section>
        <div></div>
      </section>
      <section>
        <OpcionesRapidas />
      </section>
    </>
  );
}
