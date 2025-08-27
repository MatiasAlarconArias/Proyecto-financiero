import NavBar from '../Componentes/navBar/navBar';
import Carts from '../Componentes/Carts/Carts';

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
    </>
  );
}
