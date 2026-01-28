import axios from 'axios';
import type { Paciente, ProfesionalSalud, CitaMedica } from '@/types';
import { toast } from 'sonner';

// Backend Java (Spark Framework) - Puerto 4567
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4567/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para agregar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('healix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('healix_token');
      localStorage.removeItem('healix_user');
      window.location.href = '/login';
    } else if (status === 403) {
      // Acceso denegado
      const serverMessage = error.response?.data?.message || 'No tienes permisos para realizar esta acción.';
      try { toast.error('Acceso denegado', { description: serverMessage }); } catch (_) {}
    }
    return Promise.reject(error);
  }
);

// ============================================
// PACIENTES
// ============================================
export const getPacientes = async (): Promise<Paciente[]> => {
  const response = await api.get<Paciente[]>('/pacientes');
  return response.data;
};

export const getPacienteById = async (id: number): Promise<Paciente> => {
  const response = await api.get<Paciente>(`/pacientes/${id}`);
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

export const deletePaciente = async (id: number): Promise<void> => {
  await api.delete(`/pacientes/${id}`);
};

// ⚠️ FALTANTE EN BACKEND - Búsqueda por nombre
export const buscarPacientesPorNombre = async (nombre: string): Promise<Paciente[]> => {
  // TEMPORAL: Filtrar en frontend hasta que exista el endpoint
  const pacientes = await getPacientes();
  return pacientes.filter(p => 
    p.nombre?.toLowerCase().includes(nombre.toLowerCase())
  );
  // TODO: Implementar en backend: GET /api/pacientes/buscar?nombre=${nombre}
};

// ⚠️ FALTANTE EN BACKEND - Búsqueda por documento
export const buscarPacientePorDocumento = async (documento: string): Promise<Paciente | null> => {
  // TEMPORAL: Filtrar en frontend hasta que exista el endpoint
  const pacientes = await getPacientes();
  return pacientes.find(p => p.numeroDocumento === documento) || null;
  // TODO: Implementar en backend: GET /api/pacientes/buscar?documento=${documento}
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

// ============================================
// CITAS
// ============================================
export const getCitas = async (): Promise<CitaMedica[]> => {
  const response = await api.get<CitaMedica[]>('/citas');
  return response.data;
};

export const getCitaById = async (id: number): Promise<CitaMedica> => {
  const response = await api.get<CitaMedica>(`/citas/${id}`);
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

export const createCita = async (cita: any): Promise<CitaMedica> => {
  // Formato esperado por el backend Java: paciente y profesional como objetos con id
  const citaData = {
    fecha: cita.fecha || cita.fechaHora,
    motivo: cita.motivo,
    paciente: { id: cita.pacienteId },
    profesional: { id: cita.profesionalId }
  };
  
  const response = await api.post<CitaMedica>('/citas', citaData);
  return response.data;
};

export const updateCita = async (id: number, cita: Partial<CitaMedica>): Promise<CitaMedica> => {
  const response = await api.put<CitaMedica>(`/citas/${id}`, cita);
  return response.data;
};

export const deleteCita = async (id: number): Promise<void> => {
  await api.delete(`/citas/${id}`);
};

// ⚠️ FALTANTE EN BACKEND - Citas del día
export const getCitasHoy = async (): Promise<CitaMedica[]> => {
  // TEMPORAL: Filtrar en frontend
  const todasLasCitas = await getCitas();
  const hoy = new Date().toISOString().split('T')[0];
  return todasLasCitas.filter(cita => cita.fecha.startsWith(hoy));
  // TODO: Implementar en backend: GET /api/citas/hoy
};

// ⚠️ FALTANTE EN BACKEND - Marcar llegada de paciente
export const marcarLlegadaPaciente = async (citaId: number): Promise<CitaMedica> => {
  // TEMPORAL: Actualizar estado a "confirmada"
  return updateCita(citaId, { estado: 'confirmada' });
  // TODO: Implementar en backend: PUT /api/citas/:id/marcar-llegada
};

// ⚠️ FALTANTE EN BACKEND - Citas próximas
export const getCitasProximas = async (dias: number = 7): Promise<CitaMedica[]> => {
  // TEMPORAL: Filtrar en frontend
  const todasLasCitas = await getCitas();
  const hoy = new Date();
  const futuro = new Date();
  futuro.setDate(futuro.getDate() + dias);
  
  return todasLasCitas.filter(cita => {
    const fechaCita = new Date(cita.fecha);
    return fechaCita >= hoy && fechaCita <= futuro;
  });
  // TODO: Implementar en backend: GET /api/citas/proximas?dias=${dias}
};

// Historias Clínicas
export const getHistoriasClinicas = async (): Promise<any[]> => {
  const response = await api.get<any[]>('/historias');
  return response.data;
};

export const getHistoriasClinicasPaciente = async (pacienteId: number): Promise<any[]> => {
  const response = await api.get<any[]>(`/historias/paciente/${pacienteId}`);
  return response.data;
};

export const createHistoriaClinica = async (historia: any): Promise<any> => {
  const historiaData = {
    pacienteId: historia.pacienteId,
    profesionalId: historia.profesionalId,
    fecha: historia.fecha,
    motivoConsulta: historia.motivoConsulta,
    diagnostico: historia.diagnostico,
    tratamiento: historia.tratamiento,
    observaciones: historia.observaciones,
    formulaMedica: historia.formulaMedica,
    requiereIncapacidad: historia.requiereIncapacidad || false
  };
  const response = await api.post<any>('/historias', historiaData);
  return response.data;
};

export const updateHistoriaClinica = async (id: number, historia: any): Promise<any> => {
  const response = await api.put<any>(`/historias/${id}`, historia);
  return response.data;
};

export const deleteHistoriaClinica = async (id: number): Promise<void> => {
  await api.delete(`/historias/${id}`);
};

// Incapacidad PDF
export const getIncapacidadPDF = async (incapacidadId: number): Promise<Blob> => {
  const response = await api.post(`/incapacidad/pdf`, { incapacidadId }, {
    responseType: 'blob',
  });
  return response.data;
};

// ============================================
// ESTADÍSTICAS
// ============================================
export const getEstadisticas = async (): Promise<any> => {
  const response = await api.get('/estadisticas');
  return response.data;
};

export const getEstadisticasMedico = async (medicoId: number): Promise<any> => {
  const response = await api.get(`/estadisticas/medico/${medicoId}`);
  return response.data;
};

// ============================================
// PANEL DE SALUD DEL PACIENTE
// ============================================
export const getPanelSaludPaciente = async (pacienteId: number): Promise<any> => {
  const response = await api.get(`/pacientes/${pacienteId}/panel-salud`);
  return response.data;
};

// ============================================
// SIGNOS VITALES
// ============================================
export const getSignosVitalesPorPaciente = async (pacienteId: number): Promise<any[]> => {
  const response = await api.get<any[]>(`/pacientes/${pacienteId}/signos-vitales`);
  return response.data;
};

export const getUltimoSignoVital = async (pacienteId: number): Promise<any> => {
  const response = await api.get<any>(`/pacientes/${pacienteId}/signos-vitales/ultimo`);
  return response.data;
};

export const createSignoVital = async (pacienteId: number, data: any): Promise<any> => {
  const response = await api.post<any>(`/pacientes/${pacienteId}/signos-vitales`, data);
  return response.data;
};

// ============================================
// VACUNAS
// ============================================
export const getVacunasPorPaciente = async (pacienteId: number): Promise<any[]> => {
  const response = await api.get<any[]>(`/pacientes/${pacienteId}/vacunas`);
  return response.data;
};

export const getVacunasPendientes = async (pacienteId: number): Promise<any[]> => {
  const response = await api.get<any[]>(`/pacientes/${pacienteId}/vacunas/pendientes`);
  return response.data;
};

export const createVacuna = async (pacienteId: number, data: any): Promise<any> => {
  const response = await api.post<any>(`/pacientes/${pacienteId}/vacunas`, data);
  return response.data;
};

export const updateVacuna = async (pacienteId: number, vacunaId: number, data: any): Promise<any> => {
  const response = await api.put<any>(`/pacientes/${pacienteId}/vacunas/${vacunaId}`, data);
  return response.data;
};

// ============================================
// NOTIFICACIONES
// ============================================
export const getNotificaciones = async (usuarioId: number): Promise<any[]> => {
  const response = await api.get<any[]>(`/notificaciones/${usuarioId}`);
  return response.data;
};

export const marcarNotificacionLeida = async (notificacionId: number): Promise<any> => {
  const response = await api.put<any>(`/notificaciones/${notificacionId}/leer`);
  return response.data;
};

export const createNotificacion = async (data: any): Promise<any> => {
  const response = await api.post<any>('/notificaciones', data);
  return response.data;
};

// ============================================
// USUARIOS (para perfiles)
// ============================================
export const getMiPerfil = async (): Promise<any> => {
  const response = await api.get('/profesionales/mi-perfil');
  return response.data;
};

export const getUsuarioPerfil = async (usuarioId: number): Promise<any> => {
  const response = await api.get(`/usuarios/${usuarioId}`);
  return response.data;
};

export const updateUsuarioPerfil = async (usuarioId: number, data: any): Promise<any> => {
  const response = await api.put(`/usuarios/${usuarioId}`, data);
  return response.data;
};

export default api;
