
import { useEffect, useState } from 'react';
import IncomeExpensesChart from './IncomeExpensesChart';
import ExpensesByCategoryChart from './ExpensesByCategoryChart';
import './DashboardCharts.css';

interface MonthlyTrend {
  name: string;
  Ingresos: number;
  Gastos: number;
}

interface CategoryExpense {
  name: string;
  value: number;
}

export default function DashboardCharts() {
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<CategoryExpense[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendsRes = await fetch('http://localhost:3000/api/transactions/stats/monthly-trends', {
          credentials: 'include',
        });
        const trendsData = await trendsRes.json();
        setMonthlyTrends(trendsData);

        const expensesRes = await fetch('http://localhost:3000/api/transactions/stats/expenses-by-category', {
          credentials: 'include',
        });
        const expensesData = await expensesRes.json();
        setExpensesByCategory(expensesData); // Assuming API returns [{name, value}, ...]
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-charts-grid">
      <IncomeExpensesChart data={monthlyTrends} />
      <ExpensesByCategoryChart data={expensesByCategory} />
    </div>
  );
}
