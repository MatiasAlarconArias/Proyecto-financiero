import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';
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
          <span className="card-title">Saldo Total</span>
          <DollarSign size={20} className="card-icon" />
        </div>
        <p className="card-value">${totalBalance.toLocaleString()}</p>
        <p className="card-subtitle">Todas las cuentas</p>
      </div>

      {/* Ingresos del mes */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Ingresos del Mes</span>
          <TrendingUp size={20} color="#10b981" />
        </div>
        <p className="card-value green-text" style={{ color: '#10b981' }}>$5.700</p>
        <div className="card-subtitle">
          <span className="percentage-up">+8.2%</span> <span style={{ marginLeft: '4px' }}>vs mes anterior</span>
        </div>
      </div>

      {/* Gastos del mes */}
      <div className="card">
        <div className="card-header">
            <span className="card-title">Gastos del Mes</span>
            <TrendingDown size={20} color="#ef4444" />
        </div>
        <p className="card-value red-text" style={{ color: '#ef4444' }}>$4.100</p>
        <div className="card-subtitle">
            <span className="percentage-down">-3.1%</span> <span style={{ marginLeft: '4px' }}>vs mes anterior</span>
        </div>
      </div>

      {/* Meta de ahorro */}
      <div className="card">
        <div className="card-header">
            <span className="card-title">Meta de Ahorro</span>
            <Target size={20} color="#3b82f6" />
        </div>
        <div className="progress-info">
            <p className="progress-percentage">75%</p>
            <p className="progress-text">$3,750 de $5,000</p>
        </div>
        {/* Simple Progress Bar */}
        <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', marginTop: '10px' }}>
            <div style={{ width: '75%', height: '100%', backgroundColor: '#2563eb', borderRadius: '3px' }}></div>
        </div>
      </div>
    </div>
  );
}
