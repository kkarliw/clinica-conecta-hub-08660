import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { getNotificaciones, marcarComoLeida, NotificacionInterna } from "@/lib/notifications";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationCenter() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notificaciones = [] } = useQuery({
    queryKey: ["notificaciones", user?.id],
    queryFn: () => getNotificaciones(user?.id || 0),
    enabled: !!user?.id,
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });

  const marcarLeidaMutation = useMutation({
    mutationFn: marcarComoLeida,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
    },
  });

  const noLeidas = notificaciones.filter((n: NotificacionInterna) => !n.leida);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'paciente_llego': return 'bg-green-500';
      case 'cita': return 'bg-blue-500';
      case 'mensaje': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {noLeidas.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {noLeidas.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificaciones</h3>
          {noLeidas.length > 0 && (
            <Badge variant="secondary">{noLeidas.length} nuevas</Badge>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          <div className="p-2">
            <AnimatePresence>
              {notificaciones.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p>No tienes notificaciones</p>
                </div>
              ) : (
                notificaciones.map((notif: NotificacionInterna) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={`p-3 mb-2 rounded-lg border ${
                      notif.leida ? 'bg-background' : 'bg-accent/50'
                    } hover:bg-accent transition-colors`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${getTipoColor(notif.tipo)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notif.titulo}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notif.mensaje}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notif.fecha).toLocaleDateString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {!notif.leida && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => marcarLeidaMutation.mutate(notif.id!)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
