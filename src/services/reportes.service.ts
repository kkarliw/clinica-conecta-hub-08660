import api from '@/lib/api';
import type { ReporteDiario } from '@/types';

// ============================================
// REPORTES DIARIOS - Conectado a Backend Java
// ============================================

export const createReporteDiario = async (data: Omit<ReporteDiario, 'id'>): Promise<ReporteDiario> => {
  const response = await api.post<ReporteDiario>('/reportes-diarios', data);
  return response.data;
};

export const getReportesPorPaciente = async (pacienteId: number): Promise<ReporteDiario[]> => {
  const response = await api.get<ReporteDiario[]>(`/reportes-diarios/paciente/${pacienteId}`);
  return response.data;
};

export const getReporteById = async (id: number): Promise<ReporteDiario> => {
  const response = await api.get<ReporteDiario>(`/reportes-diarios/${id}`);
  return response.data;
};

export const updateReporteDiario = async (id: number, data: Partial<ReporteDiario>): Promise<ReporteDiario> => {
  const response = await api.put<ReporteDiario>(`/reportes-diarios/${id}`, data);
  return response.data;
};
