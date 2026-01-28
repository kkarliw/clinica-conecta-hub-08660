import { useQuery } from "@tanstack/react-query";
import { Users, Stethoscope, Calendar, Activity, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPacientes, getProfesionales, getCitas } from "@/lib/api";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { CitaMedica } from "@/types";

export default function Dashboard() {
  const { data: pacientes = [] } = useQuery({
    queryKey: ["pacientes"],
    queryFn: getPacientes,
  });

  const { data: profesionales = [] } = useQuery({
    queryKey: ["profesionales"],
    queryFn: getProfesionales,
  });

  const { data: citas = [] } = useQuery({
    queryKey: ["citas"],
    queryFn: getCitas,
  });

  const citasHoy = citas.filter((cita: CitaMedica) => {
    const today = new Date().toISOString().split('T')[0];
    return cita.fecha.split('T')[0] === today;
  });

  const stats = [
    {
      title: "Total Pacientes",
      value: pacientes.length,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Profesionales",
      value: profesionales.length,
      icon: Stethoscope,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Total Citas",
      value: citas.length,
      icon: Calendar,
      color: "text-accent-foreground",
      bgColor: "bg-accent",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido al sistema de gestión de citas médicas
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10">
          <Activity className="w-5 h-5 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">Sistema Activo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Resumen de Pacientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Total de pacientes registrados en el sistema: <span className="font-bold text-foreground">{pacientes.length}</span>
            </p>
            <div className="mt-4 p-4 bg-accent rounded-lg">
              <p className="text-sm text-accent-foreground">
                Los pacientes pueden agendar citas con profesionales de salud disponibles.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-secondary" />
              Profesionales de Salud
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Total de profesionales disponibles: <span className="font-bold text-foreground">{profesionales.length}</span>
            </p>
            <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
              <p className="text-sm text-foreground">
                Especialistas certificados listos para atender a los pacientes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Gestión de Citas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Total de citas agendadas: <span className="font-bold text-foreground">{citas.length}</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Citas Activas</p>
              <p className="text-2xl font-bold text-primary">{citas.length}</p>
            </div>
            <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
              <p className="text-sm text-muted-foreground mb-1">Próximas</p>
              <p className="text-2xl font-bold text-secondary">
                {citas.filter(c => new Date(c.fecha) > new Date()).length}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Completadas</p>
              <p className="text-2xl font-bold text-foreground">
                {citas.filter(c => new Date(c.fecha) <= new Date()).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
