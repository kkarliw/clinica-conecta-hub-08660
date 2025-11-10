import { useQuery } from "@tanstack/react-query";
import { Users, Calendar, FileText, AlertCircle, Heart, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPacientes, getCitas, getHistoriasClinicas } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import type { CitaMedica, Paciente } from "@/types";

export default function CaregiverDashboard() {
  const { user } = useAuth();

  const { data: pacientes = [] } = useQuery({
    queryKey: ["pacientes", "caregiver"],
    queryFn: getPacientes,
  });

  const { data: citas = [] } = useQuery({
    queryKey: ["citas", "caregiver"],
    queryFn: getCitas,
  });

  const { data: historias = [] } = useQuery({
    queryKey: ["historias", "caregiver"],
    queryFn: getHistoriasClinicas,
  });

  const citasProximas = citas.filter(
    (c: CitaMedica) => new Date(c.fecha) > new Date() && c.estado !== 'cancelada'
  );

  const stats = [
    {
      title: "Pacientes a Cargo",
      value: pacientes.length,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Próximas Citas",
      value: citasProximas.length,
      icon: Calendar,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Alertas Activas",
      value: 2,
      icon: AlertCircle,
      color: "text-accent-foreground",
      bgColor: "bg-accent",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel de Cuidador 🧑‍🤝‍🧑</h1>
          <p className="text-muted-foreground mt-1">
            Hola {user?.nombre}, gestiona el cuidado de tus pacientes
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Bell className="w-4 h-4" />
          Alertas
        </Button>
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
                <Users className="w-5 h-5 text-primary" />
                Pacientes Asignados
              </CardTitle>
              <Button size="sm" variant="outline">Ver Todos</Button>
            </div>
          </CardHeader>
          <CardContent>
            {pacientes.length > 0 ? (
              <div className="space-y-3">
                {pacientes.slice(0, 4).map((paciente: Paciente) => (
                  <div key={paciente.id} className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{paciente.nombre} {paciente.apellido}</p>
                        <p className="text-sm text-muted-foreground">{paciente.numeroDocumento}</p>
                      </div>
                    </div>
                    <Badge variant="outline">Activo</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay pacientes asignados
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                Próximas Citas
              </CardTitle>
              <Button size="sm">Agendar Nueva</Button>
            </div>
          </CardHeader>
          <CardContent>
            {citasProximas.length > 0 ? (
              <div className="space-y-3">
                {citasProximas.slice(0, 4).map((cita: CitaMedica) => (
                  <div key={cita.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground text-sm">{cita.pacienteNombre}</p>
                      <Badge variant="secondary">
                        {new Date(cita.fecha).toLocaleDateString('es-CO')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{cita.profesionalNombre}</p>
                    <p className="text-xs text-muted-foreground mt-1">{cita.motivo}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay citas próximas
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent-foreground" />
            Alertas y Recordatorios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-accent border border-accent-foreground/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-accent-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Recordatorio de Medicación</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Paciente María González - Tomar medicamento a las 14:00
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Cita Programada</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Control médico mañana a las 10:00 AM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
