import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getNotificacionesNoLeidas } from '@/lib/notifications';
import { toast } from 'sonner';

/**
 * Componente para escuchar notificaciones en tiempo real
 * Usa polling cada 10 segundos para simular tiempo real
 */
export function NotificationListener() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notificaciones = [] } = useQuery({
    queryKey: ['notificaciones-realtime', user?.id],
    queryFn: () => getNotificacionesNoLeidas(user?.id || 0),
    enabled: !!user?.id && (user.rol === 'MEDICO' || user.rol === 'RECEPCIONISTA'),
    refetchInterval: 10000, // Refrescar cada 10 segundos
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (notificaciones.length > 0 && user?.rol === 'MEDICO') {
      // Verificar si hay nuevas notificaciones de paciente_llego
      const notificacionesPacienteLlego = notificaciones.filter(
        (n: any) => n.tipo === 'paciente_llego' || n.tipo === 'PACIENTE_LLEGO'
      );

      notificacionesPacienteLlego.forEach((notif: any) => {
        // Mostrar toast para notificaciones no vistas
        const yaVista = localStorage.getItem(`notif_vista_${notif.id}`);
        if (!yaVista) {
          toast.info(notif.titulo, {
            description: notif.mensaje,
            duration: 8000,
            action: {
              label: 'Ver',
              onClick: () => {
                // Navegar al dashboard o agenda del médico
                window.location.href = '/medico/agenda';
              }
            }
          });
          localStorage.setItem(`notif_vista_${notif.id}`, 'true');
          
          // Invalidar queries para actualizar dashboard
          queryClient.invalidateQueries({ queryKey: ['citas'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-medico'] });
        }
      });
    }
  }, [notificaciones, user, queryClient]);

  // No renderiza nada, solo escucha
  return null;
}
