import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';
import './CartsDashboard.css';

export default function CartsDashboard() {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [income, setIncome] = useState<{ amount: number; percentage: number; trend: 'up' | 'down' }>({ amount: 0, percentage: 0, trend: 'up' });
  const [expenses, setExpenses] = useState<{ amount: number; percentage: number; trend: 'up' | 'down' }>({ amount: 0, percentage: 0, trend: 'down' });
  const [savings, setSavings] = useState<{ progress: number; current: number; target: number }>({ progress: 0, current: 0, target: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        
        const prevDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const prevYear = prevDate.getFullYear();
        const prevMonth = prevDate.getMonth() + 1;

        // 1. Fetch Total Balance
        const balanceRes = await fetch('http://localhost:3000/api/accounts/totals/all', { credentials: 'include' });
        const balanceData = await balanceRes.json();
        setTotalBalance(balanceData.totalBalance ?? 0);

        // 2. Fetch Transactions Summary (Current Month)
        const currentRes = await fetch(`http://localhost:3000/api/transactions/summary/month?month=${currentMonth}&year=${currentYear}`, { credentials: 'include' });
        const currentData = await currentRes.json();

        // 3. Fetch Transactions Summary (Previous Month)
        const prevRes = await fetch(`http://localhost:3000/api/transactions/summary/month?month=${prevMonth}&year=${prevYear}`, { credentials: 'include' });
        const prevData = await prevRes.json();

        // Calculate Income Trends
        const currentIncome = currentData.totalIncome || 0;
        const prevIncome = prevData.totalIncome || 0;
        let incomeDiff = 0;
        if (prevIncome > 0) {
          incomeDiff = ((currentIncome - prevIncome) / prevIncome) * 100;
        } else if (currentIncome > 0) {
          incomeDiff = 100;
        }
        setIncome({
          amount: currentIncome,
          percentage: Math.abs(incomeDiff),
          trend: incomeDiff >= 0 ? 'up' : 'down'
        });

        // Calculate Expense Trends
        const currentExpense = currentData.totalExpense || 0;
        const prevExpense = prevData.totalExpense || 0;
        let expenseDiff = 0;
        if (prevExpense > 0) {
          expenseDiff = ((currentExpense - prevExpense) / prevExpense) * 100;
        } else if (currentExpense > 0) {
          expenseDiff = 100;
        }
        setExpenses({
          amount: currentExpense,
          percentage: Math.abs(expenseDiff),
          trend: expenseDiff <= 0 ? 'up' : 'down' // Less expenses is good ('up' visually for color logic if needed, but typically red/green depends on context)
        });

        // 4. Fetch Savings Goals Stats
        const savingsRes = await fetch('http://localhost:3000/api/savinggoals/stats/summary', { credentials: 'include' });
        const savingsData = savingsRes.ok ? await savingsRes.json() : { data: { overallProgress: 0, totalCurrentAmount: 0, totalTargetAmount: 0 } };
        
        setSavings({
          progress: savingsData.data?.overallProgress || 0,
          current: savingsData.data?.totalCurrentAmount || 0,
          target: savingsData.data?.totalTargetAmount || 0
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="cards-container">
      {/* Saldo total */}
      <div className="card card-total">
        <div className="card-header">
          <span className="card-title">Saldo Total</span>
          <DollarSign size={20} className="card-icon" />
        </div>
        <p className="card-value">${totalBalance.toLocaleString()}</p>
        <p className="card-subtitle">Todas las cuentas</p>
      </div>

      {/* Ingresos del mes */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Ingresos del Mes</span>
          <TrendingUp size={20} color="#10b981" />
        </div>
        <p className="card-value green-text" style={{ color: '#10b981' }}>${income.amount.toLocaleString()}</p>
        <div className="card-subtitle">
          <span className="percentage-up" style={{ color: income.trend === 'up' ? '#10b981' : '#ef4444' }}>
            {income.trend === 'up' ? '+' : '-'}{income.percentage.toFixed(1)}%
          </span> 
          <span style={{ marginLeft: '4px' }}>vs mes anterior</span>
        </div>
      </div>

      {/* Gastos del mes */}
      <div className="card">
        <div className="card-header">
            <span className="card-title">Gastos del Mes</span>
            <TrendingDown size={20} color="#ef4444" />
        </div>
        <p className="card-value red-text" style={{ color: '#ef4444' }}>${expenses.amount.toLocaleString()}</p>
        <div className="card-subtitle">
            <span className="percentage-down" style={{ color: expenses.trend === 'down' ? '#ef4444' : '#10b981' }}>
              {expenses.trend === 'down' ? '+' : '-'}{expenses.percentage.toFixed(1)}%
            </span> 
            <span style={{ marginLeft: '4px' }}>vs mes anterior</span>
        </div>
      </div>

      {/* Meta de ahorro */}
      <div className="card">
        <div className="card-header">
            <span className="card-title">Meta de Ahorro</span>
            <Target size={20} color="#3b82f6" />
        </div>
        <div className="progress-info">
            <p className="progress-percentage">{Math.round(savings.progress)}%</p>
            <p className="progress-text">${savings.current.toLocaleString()} de ${savings.target.toLocaleString()}</p>
        </div>
        {/* Simple Progress Bar */}
        <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', marginTop: '10px' }}>
            <div style={{ width: `${Math.min(savings.progress, 100)}%`, height: '100%', backgroundColor: '#2563eb', borderRadius: '3px' }}></div>
        </div>
      </div>
    </div>
  );
}
