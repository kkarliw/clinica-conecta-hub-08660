import { useQuery } from "@tanstack/react-query";
import { Calendar, Users, FileText, Clock, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCitas, getPacientes, getHistoriasClinicas } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import type { CitaMedica } from "@/types";
import { useState } from "react";
import HistoriaClinicaForm from "@/components/historias/HistoriaClinicaForm";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [isHistoriaOpen, setIsHistoriaOpen] = useState(false);

  const { data: allCitas = [] } = useQuery({
    queryKey: ["citas", "doctor"],
    queryFn: getCitas,
  });

  const citas = allCitas.filter((cita: CitaMedica) => cita.profesionalId === user?.id);

  const { data: pacientes = [] } = useQuery({
    queryKey: ["pacientes"],
    queryFn: getPacientes,
  });

  const { data: historias = [] } = useQuery({
    queryKey: ["historias"],
    queryFn: getHistoriasClinicas,
  });

  const citasHoy = citas.filter((cita: CitaMedica) => {
    const today = new Date().toISOString().split('T')[0];
    return cita.fecha.split('T')[0] === today && cita.estado === 'confirmada';
  });

  const stats = [
    {
      title: "Citas de Hoy",
      value: citasHoy.length,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pacientes Activos",
      value: pacientes.length,
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Historias Clínicas",
      value: historias.length,
      icon: FileText,
      color: "text-accent-foreground",
      bgColor: "bg-accent",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bienvenido, Dr. {user?.nombre}</h1>
          <p className="text-muted-foreground mt-1">
            Panel de Control Médico - {new Date().toLocaleDateString('es-CO', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10">
          <Activity className="w-5 h-5 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">En Línea</span>
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
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Agenda del Día
              </CardTitle>
              <Button size="sm" onClick={() => setIsHistoriaOpen(true)}>
                Nueva Historia
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {citasHoy.length > 0 ? (
              <div className="space-y-3">
                {citasHoy.slice(0, 5).map((cita: CitaMedica) => (
                  <div key={cita.id} className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{cita.pacienteNombre}</p>
                      <p className="text-sm text-muted-foreground">{cita.motivo}</p>
                    </div>
                    <Badge variant="outline">
                      {new Date(cita.fecha).toLocaleTimeString('es-CO', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay citas programadas para hoy
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              Estadísticas del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Consultas Realizadas</span>
                <span className="text-lg font-bold text-foreground">{historias.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Citas Programadas</span>
                <span className="text-lg font-bold text-foreground">{citas.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pacientes Únicos</span>
                <span className="text-lg font-bold text-foreground">{pacientes.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <HistoriaClinicaForm
        isOpen={isHistoriaOpen}
        onClose={() => setIsHistoriaOpen(false)}
        onSubmit={async () => {}}
        isLoading={false}
        pacientes={pacientes}
        profesionales={[]}
      />
    </div>
  );
}
