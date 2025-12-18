import React, { useEffect, useState } from 'react';
import './Transaction.css';
import NavBar from '../Componentes/navBar/navBar';
import CrearTransaccion from './../Componentes/CrearTransaccion/CrearTransaccion';

export interface AccountItem {
  _id: string;
  bankName: string;
  type: string;
  balance: number;
  creditLimit?: number;
  availableCredit?: number;
}

export interface CategoryItem {
  _id: string;
  name: string;
  type: string;
}

interface TransactionItem {
  _id: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  categoryId: CategoryItem; // Populated by backend
  accountId: string;        // ID from backend (not populated)
}

export default function Transaction() {
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAccountId, setFilterAccountId] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState('');

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch('/api/accounts', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setAccounts(data);
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchAccounts();
    fetchCategories();
    fetchTransactions();
  }, []);

  const getAccountName = (id: string) => {
    const acc = accounts.find((a) => a._id === id);
    return acc ? acc.bankName || acc.type : 'Cuenta desconocida';
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccount = filterAccountId === '' || t.accountId === filterAccountId;
    const matchesCategory = filterCategoryId === '' || (t.categoryId && t.categoryId._id === filterCategoryId);
    return matchesSearch && matchesAccount && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

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
              onTransactionAdded={fetchTransactions}
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

          <select 
            className="filter-select"
            value={filterAccountId}
            onChange={(e) => setFilterAccountId(e.target.value)}
          >
            <option value="">Todas las cuentas</option>
            {accounts.map((a) => (
              <option key={a._id}>{a.bankName || a.type}</option>
            ))}
          </select>

          <select 
            className="filter-select"
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Cuenta</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <tr key={t._id}>
                    <td>{formatDate(t.date)}</td>
                    <td>
                      <div className="description-cell">
                        <span className={`icon-type ${t.type === 'Gasto' ? 'expense' : 'income'}`}>
                          {t.type === 'Gasto' ? '↓' : '↑'}
                        </span>
                        {t.description}
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">
                        {t.categoryId ? t.categoryId.name : 'Sin categoría'}
                      </span>
                    </td>
                    <td className="account-text">{getAccountName(t.accountId)}</td>
                    <td className={`amount-cell ${t.type === 'Gasto' ? 'expense' : 'income'}`}>
                      {t.type === 'Gasto' ? '-' : '+'}{formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="no-data">No hay transacciones encontradas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
