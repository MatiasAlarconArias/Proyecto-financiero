
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  name: string;
  Ingresos: number;
  Gastos: number;
}

interface Props {
  data: DataPoint[];
}

export default function IncomeExpensesChart({ data }: Props) {
  return (
    <div className="chart-container" style={{ width: '100%', height: 350, background: '#f8fafc', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
      <h3 style={{ marginBottom: '24px', fontSize: '14px', fontWeight: 500, color: '#64748b' }}>Ingresos vs Gastos (Últimos 6 meses)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            axisLine={false} 
            tickLine={false} 
            dy={10}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            cursor={{ fill: '#f1f5f9' }}
          />
          {/* Legend hidden in design or minimal */}
          <Bar dataKey="Ingresos" fill="#10B981" radius={[4, 4, 0, 0]} barSize={32} />
          <Bar dataKey="Gastos" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
