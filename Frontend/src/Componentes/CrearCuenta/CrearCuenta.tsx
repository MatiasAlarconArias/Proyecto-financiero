import { useState } from 'react';
import './CrearCuenta.css';

export default function CrearCuenta() {
  const [formData, setFormData] = useState({
    bank: '',
    type: 'Corriente',
    currency: 'CLP',
    balance: 0,
    creditLimit: '',
    availableCredit: '',
    statementCloseDay: '',
    paymentDueDay: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Cuenta creada:', formData);
  };

  return (
    <div className="formulario-crear-cuenta">
      <h3>Crear Nueva Cuenta</h3>
      <form onSubmit={handleSubmit}>
        {/* 🔹 Banco */}
        <div className="campo">
          <label>Banco</label>
          <input
            type="text"
            name="bank"
            placeholder="Ej: Banco de Chile"
            value={formData.bank}
            onChange={handleChange}
          />
        </div>

        {/* 🔹 Tipo de cuenta y moneda */}
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

        {/* 🔹 Saldo si no es crédito */}
        {formData.type !== 'Crédito' && (
          <div className="campo">
            <label>Saldo Inicial</label>
            <input type="number" name="balance" value={formData.balance} onChange={handleChange} />
          </div>
        )}

        {/* 🔹 Datos adicionales si es crédito */}
        {formData.type === 'Crédito' && (
          <>
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
              <div className="campo">
                <label>Crédito Disponible</label>
                <input
                  type="number"
                  name="availableCredit"
                  value={formData.availableCredit}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="fila">
              <div className="campo">
                <label>Día de Cierre</label>
                <input
                  type="number"
                  min="1"
                  max="28"
                  name="statementCloseDay"
                  value={formData.statementCloseDay}
                  onChange={handleChange}
                />
              </div>
              <div className="campo">
                <label>Día de Pago</label>
                <input
                  type="number"
                  min="1"
                  max="28"
                  name="paymentDueDay"
                  value={formData.paymentDueDay}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}

        {/* 🔹 Botones */}
        <div className="acciones">
          <button type="submit" className="btn-primario">
            Crear Cuenta
          </button>
          <button type="button" className="btn-secundario">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
