import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { ProfesionalSalud } from "@/types";

interface ProfesionalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProfesionalSalud) => void;
  isLoading: boolean;
}

export default function ProfesionalForm({ isOpen, onClose, onSubmit, isLoading }: ProfesionalFormProps) {
  const [formData, setFormData] = useState<ProfesionalSalud>({
    nombre: "",
    especialidad: "",
    correo: "",
    telefono: "",
  });

  const handleChange = (field: keyof ProfesionalSalud, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      especialidad: "",
      correo: "",
      telefono: "",
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
          <DialogTitle>Registrar Nuevo Profesional</DialogTitle>
          <DialogDescription>
            Complete todos los campos para registrar un profesional de salud
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre Completo *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              placeholder="Ej: Dr. Carlos López"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="especialidad">Especialidad *</Label>
            <Input
              id="especialidad"
              value={formData.especialidad}
              onChange={(e) => handleChange("especialidad", e.target.value)}
              placeholder="Ej: Cardiología"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="correo">Correo Electrónico *</Label>
            <Input
              id="correo"
              type="email"
              value={formData.correo}
              onChange={(e) => handleChange("correo", e.target.value)}
              placeholder="doctor@clinica.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono *</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
              placeholder="+52 123 456 7890"
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Profesional"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
