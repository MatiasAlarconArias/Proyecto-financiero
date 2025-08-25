import './Carts.css';

export default function Carts() {
  return (
    <div className="cards-container">
      {/* Saldo total */}
      <div className="card card-total">
        <div className="card-header">
          <h4>Saldo Total</h4>
        </div>
        <p className="card-value">$28.750,5</p>
        <p className="card-subtitle">Todas las cuentas</p>
      </div>

      {/* Ingresos */}
      <div className="card card-ingresos">
        <div className="card-header">
          <h4>Ingresos del Mes</h4>
        </div>
        <p className="card-value green">$5.700</p>
        <p className="card-subtitle">+8.2% vs mes anterior</p>
      </div>

      {/* Gastos */}
      <div className="card card-gastos">
        <div className="card-header">
          <h4>Gastos del Mes</h4>
        </div>
        <p className="card-value red">$4.100</p>
        <p className="card-subtitle">-3.1% vs mes anterior</p>
      </div>

      {/* Meta ahorro */}
      <div className="card card-ahorro">
        <div className="card-header">
          <h4>Meta de Ahorro</h4>
        </div>
        <p className="card-value blue">75%</p>
        <p className="card-subtitle">$3.750 de $5.000</p>
      </div>
    </div>
  );
}
