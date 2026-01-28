import api from './api';

// ============================================
// NOTIFICACIONES - Conectado a Backend Java
// ============================================
// Endpoints disponibles:
// GET    /api/notificaciones/:usuarioId
// POST   /api/notificaciones
// PUT    /api/notificaciones/:id/leer
// ============================================

export interface NotificacionInterna {
  id?: number;
  titulo: string;
  mensaje: string;
  remitenteId: number;
  destinatarioId: number;
  tipo: 'cita' | 'paciente_llego' | 'mensaje' | 'sistema';
  leida: boolean;
  fecha: string;
  citaId?: number;
}

export const getNotificaciones = async (usuarioId: number): Promise<NotificacionInterna[]> => {
  const response = await api.get<NotificacionInterna[]>(`/notificaciones/${usuarioId}`);
  return response.data;
};

// ⚠️ FALTANTE EN BACKEND - Filtrar solo no leídas
export const getNotificacionesNoLeidas = async (usuarioId: number): Promise<NotificacionInterna[]> => {
  // TEMPORAL: Filtrar en frontend
  const notificaciones = await getNotificaciones(usuarioId);
  return notificaciones.filter(n => !n.leida);
  // TODO: Implementar en backend: GET /api/notificaciones/:usuarioId/no-leidas
};

export const enviarNotificacion = async (notificacion: Omit<NotificacionInterna, 'id' | 'fecha'>): Promise<NotificacionInterna> => {
  const response = await api.post<NotificacionInterna>('/notificaciones', {
    titulo: notificacion.titulo,
    mensaje: notificacion.mensaje,
    remitente: notificacion.remitenteId,
    destinatario: notificacion.destinatarioId,
    tipo: notificacion.tipo.toUpperCase(), // Backend usa MAYÚSCULAS
    leida: notificacion.leida,
    cita: notificacion.citaId
  });
  return response.data;
};

export const marcarComoLeida = async (notificacionId: number): Promise<void> => {
  await api.put(`/notificaciones/${notificacionId}/leer`);
};

export const notificarPacienteLlego = async (medicoId: number, pacienteNombre: string, citaId: number) => {
  return enviarNotificacion({
    titulo: 'Paciente en sala de espera',
    mensaje: `El paciente ${pacienteNombre} ha llegado y está esperando`,
    remitenteId: 0, // Sistema
    destinatarioId: medicoId,
    tipo: 'paciente_llego',
    leida: false,
    citaId
  });
};
