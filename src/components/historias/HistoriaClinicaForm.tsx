import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { HistoriaClinica, Paciente, ProfesionalSalud } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HistoriaClinica) => void;
  isLoading: boolean;
  pacientes: Paciente[];
  profesionales: ProfesionalSalud[];
}

export default function HistoriaClinicaForm({ isOpen, onClose, onSubmit, isLoading, pacientes, profesionales }: Props) {
  const [formData, setFormData] = useState<Partial<HistoriaClinica>>({
    fecha: new Date().toISOString().split('T')[0],
    motivoConsulta: "",
    diagnostico: "",
    tratamiento: "",
    observaciones: "",
    formulaMedica: "",
    requiereIncapacidad: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as HistoriaClinica);
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      motivoConsulta: "",
      diagnostico: "",
      tratamiento: "",
      observaciones: "",
      formulaMedica: "",
      requiereIncapacidad: false
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Historia Clínica</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pacienteId">Paciente *</Label>
              <Select 
                value={formData.pacienteId?.toString()} 
                onValueChange={(value) => setFormData({ ...formData, pacienteId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map((p) => (
                    <SelectItem key={p.id} value={p.id!.toString()}>
                      {p.nombre} {p.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profesionalId">Profesional *</Label>
              <Select 
                value={formData.profesionalId?.toString()} 
                onValueChange={(value) => setFormData({ ...formData, profesionalId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar profesional" />
                </SelectTrigger>
                <SelectContent>
                  {profesionales.map((p) => (
                    <SelectItem key={p.id} value={p.id!.toString()}>
                      {p.nombre} {p.apellido} - {p.especialidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivoConsulta">Motivo de Consulta *</Label>
            <Textarea
              id="motivoConsulta"
              placeholder="Descripción del motivo de consulta"
              value={formData.motivoConsulta}
              onChange={(e) => setFormData({ ...formData, motivoConsulta: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnostico">Diagnóstico *</Label>
            <Textarea
              id="diagnostico"
              placeholder="Diagnóstico médico"
              value={formData.diagnostico}
              onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tratamiento">Tratamiento *</Label>
            <Textarea
              id="tratamiento"
              placeholder="Plan de tratamiento"
              value={formData.tratamiento}
              onChange={(e) => setFormData({ ...formData, tratamiento: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="formulaMedica">Fórmula Médica</Label>
            <Textarea
              id="formulaMedica"
              placeholder="Medicamentos recetados y dosificación"
              value={formData.formulaMedica}
              onChange={(e) => setFormData({ ...formData, formulaMedica: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiereIncapacidad">¿Requiere Incapacidad?</Label>
            <Select 
              value={formData.requiereIncapacidad ? "true" : "false"}
              onValueChange={(value) => setFormData({ ...formData, requiereIncapacidad: value === "true" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">No</SelectItem>
                <SelectItem value="true">Sí</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              placeholder="Notas adicionales"
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Guardando..." : "Guardar Historia"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
