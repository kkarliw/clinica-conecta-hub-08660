import api from '@/lib/api';
import type { PanelSalud, SignosVitales, Vacuna } from '@/types';

// ============================================
// PANEL DE SALUD - Conectado a Backend Java
// ============================================

export const getPanelSalud = async (pacienteId: number): Promise<PanelSalud> => {
  const response = await api.get<PanelSalud>(`/pacientes/${pacienteId}/panel-salud`);
  return response.data;
};

export const getSignosVitales = async (pacienteId: number): Promise<SignosVitales[]> => {
  const response = await api.get<SignosVitales[]>(`/pacientes/${pacienteId}/signos-vitales`);
  return response.data;
};

export const getUltimosSignosVitales = async (pacienteId: number): Promise<SignosVitales> => {
  const response = await api.get<SignosVitales>(`/pacientes/${pacienteId}/signos-vitales/ultimo`);
  return response.data;
};

export const createSignosVitales = async (pacienteId: number, data: Omit<SignosVitales, 'id' | 'pacienteId'>): Promise<SignosVitales> => {
  const response = await api.post<SignosVitales>(`/pacientes/${pacienteId}/signos-vitales`, data);
  return response.data;
};

export const getVacunas = async (pacienteId: number): Promise<Vacuna[]> => {
  const response = await api.get<Vacuna[]>(`/pacientes/${pacienteId}/vacunas`);
  return response.data;
};

export const getVacunasPendientes = async (pacienteId: number): Promise<Vacuna[]> => {
  const response = await api.get<Vacuna[]>(`/pacientes/${pacienteId}/vacunas/pendientes`);
  return response.data;
};

export const createVacuna = async (pacienteId: number, data: Omit<Vacuna, 'id' | 'pacienteId'>): Promise<Vacuna> => {
  const response = await api.post<Vacuna>(`/pacientes/${pacienteId}/vacunas`, data);
  return response.data;
};

export const updateVacuna = async (pacienteId: number, vacunaId: number, data: Partial<Vacuna>): Promise<Vacuna> => {
  const response = await api.put<Vacuna>(`/pacientes/${pacienteId}/vacunas/${vacunaId}`, data);
  return response.data;
};
