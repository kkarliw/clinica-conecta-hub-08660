import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Clock, Calendar, AlertCircle, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getNotificaciones, marcarComoLeida } from "@/lib/notifications";
import { LoadingState } from "@/components/ui/LoadingState";
import { motion } from "framer-motion";
import { useState } from "react";

export default function CuidadorNotificaciones() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [vistaSimplificada, setVistaSimplificada] = useState(false);

  const { data: notificaciones = [], isLoading } = useQuery({
    queryKey: ['notificaciones', user?.id],
    queryFn: () => getNotificaciones(user?.id || 0),
    enabled: !!user?.id
  });

  const marcarLeidaMutation = useMutation({
    mutationFn: marcarComoLeida,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
      toast({
        title: "Notificación marcada",
        description: "Se ha marcado como leída",
      });
    }
  });

  const getIconByTipo = (tipo: string) => {
    switch (tipo) {
      case 'cita':
        return Calendar;
      case 'recordatorio':
        return Clock;
      case 'sistema':
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'cita':
        return 'default';
      case 'recordatorio':
        return 'secondary';
      case 'sistema':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return <LoadingState message="Cargando notificaciones..." />;
  }

  const noLeidas = notificaciones.filter((n: any) => !n.leida);
  const leidas = notificaciones.filter((n: any) => n.leida);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notificaciones</h1>
          <p className="text-muted-foreground mt-1">
            Mantente al tanto de recordatorios y alertas importantes
          </p>
        </div>
        <Button
          variant={vistaSimplificada ? "default" : "outline"}
          onClick={() => setVistaSimplificada(!vistaSimplificada)}
          aria-label="Activar vista simplificada"
        >
          {vistaSimplificada ? "Vista Normal" : "Vista Simplificada"}
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              No Leídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{noLeidas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{notificaciones.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recordatorios Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {notificaciones.filter((n: any) => n.tipo === 'recordatorio').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notificaciones No Leídas */}
      {noLeidas.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Nuevas Notificaciones ({noLeidas.length})
          </h2>
          {noLeidas.map((notif: any, index: number) => {
            const Icon = getIconByTipo(notif.tipo);
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-l-4 border-l-primary ${vistaSimplificada ? "p-6" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-foreground ${vistaSimplificada ? "text-xl" : ""}`}>
                            {notif.titulo}
                          </h3>
                          <p className={`text-muted-foreground mt-1 ${vistaSimplificada ? "text-lg" : "text-sm"}`}>
                            {notif.mensaje}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={getBadgeVariant(notif.tipo)}>
                              {notif.tipo}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(notif.fecha).toLocaleString('es-CO')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className={vistaSimplificada ? "text-lg py-4 px-6" : ""}
                        onClick={() => marcarLeidaMutation.mutate(notif.id)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Marcar leída
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Notificaciones Leídas */}
      {leidas.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-muted-foreground flex items-center gap-2">
            <Check className="w-5 h-5" />
            Anteriores ({leidas.length})
          </h2>
          <div className="space-y-2">
            {leidas.slice(0, 10).map((notif: any) => {
              const Icon = getIconByTipo(notif.tipo);
              return (
                <Card key={notif.id} className="opacity-60">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <Icon className="w-4 h-4 text-muted-foreground mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground text-sm">{notif.titulo}</h3>
                        <p className="text-xs text-muted-foreground">{notif.mensaje}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notif.fecha).toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {notificaciones.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tienes notificaciones</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
