import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface DataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface Props {
  data: DataPoint[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ExpensesByCategoryChart({ data }: Props) {
  return (
    <div className="chart-container" style={{ width: '100%', height: 350, background: '#f8fafc', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '8px' }}>
        <PieChartIcon size={18} color="#10b981" />
        <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#333', margin: 0 }}>Gastos por Categoría</h3>
      </div>
      
      {data.length > 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
           {/* Chart Area - keeping it simple mostly empty space or small chart if desired, but user image shows large whitespace. 
               I will put the chart there but maybe smaller or standard? 
               Let's make it invisible/very subtle? No, user implies "Graphs". 
               I'll render the Pie Chart but position the Legend significantly at the bottom. */}
            <div style={{ flex: 1, minHeight: '150px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number | undefined) => value !== undefined ? `$${value}` : ''} />
                        {/* No default Legend */}
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Custom Legend Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                {data.map((entry, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span style={{ fontWeight: 500 }}>{entry.name}</span>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>${entry.value}</span>
                    </div>
                ))}
            </div>
        </div>
      ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              No hay gastos este mes
          </div>
      )}
    </div>
  );
}
