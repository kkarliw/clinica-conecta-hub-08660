import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { CitaMedica, Paciente, ProfesionalSalud } from "@/types";

interface CitaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CitaMedica) => void;
  isLoading: boolean;
  pacientes: Paciente[];
  profesionales: ProfesionalSalud[];
  initialData?: CitaMedica;
}

export default function CitaForm({ isOpen, onClose, onSubmit, isLoading, pacientes, profesionales, initialData }: CitaFormProps) {
  const [formData, setFormData] = useState<CitaMedica>(
    initialData || {
      pacienteId: 0,
      profesionalId: 0,
      fecha: "",
      motivo: "",
    }
  );

  const handleChange = (field: keyof CitaMedica, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const resetForm = () => {
    setFormData({
      pacienteId: 0,
      profesionalId: 0,
      fecha: "",
      motivo: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Cita" : "Agendar Nueva Cita"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Modifique los campos necesarios" : "Complete todos los campos para agendar una nueva cita médica"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paciente">Paciente *</Label>
            <Select
              value={formData.pacienteId.toString()}
              onValueChange={(value) => handleChange("pacienteId", parseInt(value))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un paciente" />
              </SelectTrigger>
              <SelectContent>
                {pacientes.map((paciente) => (
                  <SelectItem key={paciente.id} value={paciente.id!.toString()}>
                    {paciente.nombre} {paciente.apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profesional">Profesional de Salud *</Label>
            <Select
              value={formData.profesionalId.toString()}
              onValueChange={(value) => handleChange("profesionalId", parseInt(value))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un profesional" />
              </SelectTrigger>
              <SelectContent>
                {profesionales.map((profesional) => (
                  <SelectItem key={profesional.id} value={profesional.id!.toString()}>
                    {profesional.nombre} {profesional.apellido} - {profesional.especialidad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha y Hora *</Label>
            <Input
              id="fecha"
              type="datetime-local"
              value={formData.fecha}
              onChange={(e) => handleChange("fecha", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo de la Consulta *</Label>
            <Textarea
              id="motivo"
              value={formData.motivo}
              onChange={(e) => handleChange("motivo", e.target.value)}
              placeholder="Describa el motivo de la consulta"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                resetForm();
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || formData.pacienteId === 0 || formData.profesionalId === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Agendando...
                </>
              ) : (
                "Agendar Cita"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
