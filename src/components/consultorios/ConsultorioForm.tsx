import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { Consultorio } from "@/types";

interface ConsultorioFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Consultorio) => void;
  isLoading: boolean;
  consultorio?: Consultorio;
}

export default function ConsultorioForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading,
  consultorio 
}: ConsultorioFormProps) {
  const [formData, setFormData] = useState<Consultorio>(
    consultorio || {
      numeroSala: "",
      ubicacion: "",
    }
  );

  const handleChange = (field: keyof Consultorio, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const resetForm = () => {
    setFormData({
      numeroSala: "",
      ubicacion: "",
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
          <DialogTitle>
            {consultorio ? "Editar Consultorio" : "Registrar Nuevo Consultorio"}
          </DialogTitle>
          <DialogDescription>
            Complete todos los campos para {consultorio ? "actualizar" : "registrar"} el consultorio
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numeroSala">Número de Sala *</Label>
            <Input
              id="numeroSala"
              value={formData.numeroSala}
              onChange={(e) => handleChange("numeroSala", e.target.value)}
              placeholder="Ej: 101, A-205"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ubicacion">Ubicación *</Label>
            <Input
              id="ubicacion"
              value={formData.ubicacion}
              onChange={(e) => handleChange("ubicacion", e.target.value)}
              placeholder="Ej: Piso 2 - Ala Norte"
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
                consultorio ? "Actualizar" : "Guardar Consultorio"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
