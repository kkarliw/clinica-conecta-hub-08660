import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CitaMedica, Paciente, ProfesionalSalud } from "@/types";
import { Calendar, User, Stethoscope, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CitaTableProps {
  citas: CitaMedica[];
  pacientes: Paciente[];
  profesionales: ProfesionalSalud[];
}

export default function CitaTable({ citas, pacientes, profesionales }: CitaTableProps) {
  const getPacienteNombre = (id: number) => {
    return pacientes.find((p) => p.id === id)?.nombre || "Desconocido";
  };

  const getProfesionalNombre = (id: number) => {
    return profesionales.find((p) => p.id === id)?.nombre || "Desconocido";
  };

  const formatearFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), "PPP 'a las' p", { locale: es });
    } catch {
      return fecha;
    }
  };

  const esFutura = (fecha: string) => {
    return new Date(fecha) > new Date();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Lista de Citas Médicas ({citas.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {citas.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay citas agendadas</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Paciente</TableHead>
                  <TableHead className="font-semibold">Profesional</TableHead>
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="font-semibold">Motivo</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {citas.map((cita) => (
                  <TableRow key={cita.id} className="hover:bg-accent/50 transition-colors">
                    <TableCell className="font-medium">
                      <Badge variant="outline">{cita.id}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="font-medium">{getPacienteNombre(cita.pacienteId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-secondary" />
                        <span className="font-medium">{getProfesionalNombre(cita.profesionalId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formatearFecha(cita.fecha)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        {cita.motivo}
                      </div>
                    </TableCell>
                    <TableCell>
                      {esFutura(cita.fecha) ? (
                        <Badge className="bg-secondary text-secondary-foreground">Próxima</Badge>
                      ) : (
                        <Badge variant="outline">Completada</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
