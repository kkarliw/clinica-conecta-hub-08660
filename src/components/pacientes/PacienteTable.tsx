import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Paciente } from "@/types";
import { Users, Mail, Phone, MapPin } from "lucide-react";

interface PacienteTableProps {
  pacientes: Paciente[];
}

export default function PacienteTable({ pacientes }: PacienteTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Lista de Pacientes ({pacientes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pacientes.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay pacientes registrados</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Nombre</TableHead>
                  <TableHead className="font-semibold">Documento</TableHead>
                  <TableHead className="font-semibold">Correo</TableHead>
                  <TableHead className="font-semibold">Teléfono</TableHead>
                  <TableHead className="font-semibold">Dirección</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pacientes.map((paciente) => (
                  <TableRow key={paciente.id} className="hover:bg-accent/50 transition-colors">
                    <TableCell className="font-medium">
                      <Badge variant="outline">{paciente.id}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{paciente.nombre} {paciente.apellido}</TableCell>
                    <TableCell>{paciente.numeroDocumento}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {paciente.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {paciente.telefono}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {paciente.direccion}
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
