import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { HistoriaClinica, Paciente, ProfesionalSalud } from "@/types";
import { generateHistoriaPDF } from "@/lib/pdfGenerator";
import { toast } from "sonner";

interface Props {
  historias: HistoriaClinica[];
  pacientes: Paciente[];
  profesionales: ProfesionalSalud[];
}

export default function HistoriaClinicaTable({ historias, pacientes, profesionales }: Props) {
  const getPacienteNombre = (id: number) => pacientes.find(p => p.id === id)?.nombre || "Desconocido";
  const getProfesionalNombre = (id: number) => profesionales.find(p => p.id === id)?.nombre || "Desconocido";

  const handleDownloadPDF = (historia: HistoriaClinica) => {
    const paciente = pacientes.find(p => p.id === historia.pacienteId);
    const profesional = profesionales.find(p => p.id === historia.profesionalId);
    
    if (paciente && profesional) {
      generateHistoriaPDF(historia, paciente, profesional);
      toast.success("PDF generado exitosamente");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Listado de Historias Clínicas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Profesional</TableHead>
                <TableHead>Diagnóstico</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No hay historias clínicas registradas
                  </TableCell>
                </TableRow>
              ) : (
                historias.map((historia) => (
                  <TableRow key={historia.id}>
                    <TableCell>{new Date(historia.fecha).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{getPacienteNombre(historia.pacienteId)}</TableCell>
                    <TableCell>{getProfesionalNombre(historia.profesionalId)}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {historia.diagnostico}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadPDF(historia)}
                          className="gap-1"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
