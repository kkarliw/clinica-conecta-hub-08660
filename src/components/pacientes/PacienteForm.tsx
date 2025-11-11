import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { Paciente } from "@/types";

interface PacienteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Paciente) => void;
  isLoading: boolean;
  initialData?: Paciente;
}

export default function PacienteForm({ isOpen, onClose, onSubmit, isLoading, initialData }: PacienteFormProps) {
  const [formData, setFormData] = useState<Paciente>(
    initialData || {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      direccion: "",
      numeroDocumento: "",
      fechaNacimiento: "",
      genero: "MASCULINO",
    }
  );

  const handleChange = (field: keyof Paciente, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      direccion: "",
      numeroDocumento: "",
      fechaNacimiento: "",
      genero: "MASCULINO",
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
          <DialogTitle>{initialData ? "Editar Paciente" : "Agregar Nuevo Paciente"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Modifique los campos necesarios" : "Complete todos los campos para registrar un nuevo paciente"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                placeholder="Ej: Juan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) => handleChange("apellido", e.target.value)}
                placeholder="Ej: Pérez"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroDocumento">Número de Documento *</Label>
            <Input
              id="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={(e) => handleChange("numeroDocumento", e.target.value)}
              placeholder="Ej: 1234567890"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
              <Input
                id="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genero">Género *</Label>
              <select
                id="genero"
                value={formData.genero}
                onChange={(e) => handleChange("genero", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono *</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
              placeholder="3001234567"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección *</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
              placeholder="Calle, Número, Ciudad"
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
                "Guardar Paciente"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
