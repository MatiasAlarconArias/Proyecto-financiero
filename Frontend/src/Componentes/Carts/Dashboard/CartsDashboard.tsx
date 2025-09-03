import { useEffect, useState } from 'react';
import './CartsDashboard.css';

export default function CartsDashboard() {
  const [totalBalance, setTotalBalance] = useState<number>(0);

  useEffect(() => {
    const fetchTotalBalance = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/accounts/totals/all', {
          credentials: 'include',
        });
        const data = await res.json();
        setTotalBalance(data.totalBalance ?? 0);
      } catch (error) {
        console.error('Error al obtener saldo total:', error);
        setTotalBalance(0);
      }
    };

    fetchTotalBalance();
  }, []);

  return (
    <div className="cards-container">
      {/* Saldo total */}
      <div className="card card-total">
        <div className="card-header">
          <h4>Saldo Total</h4>
        </div>
        <p className="card-value">${totalBalance.toLocaleString()}</p>
        <p className="card-subtitle">Todas las cuentas</p>
      </div>

      {/* Ingresos del mes */}
      <div className="card">
        <div className="card-header">
          <h4>Ingresos del Mes</h4>
        </div>
        <p className="card-value green">$0</p>
        <p className="card-subtitle">+0% vs mes anterior</p>
      </div>

      {/* Gastos del mes */}
      <div className="card">
        <div className="card-header">
          <h4>Gastos del Mes</h4>
        </div>
        <p className="card-value red">$0</p>
        <p className="card-subtitle">-0% vs mes anterior</p>
      </div>

      {/* Meta de ahorro */}
      <div className="card">
        <div className="card-header">
          <h4>Meta de Ahorro</h4>
        </div>
        <p className="card-value blue">0%</p>
        <p className="card-subtitle">$0 de $0</p>
      </div>
    </div>
  );
}
