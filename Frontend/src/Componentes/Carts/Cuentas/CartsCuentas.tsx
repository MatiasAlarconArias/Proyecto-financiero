import { useEffect, useState } from 'react';
import './../Dashboard/CartsDashboard.css';

export default function CartsCuentas() {
  const [activos, setActivos] = useState<number>(0);
  const [deudas, setDeudas] = useState<number>(0);
  const [patrimonio, setPatrimonio] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Activos Totales
        const resActivos = await fetch('http://localhost:3000/api/accounts/totals/non-credit', {
          credentials: 'include',
        });
        const dataActivos = await resActivos.json();
        setActivos(dataActivos.totalBalance ?? 0);

        // Deudas Totales
        const resDeudas = await fetch('http://localhost:3000/api/accounts/totals/credit', {
          credentials: 'include',
        });
        const dataDeudas = await resDeudas.json();
        setDeudas(dataDeudas.totalDebt ?? 0);

        // Patrimonio Neto
        const resPatrimonio = await fetch('http://localhost:3000/api/accounts/totals/net-worth', {
          credentials: 'include',
        });
        const dataPatrimonio = await resPatrimonio.json();
        setPatrimonio(dataPatrimonio.patrimonioNeto ?? 0);
      } catch (error) {
        console.error('Error al obtener datos de cuentas:', error);
        setActivos(0);
        setDeudas(0);
        setPatrimonio(0);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="cards-container">
      {/* Activos Totales */}
      <div className="card">
        <div className="card-header">
          <h4>Activos Totales</h4>
        </div>
        <p className="card-value green">${activos.toLocaleString()}</p>
        <p className="card-subtitle">Cuentas Corriente, Ahorro e Inversión</p>
      </div>

      {/* Deudas Totales */}
      <div className="card">
        <div className="card-header">
          <h4>Deudas Totales</h4>
        </div>
        <p className="card-value red">${deudas.toLocaleString()}</p>
        <p className="card-subtitle">Cuentas de Crédito</p>
      </div>

      {/* Patrimonio Neto */}
      <div className="card">
        <div className="card-header">
          <h4>Patrimonio Neto</h4>
        </div>
        <p className="card-value blue">${patrimonio.toLocaleString()}</p>
        <p className="card-subtitle">Activos - Deudas</p>
      </div>
    </div>
  );
}
