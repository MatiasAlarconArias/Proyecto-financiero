import { useEffect, useState } from 'react';
import './ListaCuentas.css';

interface Cuenta {
  _id: string;
  type: 'Corriente' | 'Ahorros' | 'Crédito' | 'Inversión';
  currency: string;
  number: string;
  balance: number;
  bankName?: string;
}

export default function ListaCuentas() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/accounts', {
          credentials: 'include',
        });
        const data = await res.json();
        setCuentas(data);
      } catch (error) {
        console.error('Error al obtener cuentas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCuentas();
  }, []);

  if (loading) return <p>Cargando cuentas...</p>;
  if (cuentas.length === 0) return <p>No tienes cuentas registradas.</p>;

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'Corriente':
        return { backgroundColor: 'var(--color-primary)', color: '#fff' };
      case 'Ahorros':
        return { backgroundColor: 'var(--color-secondary)', color: '#fff' };
      case 'Crédito':
        return { backgroundColor: 'var(--color-tertiary)', color: '#fff' };
      case 'Inversión':
        return { backgroundColor: 'var(--color-accent-purple)', color: '#fff' };
      default:
        return { backgroundColor: 'var(--color-neutral-gray)', color: '#333' };
    }
  };

  return (
    <div className="cards-grid">
      {cuentas.map((cuenta) => (
        <div key={cuenta._id} className="account-card">
          {/* Cabecera */}
          <div className="account-header">
            <h3 className="account-title">
              Cuenta {cuenta.type} Nº {cuenta.number}
            </h3>
            <span className="account-badge" style={getBadgeStyle(cuenta.type)}>
              {cuenta.type}
            </span>
          </div>

          {/* Banco */}
          <p className="account-subtitle">{cuenta.bankName || 'Banco no especificado'}</p>

          {/* Saldo */}
          <p
            className="account-balance"
            style={{
              color: cuenta.type === 'Crédito' ? 'var(--color-tertiary)' : 'var(--color-secondary)',
            }}
          >
            ${cuenta.balance.toLocaleString()} {cuenta.currency}
          </p>

          {/* Botones */}
          <div className="account-actions">
            <button className="btn-secondary">Editar</button>
            <button className="btn-danger">Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
