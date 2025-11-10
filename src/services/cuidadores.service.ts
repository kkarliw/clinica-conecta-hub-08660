import api from '@/lib/api';
import type { Cuidador, ReporteDiario } from '@/types';

// ============================================
// CUIDADORES - Conectado a Backend Java
// ============================================

export const getCuidadores = async (): Promise<Cuidador[]> => {
  const response = await api.get<Cuidador[]>('/cuidadores');
  return response.data;
};

export const getCuidadorById = async (id: number): Promise<Cuidador> => {
  const response = await api.get<Cuidador>(`/cuidadores/${id}`);
  return response.data;
};

export const createCuidador = async (data: Omit<Cuidador, 'id'>): Promise<Cuidador> => {
  const response = await api.post<Cuidador>('/cuidadores', data);
  return response.data;
};

export const deleteCuidador = async (id: number): Promise<void> => {
  await api.delete(`/cuidadores/${id}`);
};

export const getReportesCuidador = async (cuidadorId: number): Promise<ReporteDiario[]> => {
  const response = await api.get<ReporteDiario[]>(`/cuidadores/${cuidadorId}/reportes`);
  return response.data;
};
