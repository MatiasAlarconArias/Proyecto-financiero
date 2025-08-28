import NavBar from '../Componentes/navBar/navBar';
import Carts from '../Componentes/Carts/Carts';
import OpcionesRapidas from '../Componentes/OpcionesRapidas/OpcionesRapidas';

export default function Dashboard() {
  return (
    <>
      <div>
        <NavBar />
      </div>
      <section>
        <div className="Container">
          <Carts />
        </div>
      </section>
      <section>
        <OpcionesRapidas />
      </section>
    </>
  );
}
