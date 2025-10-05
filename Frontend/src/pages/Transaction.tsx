import React, { useEffect, useState } from 'react';
import './Transaction.css';
import NavBar from '../Componentes/navBar/navBar';

export default function Transaction() {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async (
      url: string,
      setFn: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
      try {
        const res = await fetch(url, {
          credentials: 'include',
        });
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
          <button className="btn-new">+ Nueva Transacción</button>
        </div>

        <section className="controls-card">
          <div className="search">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Buscar transacciones..." />
          </div>

          <div className="filters">
            {accounts.length > 0 && (
              <select className="select moderno" aria-label="Filtrar por cuenta">
                <option value="">Todas las cuentas</option>
                {accounts.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            )}

            {categories.length > 0 && (
              <select className="select moderno" aria-label="Filtrar por categoría">
                <option value="">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
