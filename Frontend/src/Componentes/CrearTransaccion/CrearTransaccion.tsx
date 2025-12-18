import React, { useState } from 'react';
import './CrearTransaccion.css';
import type { AccountItem, CategoryItem } from '../../pages/Transaction';

interface Props {
  onClose: () => void;
  categories: CategoryItem[];
  accounts: AccountItem[];
  onTransactionAdded: () => void;
}

export default function CrearTransaccion({ onClose, categories, accounts, onTransactionAdded }: Props) {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('Gasto');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!descripcion || !monto || !categoryId || !accountId) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    // Validación de saldo/crédito
    const selectedAccount = accounts.find(acc => acc._id === accountId);
    if (selectedAccount && tipo === 'Gasto') {
      const amountValue = parseFloat(monto);
      
      if (selectedAccount.type === 'Crédito') {
        const available = selectedAccount.availableCredit || 0;
        if (amountValue > available) {
          setError(`El monto excede el crédito disponible (${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(available)})`);
          return;
        }
      } else {
        // Cuentas de débito/ahorro/etc
        const balance = selectedAccount.balance || 0;
        if (amountValue > balance) {
          setError(`El monto excede el saldo disponible (${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(balance)})`);
          return;
        }
      }
    }

    setLoading(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: descripcion,
          amount: parseFloat(monto),
          type: tipo,
          date: fecha,
          categoryId: categoryId,
          accountId: accountId
        }),
        credentials: 'include'
      });

      if (res.ok) {
        onTransactionAdded();
        onClose();
      } else {
        const data = await res.json();
        setError(data.message || 'Error al guardar la transacción');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-card">
      <h3>Agregar Nueva Transacción</h3>

      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleAgregar}>
        <div className="form-row">
          <div className="form-group">
            <label>Descripción</label>
            <input
              type="text"
              placeholder="Descripción de la transacción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Monto</label>
            <input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="Gasto">Gasto</option>
              <option value="Ingreso">Ingreso</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fecha</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Seleccionar categoría</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Cuenta</label>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              <option value="">Seleccionar cuenta</option>
              {accounts.map((a) => (
                <option key={a._id} value={a._id}>{a.bankName || a.type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Agregar'}
          </button>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
