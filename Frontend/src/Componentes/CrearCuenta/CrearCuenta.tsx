import { useState } from 'react';
import './CrearCuenta.css';

interface CrearCuentaProps {
  onCuentaCreada?: () => void;
}

export default function CrearCuenta({ onCuentaCreada }: CrearCuentaProps) {
  const [formData, setFormData] = useState({
    bankName: '',
    type: 'Corriente',
    currency: 'CLP',
    balance: '', // 👈 agregado
    creditLimit: '',
    availableCredit: '',
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:3000/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: formData.type,
          currency: formData.currency,
          number: Math.floor(10000000 + Math.random() * 90000000).toString(),
          balance: formData.type !== 'Crédito' ? Number(formData.balance) || 0 : 0,
          creditLimit: formData.type === 'Crédito' ? Number(formData.creditLimit) : undefined,
          availableCredit:
            formData.type === 'Crédito'
              ? Number(formData.availableCredit) || Number(formData.creditLimit)
              : undefined,
          bankName: formData.bankName,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear la cuenta');
      }

      const data = await res.json();
      setMensaje('✅ Cuenta creada con éxito');
      console.log('Cuenta creada:', data);

      if (onCuentaCreada) onCuentaCreada();

      setFormData({
        bankName: '',
        type: 'Corriente',
        currency: 'CLP',
        balance: '',
        creditLimit: '',
        availableCredit: '',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMensaje('❌ ' + error.message);
      } else {
        setMensaje('❌ Error inesperado');
      }
    }
  };

  return (
    <div className="formulario-crear-cuenta">
      <h3>Crear Nueva Cuenta</h3>
      <form onSubmit={handleSubmit}>
        {/* Banco */}
        <div className="campo">
          <label>Banco</label>
          <input
            type="text"
            name="bankName"
            placeholder="Ej: Banco de Chile"
            value={formData.bankName}
            onChange={handleChange}
          />
        </div>

        {/* Tipo y moneda */}
        <div className="fila">
          <div className="campo">
            <label>Tipo de Cuenta</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Corriente">Corriente</option>
              <option value="Ahorros">Ahorros</option>
              <option value="Crédito">Crédito</option>
              <option value="Inversión">Inversión</option>
            </select>
          </div>

          <div className="campo">
            <label>Moneda</label>
            <select name="currency" value={formData.currency} onChange={handleChange}>
              <option value="CLP">CLP (Pesos Chilenos)</option>
              <option value="USD">USD (Dólares)</option>
            </select>
          </div>
        </div>

        {/* Saldo inicial solo si no es crédito */}
        {formData.type !== 'Crédito' && (
          <div className="campo">
            <label>Saldo Inicial</label>
            <input type="number" name="balance" value={formData.balance} onChange={handleChange} />
          </div>
        )}

        {/* Datos solo si es crédito */}
        {formData.type === 'Crédito' && (
          <div className="fila">
            <div className="campo">
              <label>Límite de Crédito</label>
              <input
                type="number"
                name="creditLimit"
                value={formData.creditLimit}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="acciones">
          <button type="submit" className="btn-primario">
            Crear Cuenta
          </button>
          <button type="button" className="btn-secundario">
            Cancelar
          </button>
        </div>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
}
