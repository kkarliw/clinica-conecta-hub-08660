import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Calendar, FileText, BarChart, TrendingUp, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Stats {
  totalPacientes: number;
  citasHoy: number;
  citasPendientes: number;
  totalProfesionales: number;
  tasaAsistencia: number;
  promedioEspera: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalPacientes: 0,
    citasHoy: 0,
    citasPendientes: 0,
    totalProfesionales: 0,
    tasaAsistencia: 0,
    promedioEspera: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("healix_token");
        const response = await axios.get("http://localhost:4567/api/estadisticas", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const metrics = [
    {
      title: "Total Pacientes",
      value: stats.totalPacientes,
      icon: Users,
      description: "Pacientes registrados",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Citas Hoy",
      value: stats.citasHoy,
      icon: Calendar,
      description: "Citas programadas",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Citas Pendientes",
      value: stats.citasPendientes,
      icon: Clock,
      description: "Por confirmar",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    },
    {
      title: "Profesionales",
      value: stats.totalProfesionales,
      icon: FileText,
      description: "Médicos activos",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      title: "Tasa Asistencia",
      value: `${stats.tasaAsistencia}%`,
      icon: TrendingUp,
      description: "Últimos 30 días",
      color: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950/20"
    },
    {
      title: "Tiempo Espera",
      value: `${stats.promedioEspera} min`,
      icon: BarChart,
      description: "Promedio",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20"
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
        <p className="text-muted-foreground mt-2">
          Bienvenido, {user?.nombre}. Aquí tienes un resumen general del sistema.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Nueva cita agendada</p>
                  <p className="text-xs text-muted-foreground">Hace 5 minutos</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Users className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Nuevo paciente registrado</p>
                  <p className="text-xs text-muted-foreground">Hace 15 minutos</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <FileText className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Historia clínica actualizada</p>
                  <p className="text-xs text-muted-foreground">Hace 1 hora</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
            <CardDescription>Funciones más utilizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <a
                href="/admin/pacientes"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Gestionar Pacientes</span>
              </a>
              <a
                href="/admin/citas"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Ver Todas las Citas</span>
              </a>
              <a
                href="/admin/estadisticas"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <BarChart className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Reportes y Estadísticas</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
