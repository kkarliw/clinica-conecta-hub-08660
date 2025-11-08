import api from './api';

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

export const enviarNotificacion = async (notificacion: Omit<NotificacionInterna, 'id' | 'fecha'>): Promise<NotificacionInterna> => {
  const response = await api.post<NotificacionInterna>('/notificaciones', notificacion);
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
