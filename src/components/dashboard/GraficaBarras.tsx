import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GraficaBarrasProps {
  data: Array<{
    especialidad: string;
    cantidad: number;
  }>;
}

export function GraficaBarras({ data }: GraficaBarrasProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Especialidades Más Solicitadas</CardTitle>
        <CardDescription>Top 10 especialidades</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              type="number"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              dataKey="especialidad" 
              type="category" 
              width={120}
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar 
              dataKey="cantidad" 
              fill="hsl(var(--primary))"
              radius={[0, 8, 8, 0]}
              name="Citas"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
