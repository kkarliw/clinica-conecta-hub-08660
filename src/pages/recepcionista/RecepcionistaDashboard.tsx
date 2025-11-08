import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Users, Clock, Bell, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { getCitas, getPacientes } from "@/lib/api";

export default function RecepcionistaDashboard() {
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: citas = [] } = useQuery({
    queryKey: ["citas"],
    queryFn: getCitas,
  });

  const { data: pacientes = [] } = useQuery({
    queryKey: ["pacientes"],
    queryFn: getPacientes,
  });

  // Filtrar citas del día
  const citasHoy = citas.filter(cita => 
    cita.fecha.startsWith(selectedDate)
  );

  const citasPendientes = citasHoy.filter(c => c.estado === 'pendiente');
  const citasConfirmadas = citasHoy.filter(c => c.estado === 'confirmada');
  const citasCompletadas = citasHoy.filter(c => c.estado === 'completada');

  const handleMarcarLlegada = (citaId: number, pacienteNombre: string) => {
    toast.success(`Paciente ${pacienteNombre} registrado`, {
      description: "Se ha notificado al médico"
    });
  };

  const stats = [
    {
      title: "Citas Hoy",
      value: citasHoy.length,
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Pendientes",
      value: citasPendientes.length,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100 dark:bg-yellow-900/30"
    },
    {
      title: "Confirmadas",
      value: citasConfirmadas.length,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Pacientes Totales",
      value: pacientes.length,
      icon: Users,
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Panel de Recepción</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona la agenda y atención de pacientes
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Citas del día */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Citas del Día
          </CardTitle>
          <CardDescription>
            {new Date(selectedDate).toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {citasHoy.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>No hay citas programadas para hoy</p>
              </div>
            ) : (
              citasHoy.map((cita) => (
                <motion.div
                  key={cita.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary">
                      <span className="text-lg font-bold">
                        {new Date(cita.fecha).getHours().toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs">
                        {new Date(cita.fecha).getMinutes().toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{cita.pacienteNombre || 'Paciente'}</p>
                      <p className="text-sm text-muted-foreground">
                        Dr. {cita.profesionalNombre || 'Profesional'}
                      </p>
                      <p className="text-sm text-muted-foreground">{cita.motivo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        cita.estado === 'completada' ? 'default' :
                        cita.estado === 'confirmada' ? 'secondary' :
                        'outline'
                      }
                    >
                      {cita.estado}
                    </Badge>
                    {cita.estado !== 'completada' && (
                      <Button
                        size="sm"
                        onClick={() => handleMarcarLlegada(cita.id!, cita.pacienteNombre!)}
                        className="gap-2"
                      >
                        <Bell className="h-4 w-4" />
                        Marcar llegada
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alertas y pendientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Alertas y Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {citasPendientes.length > 0 && (
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-600 rounded">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  {citasPendientes.length} cita{citasPendientes.length > 1 ? 's' : ''} pendiente{citasPendientes.length > 1 ? 's' : ''} de confirmar
                </p>
              </div>
            )}
            {citasConfirmadas.length > 0 && (
              <div className="p-3 bg-green-100 dark:bg-green-900/30 border-l-4 border-green-600 rounded">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {citasConfirmadas.length} cita{citasConfirmadas.length > 1 ? 's' : ''} confirmada{citasConfirmadas.length > 1 ? 's' : ''}
                </p>
              </div>
            )}
            {citasCompletadas.length > 0 && (
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-600 rounded">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {citasCompletadas.length} cita{citasCompletadas.length > 1 ? 's' : ''} completada{citasCompletadas.length > 1 ? 's' : ''} hoy
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
