import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProfesionalSalud } from "@/types";
import { Stethoscope, Mail, Phone, Filter } from "lucide-react";

interface ProfesionalTableProps {
  profesionales: ProfesionalSalud[];
}

export default function ProfesionalTable({ profesionales }: ProfesionalTableProps) {
  const [filtroEspecialidad, setFiltroEspecialidad] = useState<string>("todas");

  const especialidades = Array.from(new Set(profesionales.map((p) => p.especialidad)));

  const profesionalesFiltrados = filtroEspecialidad === "todas"
    ? profesionales
    : profesionales.filter((p) => p.especialidad === filtroEspecialidad);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-secondary" />
            Lista de Profesionales ({profesionalesFiltrados.length})
          </CardTitle>
          {especialidades.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filtroEspecialidad} onValueChange={setFiltroEspecialidad}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las especialidades</SelectItem>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp} value={esp}>
                      {esp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {profesionales.length === 0 ? (
          <div className="text-center py-12">
            <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay profesionales registrados</p>
          </div>
        ) : profesionalesFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay profesionales con esta especialidad</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Nombre</TableHead>
                  <TableHead className="font-semibold">Especialidad</TableHead>
                  <TableHead className="font-semibold">Correo</TableHead>
                  <TableHead className="font-semibold">Teléfono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profesionalesFiltrados.map((profesional) => (
                  <TableRow key={profesional.id} className="hover:bg-accent/50 transition-colors">
                    <TableCell className="font-medium">
                      <Badge variant="outline">{profesional.id}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{profesional.nombre} {profesional.apellido}</TableCell>
                    <TableCell>
                      <Badge className="bg-secondary text-secondary-foreground">
                        {profesional.especialidad}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {profesional.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {profesional.telefono}
                      </div>
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
