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
  apellido?: string;
  correo: string;
  rol: 'PACIENTE' | 'MEDICO' | 'RECEPCIONISTA' | 'ADMIN' | 'CUIDADOR';
  verificado: boolean;
  especialidad?: string;
  telefono?: string;
  numeroLicencia?: string;
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
