import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface FiltrosDashboardProps {
  profesionales: Array<{ id: number; nombre: string; apellido: string; especialidad: string }>;
  onFiltrar: (filtros: FiltrosState) => void;
}

export interface FiltrosState {
  desde: string;
  hasta: string;
  medicoId?: number;
  especialidad?: string;
}

export function FiltrosDashboard({ profesionales, onFiltrar }: FiltrosDashboardProps) {
  const [filtros, setFiltros] = useState<FiltrosState>({
    desde: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1).toISOString().split('T')[0],
    hasta: new Date().toISOString().split('T')[0],
  });

  const especialidades = [...new Set(profesionales.map(p => p.especialidad))];

  const handleAplicarFiltros = () => {
    onFiltrar(filtros);
  };

  return (
    <Card className="sticky top-0 z-10 shadow-md">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="desde">Desde</Label>
            <Input
              id="desde"
              type="date"
              value={filtros.desde}
              onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hasta">Hasta</Label>
            <Input
              id="hasta"
              type="date"
              value={filtros.hasta}
              onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Por Médico</Label>
            <Select
              value={filtros.medicoId?.toString() || "all"}
              onValueChange={(value) => setFiltros({ 
                ...filtros, 
                medicoId: value === "all" ? undefined : parseInt(value) 
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los médicos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los médicos</SelectItem>
                {profesionales.map(p => (
                  <SelectItem key={p.id} value={p.id!.toString()}>
                    {p.nombre} {p.apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Por Especialidad</Label>
            <Select
              value={filtros.especialidad || "all"}
              onValueChange={(value) => setFiltros({ 
                ...filtros, 
                especialidad: value === "all" ? undefined : value 
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las especialidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las especialidades</SelectItem>
                {especialidades.map(esp => (
                  <SelectItem key={esp} value={esp}>
                    {esp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleAplicarFiltros} className="gap-2">
            <Filter className="w-4 h-4" />
            Aplicar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
