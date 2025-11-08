export interface Paciente {
  id?: number;
  nombre: string;
  edad: number;
  correo: string;
  telefono: string;
  direccion: string;
  documento?: string;
  estadoActivo?: boolean;
}

export interface ProfesionalSalud {
  id?: number;
  nombre: string;
  especialidad: string;
  correo: string;
  telefono: string;
}

export interface CitaMedica {
  id?: number;
  pacienteId: number;
  profesionalId: number;
  fecha: string;
  motivo: string;
  estado?: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  pacienteNombre?: string;
  profesionalNombre?: string;
  notas?: string;
}

export interface HistoriaClinica {
  id?: number;
  pacienteId: number;
  profesionalId: number;
  fecha: string;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
  incapacidad?: string;
  recetaMedica?: string;
  pacienteNombre?: string;
  profesionalNombre?: string;
}

export interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  tipo: 'cita' | 'recordatorio' | 'sistema';
}

export interface DashboardStats {
  totalPacientes: number;
  totalProfesionales: number;
  totalCitas: number;
  citasHoy?: number;
}

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: 'paciente' | 'profesional' | 'cuidador' | 'administrador';
  verificado: boolean;
}
