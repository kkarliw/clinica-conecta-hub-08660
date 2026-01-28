import jsPDF from 'jspdf';
import type { HistoriaClinica, Paciente, ProfesionalSalud } from '@/types';

export const generateHistoriaPDF = (
  historia: HistoriaClinica,
  paciente: Paciente,
  profesional: ProfesionalSalud
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
  doc.text('Historia Clínica', pageWidth / 2, yPos, { align: 'center' });
  
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
  doc.text(`Fecha de Nacimiento: ${paciente.fechaNacimiento}`, 20, yPos);
  
  yPos += 7;
  doc.text(`Contacto: ${paciente.telefono}`, 20, yPos);
  
  if (paciente.numeroDocumento) {
    yPos += 7;
    doc.text(`Documento: ${paciente.numeroDocumento}`, 20, yPos);
  }

  yPos += 12;

  // Información del profesional
  doc.setFont(undefined, 'bold');
  doc.text('Profesional de la Salud', 20, yPos);
  
  yPos += 8;
  doc.setFont(undefined, 'normal');
  doc.text(`Nombre: ${profesional.nombre}`, 20, yPos);
  
  yPos += 7;
  doc.text(`Especialidad: ${profesional.especialidad}`, 20, yPos);

  yPos += 12;

  // Fecha de la consulta
  doc.setFont(undefined, 'bold');
  doc.text('Fecha de Consulta', 20, yPos);
  
  yPos += 8;
  doc.setFont(undefined, 'normal');
  doc.text(new Date(historia.fecha).toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), 20, yPos);

  yPos += 12;

  // Motivo de consulta
  doc.setFont(undefined, 'bold');
  doc.text('Motivo de Consulta', 20, yPos);
  
  yPos += 8;
  doc.setFont(undefined, 'normal');
  const motivoLines = doc.splitTextToSize(historia.motivoConsulta, pageWidth - 40);
  doc.text(motivoLines, 20, yPos);
  yPos += motivoLines.length * 7 + 5;

  // Diagnóstico
  doc.setFont(undefined, 'bold');
  doc.text('Diagnóstico', 20, yPos);
  
  yPos += 8;
  doc.setFont(undefined, 'normal');
  const diagnosticoLines = doc.splitTextToSize(historia.diagnostico, pageWidth - 40);
  doc.text(diagnosticoLines, 20, yPos);
  yPos += diagnosticoLines.length * 7 + 5;

  // Check if we need a new page
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // Tratamiento
  doc.setFont(undefined, 'bold');
  doc.text('Tratamiento', 20, yPos);
  
  yPos += 8;
  doc.setFont(undefined, 'normal');
  const tratamientoLines = doc.splitTextToSize(historia.tratamiento, pageWidth - 40);
  doc.text(tratamientoLines, 20, yPos);
  yPos += tratamientoLines.length * 7 + 5;

  // Receta médica
  if (historia.formulaMedica) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFont(undefined, 'bold');
    doc.text('Fórmula Médica', 20, yPos);
    
    yPos += 8;
    doc.setFont(undefined, 'normal');
    const recetaLines = doc.splitTextToSize(historia.formulaMedica, pageWidth - 40);
    doc.text(recetaLines, 20, yPos);
    yPos += recetaLines.length * 7 + 5;
  }

  // Incapacidad
  if (historia.requiereIncapacidad) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFont(undefined, 'bold');
    doc.text('Requiere Incapacidad: Sí', 20, yPos);
    yPos += 8;
  }

  // Observaciones
  if (historia.observaciones) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFont(undefined, 'bold');
    doc.text('Observaciones', 20, yPos);
    
    yPos += 8;
    doc.setFont(undefined, 'normal');
    const obsLines = doc.splitTextToSize(historia.observaciones, pageWidth - 40);
    doc.text(obsLines, 20, yPos);
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save
  const fileName = `historia_clinica_${paciente.nombre.replace(/\s+/g, '_')}_${new Date(historia.fecha).toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
