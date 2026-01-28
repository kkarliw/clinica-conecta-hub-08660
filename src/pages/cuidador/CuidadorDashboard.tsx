import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, Calendar, Bell, Heart, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardCuidador } from "@/services/cuidador.service";
import { LoadingState } from "@/components/ui/LoadingState";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CuidadorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vistaSimplificada, setVistaSimplificada] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-cuidador', user?.id],
    queryFn: () => getDashboardCuidador(user?.id || 0),
    enabled: !!user?.id
  });

  // Función de lectura en voz alta (Web Speech API)
  const leerTexto = (texto: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isLoading) {
    return <LoadingState message="Cargando información del cuidador..." />;
  }

  const pacientes = data?.pacientes || [];
  const notificaciones = data?.notificaciones || [];

  return (
    <div className="space-y-6 p-6">
      {/* Header con accesibilidad */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Panel de Cuidador
          </h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido, {user?.nombre}
          </p>
        </div>

        {/* Controles de accesibilidad */}
        <div className="flex gap-2">
          <Button
            variant={vistaSimplificada ? "default" : "outline"}
            onClick={() => setVistaSimplificada(!vistaSimplificada)}
            aria-label="Activar vista simplificada con texto grande y alto contraste"
          >
            {vistaSimplificada ? "Vista Normal" : "Vista Simplificada"}
          </Button>
          <Button
            variant="outline"
            onClick={() => leerTexto(`Bienvenido al panel de cuidador ${user?.nombre}. Tienes ${pacientes.length} pacientes asignados y ${notificaciones.length} notificaciones pendientes.`)}
            aria-label="Leer resumen en voz alta"
          >
            🔊 Leer
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className={vistaSimplificada ? "border-4 border-primary" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={vistaSimplificada ? "text-2xl font-bold" : "text-sm font-medium"}>
                Pacientes Asignados
              </CardTitle>
              <Users className={vistaSimplificada ? "h-8 w-8" : "h-4 w-4 text-muted-foreground"} />
            </CardHeader>
            <CardContent>
              <div className={vistaSimplificada ? "text-4xl font-bold" : "text-2xl font-bold"}>
                {pacientes.length}
              </div>
              <p className={vistaSimplificada ? "text-lg text-muted-foreground" : "text-xs text-muted-foreground"}>
                Bajo tu cuidado
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className={vistaSimplificada ? "border-4 border-accent" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={vistaSimplificada ? "text-2xl font-bold" : "text-sm font-medium"}>
                Notificaciones
              </CardTitle>
              <Bell className={vistaSimplificada ? "h-8 w-8" : "h-4 w-4 text-muted-foreground"} />
            </CardHeader>
            <CardContent>
              <div className={vistaSimplificada ? "text-4xl font-bold" : "text-2xl font-bold"}>
                {notificaciones.length}
              </div>
              <p className={vistaSimplificada ? "text-lg text-muted-foreground" : "text-xs text-muted-foreground"}>
                Pendientes de leer
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className={vistaSimplificada ? "border-4 border-secondary" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={vistaSimplificada ? "text-2xl font-bold" : "text-sm font-medium"}>
                Citas Hoy
              </CardTitle>
              <Calendar className={vistaSimplificada ? "h-8 w-8" : "h-4 w-4 text-muted-foreground"} />
            </CardHeader>
            <CardContent>
              <div className={vistaSimplificada ? "text-4xl font-bold" : "text-2xl font-bold"}>
                0
              </div>
              <p className={vistaSimplificada ? "text-lg text-muted-foreground" : "text-xs text-muted-foreground"}>
                Programadas
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className={vistaSimplificada ? "border-4 border-primary" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={vistaSimplificada ? "text-2xl font-bold" : "text-sm font-medium"}>
                Reportes Diarios
              </CardTitle>
              <FileText className={vistaSimplificada ? "h-8 w-8" : "h-4 w-4 text-muted-foreground"} />
            </CardHeader>
            <CardContent>
              <div className={vistaSimplificada ? "text-4xl font-bold" : "text-2xl font-bold"}>
                {pacientes.length}
              </div>
              <p className={vistaSimplificada ? "text-lg text-muted-foreground" : "text-xs text-muted-foreground"}>
                Por completar hoy
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alertas importantes */}
      {notificaciones.length > 0 && (
        <Card className="border-l-4 border-l-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Notificaciones Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notificaciones.slice(0, 3).map((notif: any) => (
                <div key={notif.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{notif.titulo}</p>
                    <p className="text-sm text-muted-foreground">{notif.mensaje}</p>
                  </div>
                  <Badge>{notif.tipo}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de pacientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Mis Pacientes
          </CardTitle>
          <CardDescription>
            Pacientes bajo tu cuidado y permisos asignados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pacientes.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tienes pacientes asignados todavía</p>
              <Button
                className="mt-4"
                onClick={() => navigate('/cuidador/pacientes')}
              >
                Vincular Paciente
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pacientes.map((rel: any) => (
                <Card key={rel.id} className={vistaSimplificada ? "p-6" : "hover:shadow-md transition-shadow"}>
                  <CardHeader>
                    <CardTitle className={vistaSimplificada ? "text-2xl" : "text-lg"}>
                      {rel.pacienteNombre || "Paciente"}
                    </CardTitle>
                    <CardDescription>
                      {rel.tipoPaciente} - {rel.parentesco}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {rel.permisos.puedeAgendar && <Badge variant="secondary">Agendar</Badge>}
                      {rel.permisos.puedeCancelar && <Badge variant="secondary">Cancelar</Badge>}
                      {rel.permisos.puedeAccederHistoria && <Badge variant="secondary">Ver Historia</Badge>}
                    </div>
                    <Button
                      className={vistaSimplificada ? "w-full text-lg py-6" : "w-full"}
                      variant="outline"
                      onClick={() => navigate(`/cuidador/paciente/${rel.pacienteId}`)}
                    >
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acciones rápidas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Button
          className={vistaSimplificada ? "h-20 text-lg" : ""}
          onClick={() => navigate('/cuidador/pacientes')}
          aria-label="Gestionar pacientes asignados"
        >
          <Users className="mr-2 h-5 w-5" />
          Gestionar Pacientes
        </Button>
        <Button
          className={vistaSimplificada ? "h-20 text-lg" : ""}
          variant="outline"
          onClick={() => navigate('/cuidador/citas')}
          aria-label="Ver y agendar citas médicas"
        >
          <Calendar className="mr-2 h-5 w-5" />
          Citas Médicas
        </Button>
        <Button
          className={vistaSimplificada ? "h-20 text-lg" : ""}
          variant="outline"
          onClick={() => navigate('/cuidador/reportes')}
          aria-label="Registrar reportes diarios de pacientes"
        >
          <FileText className="mr-2 h-5 w-5" />
          Reportes Diarios
        </Button>
      </div>
    </div>
  );
}
