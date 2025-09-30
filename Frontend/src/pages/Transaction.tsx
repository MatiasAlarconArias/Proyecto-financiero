import './Transaction.css';
import NavBar from '../Componentes/navBar/navBar';

export default function Transaction() {
  return (
    <>
      <NavBar />

      <div className="Container">
        <div className="">
          <h2 className="Titulo-transaction">Transacciones</h2>
          <button> + Nueva Transaccion</button>
        </div>
      </div>
    </>
  );
}
