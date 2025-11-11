import Papa from 'papaparse';
import { format } from 'date-fns';

interface CSVExportConfig {
  data: any[];
  fileName: string;
}

export const exportToCSV = ({ data, fileName }: CSVExportConfig) => {
  // Convertir a CSV
  const csv = Papa.unparse(data, {
    delimiter: ',',
    header: true,
  });

  // Agregar BOM para Excel
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csv;

  // Crear blob
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });

  // Crear link de descarga
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const timestamp = format(new Date(), 'yyyy-MM-dd_HHmmss');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${timestamp}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
