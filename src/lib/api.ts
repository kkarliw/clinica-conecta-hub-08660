import axios from 'axios';
import type { Paciente, ProfesionalSalud, CitaMedica } from '@/types';

const API_BASE_URL = 'http://localhost:4567/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('healix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Pacientes
export const getPacientes = async (): Promise<Paciente[]> => {
  const response = await api.get<Paciente[]>('/pacientes');
  return response.data;
};

export const createPaciente = async (paciente: Paciente): Promise<Paciente> => {
  const response = await api.post<Paciente>('/pacientes', paciente);
  return response.data;
};

export const updatePaciente = async (id: number, paciente: Partial<Paciente>): Promise<Paciente> => {
  const response = await api.put<Paciente>(`/pacientes/${id}`, paciente);
  return response.data;
};

// Profesionales
export const getProfesionales = async (): Promise<ProfesionalSalud[]> => {
  const response = await api.get<ProfesionalSalud[]>('/profesionales');
  return response.data;
};

export const createProfesional = async (profesional: ProfesionalSalud): Promise<ProfesionalSalud> => {
  const response = await api.post<ProfesionalSalud>('/profesionales', profesional);
  return response.data;
};

export const updateProfesional = async (id: number, profesional: Partial<ProfesionalSalud>): Promise<ProfesionalSalud> => {
  const response = await api.put<ProfesionalSalud>(`/profesionales/${id}`, profesional);
  return response.data;
};

// Citas
export const getCitas = async (): Promise<CitaMedica[]> => {
  const response = await api.get<CitaMedica[]>('/citas');
  return response.data;
};

export const getCitasPaciente = async (pacienteId: number): Promise<CitaMedica[]> => {
  const response = await api.get<CitaMedica[]>(`/citas/paciente/${pacienteId}`);
  return response.data;
};

export const getCitasMedico = async (medicoId: number): Promise<CitaMedica[]> => {
  const response = await api.get<CitaMedica[]>(`/citas/medico/${medicoId}`);
  return response.data;
};

export const getCitaById = async (id: number): Promise<CitaMedica> => {
  const response = await api.get<CitaMedica>(`/citas/${id}`);
  return response.data;
};

export const createCita = async (cita: any): Promise<CitaMedica> => {
  const response = await api.post<CitaMedica>('/citas', cita);
  return response.data;
};

export const updateCita = async (id: number, cita: Partial<CitaMedica>): Promise<CitaMedica> => {
  const response = await api.put<CitaMedica>(`/citas/${id}`, cita);
  return response.data;
};

export const deleteCita = async (id: number): Promise<void> => {
  await api.delete(`/citas/${id}`);
};

// Historias Clínicas
export const getHistoriasClinicas = async (): Promise<any[]> => {
  const response = await api.get<any[]>('/historias-clinicas');
  return response.data;
};

export const getHistoriasClinicasPaciente = async (pacienteId: number): Promise<any[]> => {
  const response = await api.get<any[]>(`/historias-clinicas/paciente/${pacienteId}`);
  return response.data;
};

export const createHistoriaClinica = async (historia: any): Promise<any> => {
  const response = await api.post<any>('/historial', historia);
  return response.data;
};

// Incapacidad PDF
export const getIncapacidadPDF = async (incapacidadId: number): Promise<Blob> => {
  const response = await api.post(`/incapacidad/pdf`, { incapacidadId }, {
    responseType: 'blob',
  });
  return response.data;
};

// Estadísticas
export const getEstadisticas = async (): Promise<any> => {
  const response = await api.get('/estadisticas');
  return response.data;
};

export const getEstadisticasMedico = async (medicoId: number): Promise<any> => {
  const response = await api.get(`/estadisticas/medico/${medicoId}`);
  return response.data;
};

export default api;
