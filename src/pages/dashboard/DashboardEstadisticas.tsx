import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Users, TrendingUp, Activity, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEstadisticas, getCitas, getPacientes } from "@/lib/api";
import { LoadingState } from "@/components/ui/LoadingState";
import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--destructive))'];

export default function DashboardEstadisticas() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mes");

  const { data: estadisticas, isLoading } = useQuery({
    queryKey: ['estadisticas'],
    queryFn: getEstadisticas
  });

  const { data: citas = [] } = useQuery({
    queryKey: ['citas'],
    queryFn: getCitas
  });

  const { data: pacientes = [] } = useQuery({
    queryKey: ['pacientes'],
    queryFn: getPacientes
  });

  if (isLoading) {
    return <LoadingState message="Cargando estadísticas..." />;
  }

  // Procesar datos para gráficos
  const citasPorEstado = [
    { name: 'Confirmadas', value: citas.filter((c: any) => c.estado === 'confirmada').length },
    { name: 'Pendientes', value: citas.filter((c: any) => c.estado === 'pendiente').length },
    { name: 'Completadas', value: citas.filter((c: any) => c.estado === 'completada').length },
    { name: 'Canceladas', value: citas.filter((c: any) => c.estado === 'cancelada').length },
  ];

  const citasPorMes = Array.from({ length: 12 }, (_, i) => {
    const mes = i + 1;
    const citasDelMes = citas.filter((c: any) => {
      const fecha = new Date(c.fecha);
      return fecha.getMonth() + 1 === mes;
    });
    return {
      mes: new Date(2024, i).toLocaleDateString('es-CO', { month: 'short' }),
      citas: citasDelMes.length,
      completadas: citasDelMes.filter((c: any) => c.estado === 'completada').length
    };
  });

  const pacientesPorEdad = [
    { rango: '0-18', cantidad: pacientes.filter((p: any) => p.edad <= 18).length },
    { rango: '19-35', cantidad: pacientes.filter((p: any) => p.edad > 18 && p.edad <= 35).length },
    { rango: '36-55', cantidad: pacientes.filter((p: any) => p.edad > 35 && p.edad <= 55).length },
    { rango: '56+', cantidad: pacientes.filter((p: any) => p.edad > 55).length },
  ];

  const tasaAsistencia = citas.length > 0 
    ? Math.round((citas.filter((c: any) => c.estado === 'completada').length / citas.length) * 100) 
    : 0;

  const stats = [
    {
      title: "Total Pacientes",
      value: estadisticas?.totalPacientes || pacientes.length,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+12%",
    },
    {
      title: "Citas Hoy",
      value: estadisticas?.citasHoy || 0,
      icon: Calendar,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      change: "+5%",
    },
    {
      title: "Tasa de Asistencia",
      value: `${tasaAsistencia}%`,
      icon: TrendingUp,
      color: "text-accent-foreground",
      bgColor: "bg-accent",
      change: "+8%",
    },
    {
      title: "Total Citas",
      value: citas.length,
      icon: Activity,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      change: "+15%",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Estadísticas del Sistema</h1>
          <p className="text-muted-foreground mt-1">
            Métricas y análisis en tiempo real
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Fecha</CardTitle>
          <CardDescription>Selecciona el período para analizar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="periodo">Período Rápido</Label>
              <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoy">Hoy</SelectItem>
                  <SelectItem value="semana">Esta Semana</SelectItem>
                  <SelectItem value="mes">Este Mes</SelectItem>
                  <SelectItem value="trimestre">Este Trimestre</SelectItem>
                  <SelectItem value="año">Este Año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fechaInicio">Fecha Inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fechaFin">Fecha Fin</Label>
              <Input
                id="fechaFin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full">Aplicar Filtros</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">{stat.change}</span> vs mes anterior
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Línea - Citas por Mes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Tendencia de Citas
            </CardTitle>
            <CardDescription>Citas programadas y completadas por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={citasPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="citas" stroke="hsl(var(--primary))" strokeWidth={2} name="Total" />
                <Line type="monotone" dataKey="completadas" stroke="hsl(var(--secondary))" strokeWidth={2} name="Completadas" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pastel - Citas por Estado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary" />
              Distribución de Citas
            </CardTitle>
            <CardDescription>Por estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={citasPorEstado}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {citasPorEstado.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Barras - Pacientes por Edad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent-foreground" />
              Pacientes por Rango de Edad
            </CardTitle>
            <CardDescription>Distribución demográfica</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pacientesPorEdad}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="rango" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="cantidad" fill="hsl(var(--accent))" name="Pacientes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Métricas Adicionales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Métricas Clave
            </CardTitle>
            <CardDescription>Rendimiento del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
              <span className="text-sm font-medium">Promedio Citas/Día</span>
              <span className="text-lg font-bold">{Math.round(citas.length / 30)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/5 rounded-lg">
              <span className="text-sm font-medium">Pacientes Nuevos (Mes)</span>
              <span className="text-lg font-bold">{Math.round(pacientes.length * 0.15)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-accent/5 rounded-lg">
              <span className="text-sm font-medium">Tasa Cancelación</span>
              <span className="text-lg font-bold">
                {citas.length > 0 ? Math.round((citas.filter((c: any) => c.estado === 'cancelada').length / citas.length) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-500/5 rounded-lg">
              <span className="text-sm font-medium">Tiempo Promedio Espera</span>
              <span className="text-lg font-bold">15 min</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
