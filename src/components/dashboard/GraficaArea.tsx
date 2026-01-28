import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GraficaAreaProps {
  data: Array<{
    hora: string;
    cantidad: number;
  }>;
}

export function GraficaArea({ data }: GraficaAreaProps) {
  const horaPico = data.reduce((max, item) => 
    item.cantidad > max.cantidad ? item : max
  , data[0] || { hora: '0', cantidad: 0 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horas Pico</CardTitle>
        <CardDescription>
          Hora con más citas: {horaPico.hora}:00 ({horaPico.cantidad} citas)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCitas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="hora"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: 'Hora del día', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
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
            <Area 
              type="monotone" 
              dataKey="cantidad" 
              stroke="hsl(var(--primary))" 
              fillOpacity={1}
              fill="url(#colorCitas)"
              name="Citas"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
