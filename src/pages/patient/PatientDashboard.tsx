import { useQuery } from "@tanstack/react-query";
import { Calendar, FileText, Heart, Bell, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCitasPaciente, getHistoriasClinicas } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import type { CitaMedica } from "@/types";
import { useState } from "react";

export default function PatientDashboard() {
  const { user } = useAuth();

  const { data: citas = [] } = useQuery({
    queryKey: ["citas", "patient", user?.id],
    queryFn: () => getCitasPaciente(user?.id || 0),
    enabled: !!user?.id,
  });

  const { data: historias = [] } = useQuery({
    queryKey: ["historias", "patient"],
    queryFn: getHistoriasClinicas,
  });

  const proximaCita = citas
    .filter((c: CitaMedica) => new Date(c.fecha) > new Date() && c.estado !== 'cancelada')
    .sort((a: CitaMedica, b: CitaMedica) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())[0];

  const stats = [
    {
      title: "Próximas Citas",
      value: citas.filter((c: CitaMedica) => new Date(c.fecha) > new Date()).length,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Historias Clínicas",
      value: historias.length,
      icon: FileText,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Estado de Salud",
      value: "Bueno",
      icon: Heart,
      color: "text-accent-foreground",
      bgColor: "bg-accent",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">¡Hola, {user?.nombre}! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Tu portal de salud personal
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Bell className="w-4 h-4" />
          Notificaciones
        </Button>
      </div>

      {proximaCita && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-accent border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Calendar className="w-5 h-5" />
                Tu Próxima Cita
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {proximaCita.profesionalNombre}
                  </p>
                  <p className="text-sm text-muted-foreground">{proximaCita.motivo}</p>
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  {new Date(proximaCita.fecha).toLocaleDateString('es-CO')}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {new Date(proximaCita.fecha).toLocaleTimeString('es-CO', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
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
                <div className="text-3xl font-bold text-foreground">
                  {typeof stat.value === 'number' ? stat.value : stat.value}
                </div>
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
                Mis Citas
              </CardTitle>
              <Button size="sm">Agendar Cita</Button>
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
