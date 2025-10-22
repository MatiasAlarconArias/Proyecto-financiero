import React, { useEffect, useState } from 'react';
import './Transaction.css';
import NavBar from '../Componentes/navBar/navBar';
import CrearTransaccion from './../Componentes/CrearTransaccion/CrearTransaccion';

export default function Transaction() {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async (
      url: string,
      setFn: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
      try {
        const res = await fetch(url, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const items = data
              .map((item) => item.name || item.bankName || item.type)
              .filter(Boolean);
            setFn(items);
          } else {
            setFn([]);
          }
        } else {
          setFn([]);
        }
      } catch (err) {
        console.error('Error cargando datos:', err);
        setFn([]);
      }
    };

    fetchData('/api/accounts', setAccounts);
    fetchData('/api/categories', setCategories);
  }, []);

  return (
    <>
      <NavBar />

      <main className="transactions-page">
        <div className="page-top">
          <h2 className="title">Transacciones</h2>
          <button className="btn-new" onClick={() => setMostrarFormulario((prev) => !prev)}>
            {mostrarFormulario ? 'Cancelar' : '+ Nueva Transacción'}
          </button>
        </div>

        {/* ✅ Formulario debajo del título */}
        {mostrarFormulario && (
          <div className="form-container">
            <CrearTransaccion
              onClose={() => setMostrarFormulario(false)}
              categories={categories}
              accounts={accounts}
            />
          </div>
        )}

        {/* 🔍 Barra de búsqueda y filtros */}
        <div className="filters-bar">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar transacciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select className="filter-select">
            <option value="">Todas las cuentas</option>
            {accounts.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <select className="filter-select">
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </main>
    </>
  );
}
