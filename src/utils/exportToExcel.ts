import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ExportConfig {
  data: any[];
  fileName: string;
  sheetName: string;
  userName?: string;
  dateRange?: { desde: string; hasta: string };
}

export const exportToExcel = ({ data, fileName, sheetName, userName, dateRange }: ExportConfig) => {
  // Crear nuevo workbook
  const wb = XLSX.utils.book_new();

  // Crear hoja de resumen
  const summaryData = [
    ['REPORTE GENERADO'],
    [''],
    ['Fecha de Exportación:', format(new Date(), 'PPP', { locale: es })],
    ['Usuario:', userName || 'Sistema'],
    ...(dateRange ? [
      ['Rango de Fechas:', `${dateRange.desde} - ${dateRange.hasta}`]
    ] : []),
    ['Total de Registros:', data.length.toString()],
    [''],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

  // Estilo para resumen
  wsSummary['!cols'] = [{ width: 25 }, { width: 30 }];

  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen');

  // Crear hoja de datos
  const ws = XLSX.utils.json_to_sheet(data);

  // Autoajustar columnas
  const colWidths = Object.keys(data[0] || {}).map(key => {
    const maxLength = Math.max(
      key.length,
      ...data.map(row => String(row[key] || '').length)
    );
    return { width: Math.min(maxLength + 2, 50) };
  });

  ws['!cols'] = colWidths;

  // Agregar hoja al workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Generar archivo
  const timestamp = format(new Date(), 'yyyy-MM-dd_HHmmss');
  XLSX.writeFile(wb, `${fileName}_${timestamp}.xlsx`);
};

export const formatPacientesForExcel = (pacientes: any[]) => {
  return pacientes.map(p => ({
    'Documento': p.numeroDocumento,
    'Nombre Completo': `${p.nombre} ${p.apellido}`,
    'Email': p.email,
    'Teléfono': p.telefono,
    'Fecha Nacimiento': p.fechaNacimiento,
    'Edad': calcularEdad(p.fechaNacimiento),
    'Género': p.genero,
    'Dirección': p.direccion,
    'Fecha Registro': p.created_at ? format(new Date(p.created_at), 'dd/MM/yyyy') : 'N/A',
  }));
};

export const formatCitasForExcel = (citas: any[]) => {
  return citas.map(c => ({
    'ID Cita': c.id,
    'Fecha': format(new Date(c.fecha), 'dd/MM/yyyy'),
    'Hora': format(new Date(c.fecha), 'HH:mm'),
    'Paciente': c.paciente ? `${c.paciente.nombre} ${c.paciente.apellido}` : c.pacienteNombre || 'N/A',
    'Documento Paciente': c.paciente?.numeroDocumento || 'N/A',
    'Médico': c.profesional ? `${c.profesional.nombre} ${c.profesional.apellido}` : c.profesionalNombre || 'N/A',
    'Especialidad': c.profesional?.especialidad || 'N/A',
    'Motivo': c.motivo,
    'Estado': c.estado || 'Pendiente',
  }));
};

export const formatHistoriasForExcel = (historias: any[]) => {
  return historias.map(h => ({
    'ID Historia': h.id,
    'Fecha': format(new Date(h.fecha), 'dd/MM/yyyy'),
    'Paciente': h.pacienteNombre || 'N/A',
    'Médico': h.profesionalNombre || 'N/A',
    'Motivo Consulta': h.motivoConsulta,
    'Diagnóstico': h.diagnostico,
    'Tratamiento': h.tratamiento,
    'Observaciones': h.observaciones || '',
    'Requiere Incapacidad': h.requiereIncapacidad ? 'Sí' : 'No',
    'Fórmula Médica': h.formulaMedica || '',
  }));
};

export const formatSignosVitalesForExcel = (signos: any[]) => {
  return signos.map(s => ({
    'Paciente': s.pacienteNombre || 'N/A',
    'Documento': s.pacienteDocumento || 'N/A',
    'Fecha': format(new Date(s.fecha), 'dd/MM/yyyy'),
    'Hora': format(new Date(s.fecha), 'HH:mm'),
    'Temperatura (°C)': s.temperatura || 'N/A',
    'Presión Arterial': s.presionArterial || 'N/A',
    'Frecuencia Cardíaca': s.frecuenciaCardiaca || 'N/A',
    'Saturación Oxígeno (%)': s.saturacionOxigeno || 'N/A',
  }));
};

const calcularEdad = (fechaNacimiento: string): number => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};
