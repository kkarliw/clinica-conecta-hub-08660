// ============================================
// SERVICIO ESPECÍFICO PARA RECEPCIONISTA
// ============================================
// Agrupa las funciones más usadas por el rol recepcionista

import { 
  getCitasHoy, 
  getCitas, 
  marcarLlegadaPaciente,
  buscarPacientesPorNombre,
  buscarPacientePorDocumento,
  getEstadisticas,
  getPacientes
} from '@/lib/api';
import { 
  getNotificaciones, 
  getNotificacionesNoLeidas,
  notificarPacienteLlego 
} from '@/lib/notifications';
import type { CitaMedica, Paciente } from '@/types';

// ============================================
// Dashboard del recepcionista
// ============================================
export const getDashboardRecepcionista = async (usuarioId: number) => {
  try {
    const [estadisticas, citasHoy, notificaciones] = await Promise.all([
      getEstadisticas(),
      getCitasHoy(),
      getNotificacionesNoLeidas(usuarioId)
    ]);

    return {
      estadisticas,
      citasHoy,
      notificaciones,
      citasPendientes: citasHoy.filter(c => c.estado === 'pendiente'),
      citasConfirmadas: citasHoy.filter(c => c.estado === 'confirmada'),
    };
  } catch (error) {
    console.error('Error cargando dashboard recepcionista:', error);
    throw error;
  }
};

// ============================================
// Búsqueda rápida de pacientes
// ============================================
export const buscarPacienteRapido = async (termino: string): Promise<Paciente[]> => {
  // Primero intenta buscar por documento (exacto)
  const porDocumento = await buscarPacientePorDocumento(termino);
  if (porDocumento) {
    return [porDocumento];
  }

  // Si no encuentra, busca por nombre (parcial)
  return buscarPacientesPorNombre(termino);
};

// ============================================
// Marcar llegada y notificar médico
// ============================================
export const registrarLlegadaPaciente = async (
  citaId: number, 
  medicoId: number, 
  pacienteNombre: string
) => {
  try {
    // 1. Marcar la cita como confirmada
    const citaActualizada = await marcarLlegadaPaciente(citaId);

    // 2. Notificar al médico
    await notificarPacienteLlego(medicoId, pacienteNombre, citaId);

    return citaActualizada;
  } catch (error) {
    console.error('Error registrando llegada:', error);
    throw error;
  }
};

// ============================================
// Obtener citas con filtros útiles
// ============================================
export const getCitasDelDia = async () => {
  const citas = await getCitasHoy();
  
  return {
    todas: citas,
    pendientes: citas.filter(c => c.estado === 'pendiente'),
    confirmadas: citas.filter(c => c.estado === 'confirmada'),
    completadas: citas.filter(c => c.estado === 'completada'),
    canceladas: citas.filter(c => c.estado === 'cancelada'),
  };
};

// ============================================
// Estadísticas rápidas para recepcionista
// ============================================
export const getEstadisticasRecepcionista = async () => {
  const [estadisticas, citasHoy, pacientes] = await Promise.all([
    getEstadisticas(),
    getCitasHoy(),
    getPacientes()
  ]);

  return {
    totalPacientes: pacientes.length,
    citasHoy: citasHoy.length,
    citasPendientes: citasHoy.filter(c => c.estado === 'pendiente').length,
    citasConfirmadas: citasHoy.filter(c => c.estado === 'confirmada').length,
    citasCompletadas: estadisticas.citasCompletadas || 0,
    porcentajeAsistencia: estadisticas.porcentajeAsistencia || 0,
  };
};
