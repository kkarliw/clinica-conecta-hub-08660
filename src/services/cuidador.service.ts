import api from '@/lib/api';
import type { CuidadorPaciente, CitaMedica, Acompanamiento, ReporteDiario, Autorizacion } from '@/types';

// ============================================
// RELACIÓN CUIDADOR-PACIENTE
// ============================================

export const getPacientesCuidador = async (cuidadorId: number): Promise<CuidadorPaciente[]> => {
  const response = await api.get<CuidadorPaciente[]>(`/cuidadores/${cuidadorId}/pacientes`);
  return response.data;
};

export const vincularPaciente = async (cuidadorId: number, payload: Partial<CuidadorPaciente>): Promise<CuidadorPaciente> => {
  const response = await api.post<CuidadorPaciente>(`/cuidadores/${cuidadorId}/pacientes`, payload);
  return response.data;
};

export const desvincularPaciente = async (cuidadorId: number, pacienteRelId: number): Promise<void> => {
  await api.delete(`/cuidadores/${cuidadorId}/pacientes/${pacienteRelId}`);
};

// ============================================
// AGENDAR CITAS COMO CUIDADOR
// ============================================

export const agendarCitaComoCuidador = async (payload: {
  pacienteId: number;
  profesionalId: number;
  especialidad?: string;
  fechaHora: string;
  motivo: string;
  solicitadoPorCuidadorId: number;
}): Promise<CitaMedica> => {
  const response = await api.post<CitaMedica>('/citas', payload);
  return response.data;
};

export const getProfesionalesPorEspecialidad = async (especialidad: string) => {
  const response = await api.get(`/profesionales?especialidad=${especialidad}`);
  return response.data;
};

export const getDisponibilidadProfesional = async (profesionalId: number, fecha: string) => {
  const response = await api.get(`/profesionales/${profesionalId}/disponibilidad?fecha=${fecha}`);
  return response.data;
};

// ============================================
// ACOMPAÑAMIENTO Y PERSONAL DE APOYO
// ============================================

export const solicitarAcompanamiento = async (citaId: number, payload: {
  solicitanteCuidadorId: number;
  tipoPersonal: 'ENFERMERA' | 'FISIOTERAPEUTA' | 'AUXILIAR';
  horaSalida?: string;
  lugarRecogida?: string;
  transporte?: boolean | string;
}): Promise<Acompanamiento> => {
  const response = await api.post<Acompanamiento>(`/citas/${citaId}/solicitar-acompanamiento`, payload);
  return response.data;
};

export const getAcompanamientos = async (citaId: number): Promise<Acompanamiento[]> => {
  const response = await api.get<Acompanamiento[]>(`/citas/${citaId}/acompaniamientos`);
  return response.data;
};

export const actualizarEstadoAcompanamiento = async (citaId: number, acomId: number, estado: string): Promise<Acompanamiento> => {
  const response = await api.put<Acompanamiento>(`/citas/${citaId}/acompaniamientos/${acomId}/estado`, { estado });
  return response.data;
};

export const marcarLlegadaAcompanamiento = async (acomId: number): Promise<Acompanamiento> => {
  const response = await api.put<Acompanamiento>(`/acompaniamientos/${acomId}/llegada`);
  return response.data;
};

export const finalizarAcompanamiento = async (acomId: number): Promise<Acompanamiento> => {
  const response = await api.put<Acompanamiento>(`/acompaniamientos/${acomId}/finalizar`);
  return response.data;
};

// ============================================
// REGISTRO DIARIO
// ============================================

export const registrarReporteDiario = async (pacienteId: number, payload: Partial<ReporteDiario>): Promise<ReporteDiario> => {
  const response = await api.post<ReporteDiario>(`/pacientes/${pacienteId}/reportes`, payload);
  return response.data;
};

export const getReportesDiarios = async (pacienteId: number): Promise<ReporteDiario[]> => {
  const response = await api.get<ReporteDiario[]>(`/pacientes/${pacienteId}/reportes`);
  return response.data;
};

// ============================================
// AUTORIZACIONES Y PERMISOS
// ============================================

export const getAutorizaciones = async (pacienteId: number): Promise<Autorizacion[]> => {
  const response = await api.get<Autorizacion[]>(`/pacientes/${pacienteId}/autorizaciones`);
  return response.data;
};

export const crearAutorizacion = async (pacienteId: number, payload: Partial<Autorizacion>): Promise<Autorizacion> => {
  const response = await api.post<Autorizacion>(`/pacientes/${pacienteId}/autorizaciones`, payload);
  return response.data;
};

// ============================================
// VINCULAR ENFERMERA FIJA
// ============================================

export const vincularEnfermeraFija = async (pacienteId: number, enfermeraId: number): Promise<any> => {
  const response = await api.post(`/pacientes/${pacienteId}/vincular-enfermera`, {
    enfermeraId,
    rol: 'ENFERMERA_FIJA'
  });
  return response.data;
};

// ============================================
// DASHBOARD CUIDADOR
// ============================================

export const getDashboardCuidador = async (cuidadorId: number) => {
  const [pacientes, notificaciones] = await Promise.all([
    getPacientesCuidador(cuidadorId),
    api.get(`/notificaciones/${cuidadorId}/no-leidas`).then(res => res.data)
  ]);

  return { pacientes, notificaciones };
};
