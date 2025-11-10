import { useQuery } from "@tanstack/react-query";
import { Calendar, FileText, Heart, Bell, Clock, AlertCircle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCitasPaciente, getHistoriasClinicasPaciente } from "@/lib/api";
import { getNotificacionesNoLeidas } from "@/lib/notifications";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import type { CitaMedica } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vistaSimplificada, setVistaSimplificada] = useState(false);

  const { data: citas = [] } = useQuery({
    queryKey: ["citas", "patient", user?.id],
    queryFn: () => getCitasPaciente(user?.id || 0),
    enabled: !!user?.id,
  });

  const { data: historias = [] } = useQuery({
    queryKey: ["historias", "patient", user?.id],
    queryFn: () => getHistoriasClinicasPaciente(user?.id || 0),
    enabled: !!user?.id,
  });

  const { data: notificaciones = [] } = useQuery({
    queryKey: ["notificaciones", user?.id],
    queryFn: () => getNotificacionesNoLeidas(user?.id || 0),
    enabled: !!user?.id,
  });

  const proximasCitas = citas
    .filter((c: CitaMedica) => new Date(c.fecha) > new Date() && c.estado !== 'cancelada')
    .sort((a: CitaMedica, b: CitaMedica) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const proximaCita = proximasCitas[0];

  const stats = [
    {
      title: "Próximas Citas",
      value: proximasCitas.length,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Programadas",
    },
    {
      title: "Historias Clínicas",
      value: historias.length,
      icon: FileText,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      description: "Registros médicos",
    },
    {
      title: "Notificaciones",
      value: notificaciones.length,
      icon: Bell,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      description: "Nuevas",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className={`font-bold text-foreground ${vistaSimplificada ? "text-4xl" : "text-3xl"}`}>
            ¡Hola, {user?.nombre}! 👋
          </h1>
          <p className={`text-muted-foreground mt-1 ${vistaSimplificada ? "text-lg" : ""}`}>
            Tu portal de salud personal
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={vistaSimplificada ? "default" : "outline"}
            onClick={() => setVistaSimplificada(!vistaSimplificada)}
          >
            {vistaSimplificada ? "Vista Normal" : "Vista Simplificada"}
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => navigate("/patient/appointments")}>
            <Bell className="w-4 h-4" />
            {notificaciones.length > 0 && (
              <Badge variant="destructive" className="rounded-full px-2 py-0.5">
                {notificaciones.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {proximaCita && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`bg-gradient-to-r from-primary/10 to-accent border-primary/20 ${vistaSimplificada ? "p-6" : ""}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-primary ${vistaSimplificada ? "text-2xl" : ""}`}>
                <Calendar className={vistaSimplificada ? "w-7 h-7" : "w-5 h-5"} />
                Tu Próxima Cita
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-semibold text-foreground ${vistaSimplificada ? "text-2xl" : "text-lg"}`}>
                    {proximaCita.profesionalNombre}
                  </p>
                  <p className={`text-muted-foreground ${vistaSimplificada ? "text-lg" : "text-sm"}`}>
                    {proximaCita.motivo}
                  </p>
                </div>
                <Badge className={`bg-primary text-primary-foreground ${vistaSimplificada ? "text-lg p-3" : ""}`}>
                  {new Date(proximaCita.fecha).toLocaleDateString('es-CO')}
                </Badge>
              </div>
              <div className={`flex items-center gap-2 text-muted-foreground ${vistaSimplificada ? "text-lg" : "text-sm"}`}>
                <Clock className={vistaSimplificada ? "w-6 h-6" : "w-4 h-4"} />
                {new Date(proximaCita.fecha).toLocaleTimeString('es-CO', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              <Button
                className={vistaSimplificada ? "w-full text-lg py-6 mt-4" : "w-full mt-4"}
                onClick={() => navigate("/patient/appointments")}
              >
                Ver Detalles
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

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
                <div className={`font-bold text-foreground ${vistaSimplificada ? "text-4xl" : "text-3xl"}`}>
                  {typeof stat.value === 'number' ? stat.value : stat.value}
                </div>
                {stat.description && (
                  <p className={`text-muted-foreground mt-1 ${vistaSimplificada ? "text-base" : "text-xs"}`}>
                    {stat.description}
                  </p>
                )}
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
                <Calendar className="w-5 h-5 text-primary" />
                Mis Citas ({proximasCitas.length})
              </CardTitle>
              <Button size="sm" onClick={() => navigate("/patient/appointments/new")}>Agendar Cita</Button>
            </div>
          </CardHeader>
          <CardContent>
            {citas.length > 0 ? (
              <div className="space-y-3">
                {citas.slice(0, 4).map((cita: CitaMedica) => (
                  <div key={cita.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground">{cita.profesionalNombre}</p>
                      <Badge variant={cita.estado === 'confirmada' ? 'default' : 'secondary'}>
                        {cita.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{cita.motivo}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(cita.fecha).toLocaleDateString('es-CO')} - {new Date(cita.fecha).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No tienes citas programadas
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-secondary" />
                Historial Médico
              </CardTitle>
              <Button variant="outline" size="sm">Ver Todo</Button>
            </div>
          </CardHeader>
          <CardContent>
            {historias.length > 0 ? (
              <div className="space-y-3">
                {historias.slice(0, 4).map((historia: any) => (
                  <div key={historia.id} className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground text-sm">{historia.diagnostico}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(historia.fecha).toLocaleDateString('es-CO')} - Dr. {historia.profesionalNombre}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay historias clínicas registradas
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
