import NavBar from '../Componentes/navBar/navBar';
import CartsDashboard from '../Componentes/Carts/Dashboard/CartsDashboard';
import DashboardCharts from '../Componentes/Carts/Dashboard/DashboardCharts';
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
          <DashboardCharts />
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
