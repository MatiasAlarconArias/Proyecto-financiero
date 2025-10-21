import React, { useState } from 'react';
import './CrearTransaccion.css';

interface Props {
  onClose: () => void;
  categories: string[];
  accounts: string[];
}

export default function CrearTransaccion({ onClose, categories, accounts }: Props) {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState(0);
  const [tipo, setTipo] = useState('Gasto');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [categoria, setCategoria] = useState('');
  const [cuenta, setCuenta] = useState('');

  const handleAgregar = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ descripcion, monto, tipo, fecha, categoria, cuenta });
    onClose();
  };

  return (
    <section className="form-card">
      <h3>Agregar Nueva Transacción</h3>

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
            <input type="number" value={monto} onChange={(e) => setMonto(Number(e.target.value))} />
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
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="">Seleccionar categoría</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Cuenta</label>
            <select value={cuenta} onChange={(e) => setCuenta(e.target.value)}>
              <option value="">Seleccionar cuenta</option>
              {accounts.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            Agregar
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
