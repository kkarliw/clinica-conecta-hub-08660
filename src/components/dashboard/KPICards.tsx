import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Calendar, CheckCircle, XCircle, Users } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  colorClass: string;
}

function KPICard({ title, value, trend, trendLabel, icon, colorClass }: KPICardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${colorClass}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {isPositive && <ArrowUp className="w-4 h-4 text-green-600" />}
            {isNegative && <ArrowDown className="w-4 h-4 text-red-600" />}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-muted-foreground'}`}>
              {Math.abs(trend)}%
            </span>
            {trendLabel && (
              <span className="text-sm text-muted-foreground ml-1">
                {trendLabel}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface KPICardsProps {
  totalCitas: number;
  citasCompletadas: number;
  citasCanceladas: number;
  pacientesNuevos: number;
  trends?: {
    citas?: number;
    completadas?: number;
    canceladas?: number;
    pacientes?: number;
  };
}

export function KPICards({ 
  totalCitas, 
  citasCompletadas, 
  citasCanceladas, 
  pacientesNuevos,
  trends = {}
}: KPICardsProps) {
  const porcentajeAsistencia = totalCitas > 0 
    ? Math.round((citasCompletadas / totalCitas) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Total Citas (Período)"
        value={totalCitas.toLocaleString()}
        trend={trends.citas}
        trendLabel="vs mes anterior"
        icon={<Calendar className="w-5 h-5 text-white" />}
        colorClass="bg-primary"
      />
      
      <KPICard
        title="Citas Completadas"
        value={citasCompletadas.toLocaleString()}
        trend={porcentajeAsistencia}
        trendLabel="% asistencia"
        icon={<CheckCircle className="w-5 h-5 text-white" />}
        colorClass="bg-green-600"
      />
      
      <KPICard
        title="Citas Canceladas"
        value={citasCanceladas.toLocaleString()}
        trend={trends.canceladas}
        trendLabel="vs mes anterior"
        icon={<XCircle className="w-5 h-5 text-white" />}
        colorClass="bg-red-600"
      />
      
      <KPICard
        title="Pacientes Nuevos"
        value={pacientesNuevos.toLocaleString()}
        trend={trends.pacientes}
        trendLabel="vs período anterior"
        icon={<Users className="w-5 h-5 text-white" />}
        colorClass="bg-purple-600"
      />
    </div>
  );
}
