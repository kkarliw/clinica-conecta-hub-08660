import jsPDF from 'jspdf';
import type { CitaMedica, Paciente } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const generateCitaPDF = (
  cita: CitaMedica,
  paciente: Paciente
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(0, 120, 215);
  doc.text('Healix Pro', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  doc.setFontSize(16);
  doc.text('Comprobante de Cita Médica', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  doc.setDrawColor(0, 120, 215);
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  yPos += 15;

  // Información del paciente
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text('Información del Paciente', 20, yPos);
  
  yPos += 8;
  doc.setFont(undefined, 'normal');
  doc.text(`Nombre: ${paciente.nombre} ${paciente.apellido}`, 20, yPos);
  
  yPos += 7;
  doc.text(`Documento: ${paciente.numeroDocumento}`, 20, yPos);
  
  yPos += 7;
  doc.text(`Contacto: ${paciente.telefono}`, 20, yPos);

  yPos += 12;

  // Información de la cita
  doc.setFont(undefined, 'bold');
  doc.text('Detalles de la Cita', 20, yPos);
  
  yPos += 8;
  doc.setFont(undefined, 'normal');
  doc.text(
    `Fecha: ${format(new Date(cita.fecha), "PPP 'a las' p", { locale: es })}`,
    20,
    yPos
  );
  
  yPos += 7;
  if (cita.profesional) {
    doc.text(
      `Profesional: ${cita.profesional.nombre} ${cita.profesional.apellido}`,
      20,
      yPos
    );
    yPos += 7;
    if (cita.profesional.especialidad) {
      doc.text(`Especialidad: ${cita.profesional.especialidad}`, 20, yPos);
      yPos += 7;
    }
  }
  
  yPos += 5;
  doc.setFont(undefined, 'bold');
  doc.text('Motivo de Consulta:', 20, yPos);
  yPos += 7;
  doc.setFont(undefined, 'normal');
  const motivoLines = doc.splitTextToSize(cita.motivo, pageWidth - 40);
  doc.text(motivoLines, 20, yPos);
  yPos += motivoLines.length * 7 + 10;

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    'Este es un comprobante de cita médica. Por favor preséntese 10 minutos antes de la hora programada.',
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 20,
    { align: 'center' }
  );

  const fileName = `cita_${paciente.nombre.replace(/\s+/g, '_')}_${new Date(cita.fecha).toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export const generatePacienteInfoPDF = (paciente: Paciente) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(0, 120, 215);
  doc.text('Healix Pro', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  doc.setFontSize(16);
  doc.text('Información del Paciente', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  doc.setDrawColor(0, 120, 215);
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  yPos += 15;

  // Datos personales
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text('Datos Personales', 20, yPos);
  
  yPos += 8;
  doc.setFont(undefined, 'normal');
  doc.text(`Nombre Completo: ${paciente.nombre} ${paciente.apellido}`, 20, yPos);
  
  yPos += 7;
  doc.text(`Documento: ${paciente.numeroDocumento}`, 20, yPos);
  
  yPos += 7;
  doc.text(`Fecha de Nacimiento: ${paciente.fechaNacimiento}`, 20, yPos);
  
  yPos += 7;
  doc.text(`Género: ${paciente.genero}`, 20, yPos);

  yPos += 12;

  // Información de contacto
  doc.setFont(undefined, 'bold');
  doc.text('Información de Contacto', 20, yPos);
  
  yPos += 8;
  doc.setFont(undefined, 'normal');
  doc.text(`Email: ${paciente.email}`, 20, yPos);
  
  yPos += 7;
  doc.text(`Teléfono: ${paciente.telefono}`, 20, yPos);
  
  yPos += 7;
  doc.text(`Dirección: ${paciente.direccion}`, 20, yPos);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Generado el ${format(new Date(), 'PPP', { locale: es })}`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );

  const fileName = `paciente_${paciente.nombre.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};
