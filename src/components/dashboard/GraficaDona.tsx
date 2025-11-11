import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface GraficaDonaProps {
  data: Array<{
    rango: string;
    cantidad: number;
  }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function GraficaDona({ data }: GraficaDonaProps) {
  const total = data.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Pacientes por Edad</CardTitle>
        <CardDescription>Rangos de edad</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              dataKey="cantidad"
              label={({ rango, cantidad }) => `${rango}: ${cantidad}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-4">
          <p className="text-2xl font-bold text-foreground">{total}</p>
          <p className="text-sm text-muted-foreground">Total Pacientes</p>
        </div>
      </CardContent>
    </Card>
  );
}
