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

interface ListaCuentasProps {
  onCuentaEliminada?: () => void;
}

export default function ListaCuentas({ onCuentaEliminada }: ListaCuentasProps) {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchCuentas();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta cuenta?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/accounts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al eliminar la cuenta');
      }

      // Quitar la cuenta eliminada del estado
      setCuentas((prev) => prev.filter((c) => c._id !== id));

      // Avisar al padre para refrescar también las cards
      if (onCuentaEliminada) onCuentaEliminada();
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      alert('❌ No se pudo eliminar la cuenta');
    }
  };

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
          <div className="account-header">
            <h3 className="account-title">
              Cuenta {cuenta.type} Nº {cuenta.number}
            </h3>
            <span className="account-badge" style={getBadgeStyle(cuenta.type)}>
              {cuenta.type}
            </span>
          </div>

          <p className="account-subtitle">{cuenta.bankName || 'Banco no especificado'}</p>

          <p
            className="account-balance"
            style={{
              color: cuenta.type === 'Crédito' ? 'var(--color-tertiary)' : 'var(--color-secondary)',
            }}
          >
            ${cuenta.balance.toLocaleString()} {cuenta.currency}
          </p>

          <div className="account-actions">
            <button className="btn-secondary">Editar</button>
            <button className="btn-danger" onClick={() => handleDelete(cuenta._id)}>
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
