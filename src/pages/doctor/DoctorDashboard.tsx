import { useQuery } from "@tanstack/react-query";
import { Calendar, Users, FileText, Clock, Activity, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCitasMedico, getPacientes, getHistoriasClinicas, getEstadisticasMedico } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import type { CitaMedica } from "@/types";
import { useState } from "react";
import HistoriaClinicaForm from "@/components/historias/HistoriaClinicaForm";
import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isHistoriaOpen, setIsHistoriaOpen] = useState(false);

  const { data: citas = [] } = useQuery({
    queryKey: ["citas", "medico", user?.id],
    queryFn: () => getCitasMedico(user?.id || 0),
    enabled: !!user?.id,
  });

  const { data: estadisticas } = useQuery({
    queryKey: ["estadisticas", "medico", user?.id],
    queryFn: () => getEstadisticasMedico(user?.id || 0),
    enabled: !!user?.id,
  });

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
    return cita.fecha.split('T')[0] === today;
  });

  const citasPendientes = citas.filter((c: CitaMedica) => c.estado === 'pendiente');
  const citasCompletadas = citas.filter((c: CitaMedica) => c.estado === 'completada');

  const stats = [
    {
      title: "Citas de Hoy",
      value: citasHoy.length,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: `${citasHoy.filter((c: CitaMedica) => c.estado === 'confirmada').length} confirmadas`,
    },
    {
      title: "Citas Pendientes",
      value: citasPendientes.length,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      description: "Por confirmar",
    },
    {
      title: "Pacientes Activos",
      value: pacientes.length,
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      description: "Bajo tu atención",
    },
    {
      title: "Historias Clínicas",
      value: historias.length,
      icon: FileText,
      color: "text-accent-foreground",
      bgColor: "bg-accent",
      description: "Total registradas",
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {citasPendientes.length > 0 && (
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-5 h-5" />
              Alertas - Citas Pendientes ({citasPendientes.length})
            </CardTitle>
            <CardDescription>Requieren confirmación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {citasPendientes.slice(0, 3).map((cita: CitaMedica) => (
                <div key={cita.id} className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{cita.pacienteNombre}</p>
                    <p className="text-sm text-muted-foreground">{new Date(cita.fecha).toLocaleString('es-CO')}</p>
                  </div>
                  <Button size="sm" onClick={() => navigate(`/medico/agenda`)}>
                    Revisar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Agenda del Día
              </CardTitle>
              <Button size="sm" onClick={() => navigate("/medico/agenda")}>
                Ver Agenda
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {citasHoy.length > 0 ? (
              <div className="space-y-3">
                {citasHoy.slice(0, 5).map((cita: CitaMedica) => (
                  <div key={cita.id} className="p-3 bg-muted/50 rounded-lg flex items-center justify-between hover:bg-muted transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{cita.pacienteNombre}</p>
                      <p className="text-sm text-muted-foreground">{cita.motivo}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={cita.estado === 'confirmada' ? 'default' : 'secondary'}>
                        {cita.estado}
                      </Badge>
                      <Badge variant="outline">
                        {new Date(cita.fecha).toLocaleTimeString('es-CO', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Badge>
                    </div>
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
              <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                <span className="text-sm text-muted-foreground">Consultas Realizadas</span>
                <span className="text-lg font-bold text-foreground">{citasCompletadas.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-secondary/5 rounded-lg">
                <span className="text-sm text-muted-foreground">Citas Programadas</span>
                <span className="text-lg font-bold text-foreground">{citas.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent/5 rounded-lg">
                <span className="text-sm text-muted-foreground">Tasa de Asistencia</span>
                <span className="text-lg font-bold text-foreground">
                  {citas.length > 0 ? Math.round((citasCompletadas.length / citas.length) * 100) : 0}%
                </span>
              </div>
              <Button className="w-full" variant="outline" onClick={() => navigate("/doctor/patients")}>
                <Users className="w-4 h-4 mr-2" />
                Ver Todos los Pacientes
              </Button>
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
