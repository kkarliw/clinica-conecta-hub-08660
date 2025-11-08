import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Notificacion } from "@/types";

// Mock data - reemplazar con datos reales de tu API
const notificacionesMock: Notificacion[] = [
  {
    id: 1,
    titulo: "Cita próxima",
    mensaje: "Tienes una cita con Juan Pérez mañana a las 10:00 AM",
    fecha: new Date().toISOString(),
    leida: false,
    tipo: "cita"
  },
  {
    id: 2,
    titulo: "Recordatorio",
    mensaje: "No olvides actualizar las historias clínicas pendientes",
    fecha: new Date(Date.now() - 3600000).toISOString(),
    leida: false,
    tipo: "recordatorio"
  },
  {
    id: 3,
    titulo: "Actualización del sistema",
    mensaje: "Healix Pro ha sido actualizado con nuevas funcionalidades",
    fecha: new Date(Date.now() - 86400000).toISOString(),
    leida: true,
    tipo: "sistema"
  }
];

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(notificacionesMock);
  const noLeidas = notificaciones.filter(n => !n.leida).length;

  const marcarComoLeida = (id: number) => {
    setNotificaciones(prev => 
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    );
  };

  const marcarTodasLeidas = () => {
    setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
  };

  const getTipoColor = (tipo: Notificacion['tipo']) => {
    switch (tipo) {
      case 'cita': return 'bg-primary/10 text-primary';
      case 'recordatorio': return 'bg-secondary/10 text-secondary';
      case 'sistema': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {noLeidas > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {noLeidas}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificaciones</h3>
          {noLeidas > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={marcarTodasLeidas}
              className="text-xs"
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notificaciones.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No hay notificaciones
            </div>
          ) : (
            <div className="divide-y">
              {notificaciones.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
                    !notif.leida ? 'bg-accent/50' : ''
                  }`}
                  onClick={() => marcarComoLeida(notif.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${!notif.leida ? 'bg-primary' : 'bg-transparent'}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{notif.titulo}</span>
                        <Badge variant="outline" className={`text-xs ${getTipoColor(notif.tipo)}`}>
                          {notif.tipo}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{notif.mensaje}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notif.fecha).toLocaleString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
