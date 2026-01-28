export interface Paciente {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  genero: 'MASCULINO' | 'FEMENINO' | 'OTRO';
}

export interface ProfesionalSalud {
  id?: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  email: string;
  telefono: string;
  numeroLicencia: string;
  consultorioId?: number;
  consultorios?: Consultorio[];
}

export interface CitaMedica {
  id?: number;
  pacienteId: number;
  profesionalId: number;
  consultorioId?: number;
  servicioId?: number;
  fecha: string;
  motivo: string;
  estado?: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  pacienteNombre?: string;
  profesionalNombre?: string;
  notas?: string;
  profesional?: {
    nombre?: string;
    apellido?: string;
    especialidad?: string;
  };
  paciente?: {
    nombre?: string;
    apellido?: string;
  };
  consultorio?: Consultorio;
  servicio?: Servicio;
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
  formulaMedica?: string;
  requiereIncapacidad?: boolean;
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

// ============================================
// MARKETPLACE MULTI-TENANT TYPES
// ============================================

export type UserRole = 'PACIENTE' | 'MEDICO' | 'RECEPCIONISTA' | 'ADMIN' | 'CUIDADOR' | 'CONSULTORIO_ADMIN';

export interface Usuario {
  id: number;
  nombre: string;
  apellido?: string;
  correo: string;
  rol: UserRole;
  verificado: boolean;
  especialidad?: string;
  telefono?: string;
  numeroLicencia?: string;
  consultorioId?: number;
  consultorio?: Consultorio;
}

export interface Consultorio {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  email: string;
  logoUrl?: string;
  bannerUrl?: string;
  horarioAtencion?: Record<string, string>;
  especialidades?: string[];
  activo: boolean;
  verificado: boolean;
  rating?: number;
  totalReviews?: number;
  propietarioId?: number;
  profesionales?: ProfesionalSalud[];
  servicios?: Servicio[];
  createdAt?: string;
}

export interface Servicio {
  id: number;
  consultorioId: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionMinutos: number;
  especialidad?: string;
  activo: boolean;
  consultorio?: Consultorio;
}

export interface ConsultorioStats {
  totalCitas: number;
  citasHoy: number;
  citasPendientes: number;
  ingresosMes: number;
  nuevosPacientesMes: number;
  totalPacientes: number;
  totalProfesionales: number;
  tasaOcupacion: number;
}

export interface HorarioAtencion {
  dia: string;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
}

export interface ConsultorioReview {
  id: number;
  consultorioId: number;
  pacienteId: number;
  rating: number;
  comentario?: string;
  fecha: string;
  pacienteNombre?: string;
}

export interface BusquedaConsultorio {
  ciudad?: string;
  especialidad?: string;
  nombre?: string;
  precioMin?: number;
  precioMax?: number;
  rating?: number;
  page?: number;
  limit?: number;
}

export interface Cuidador {
  id: number;
  nombre: string;
  apellido?: string;
  correo: string;
  telefono: string;
  numeroDocumento?: string;
}

export interface CuidadorPaciente {
  id: number;
  cuidadorId: number;
  pacienteId: number;
  tipoPaciente: 'MENOR' | 'ADULTO_MAYOR' | 'PERSONA_DISCAPACIDAD' | 'RECUPERACION';
  parentesco: 'PADRE' | 'MADRE' | 'TUTOR' | 'HIJO' | 'FAMILIAR' | 'ENFERMERA' | 'AUXILIAR' | 'CONTRATADO';
  documentoAutorizacionUrl?: string;
  permisos: {
    puedeAgendar: boolean;
    puedeCancelar: boolean;
    puedeAccederHistoria: boolean;
    puedeSubirExamenes: boolean;
  };
  fechaVinculacion: string;
  pacienteNombre?: string;
  pacienteEdad?: number;
}

export interface Acompanamiento {
  id: number;
  citaId: number;
  cuidadorId: number;
  personalApoyoId?: number;
  tipoPersonal: 'ENFERMERA' | 'FISIOTERAPEUTA' | 'AUXILIAR';
  transporte: boolean | string;
  horaSalida?: string;
  lugarRecogida?: string;
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'NO_DISPONIBLE' | 'EN_RUTA' | 'LLEGADO' | 'FINALIZADO';
  cita?: CitaMedica;
  personalNombre?: string;
}

export interface ReporteDiario {
  id: number;
  pacienteId: number;
  cuidadorId: number;
  fecha: string;
  resumenDia: string;
  medicamentosTomados: boolean;
  signosVitales?: {
    presionArterial?: string;
    frecuenciaCardiaca?: number;
    temperatura?: number;
    saturacionOxigeno?: number;
  };
  estadoEmocional: 'EXCELENTE' | 'BIEN' | 'REGULAR' | 'MAL' | 'CRITICO';
  observaciones?: string;
  pacienteNombre?: string;
}

export interface Autorizacion {
  id: number;
  pacienteId: number;
  cuidadorId: number;
  quien: string;
  tipoPermiso: string;
  documentoUrl?: string;
  firmado: boolean;
  fechaCreacion: string;
}

export interface Mensaje {
  id: number;
  remitenteId: number;
  destinatarioId: number;
  contenido: string;
  fecha: string;
  leido: boolean;
  tipo: 'normal' | 'sistema';
  remitenteNombre?: string;
}

