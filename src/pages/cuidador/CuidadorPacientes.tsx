import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Trash2, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getPacientesCuidador, vincularPaciente, desvincularPaciente } from "@/services/cuidador.service";
import { getPacientes } from "@/lib/api";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";

export default function CuidadorPacientes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    pacienteId: 0,
    tipoPaciente: 'ADULTO_MAYOR' as const,
    parentesco: 'FAMILIAR' as const,
    documentoAutorizacionUrl: '',
    permisos: {
      puedeAgendar: true,
      puedeCancelar: true,
      puedeAccederHistoria: false,
      puedeSubirExamenes: false
    }
  });

  const { data: pacientesVinculados = [], isLoading } = useQuery({
    queryKey: ['pacientes-cuidador', user?.id],
    queryFn: () => getPacientesCuidador(user?.id || 0),
    enabled: !!user?.id
  });

  const { data: todosPacientes = [] } = useQuery({
    queryKey: ['pacientes'],
    queryFn: getPacientes
  });

  const vincularMutation = useMutation({
    mutationFn: (data: typeof formData) => vincularPaciente(user?.id || 0, {
      ...data,
      fechaVinculacion: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes-cuidador'] });
      setIsDialogOpen(false);
      toast.success("Paciente vinculado exitosamente");
      setFormData({
        pacienteId: 0,
        tipoPaciente: 'ADULTO_MAYOR',
        parentesco: 'FAMILIAR',
        documentoAutorizacionUrl: '',
        permisos: {
          puedeAgendar: true,
          puedeCancelar: true,
          puedeAccederHistoria: false,
          puedeSubirExamenes: false
        }
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al vincular paciente");
    }
  });

  const desvincularMutation = useMutation({
    mutationFn: (pacienteRelId: number) => desvincularPaciente(user?.id || 0, pacienteRelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes-cuidador'] });
      toast.success("Vínculo eliminado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al desvincular paciente");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pacienteId === 0) {
      toast.error("Selecciona un paciente");
      return;
    }
    vincularMutation.mutate(formData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // En producción, esto debería subir a un servicio de almacenamiento
      // Por ahora, simulamos una URL
      const fakeUrl = `https://storage.healix.com/autorizaciones/${file.name}`;
      setFormData({ ...formData, documentoAutorizacionUrl: fakeUrl });
      toast.success(`Documento "${file.name}" cargado`);
    }
  };

  if (isLoading) {
    return <LoadingState message="Cargando pacientes..." />;
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Mis Pacientes"
        description="Gestiona los pacientes bajo tu cuidado y sus permisos"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Vincular Paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Vincular Nuevo Paciente</DialogTitle>
                <DialogDescription>
                  Completa la información para vincular un paciente a tu cuidado
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paciente">Seleccionar Paciente *</Label>
                  <Select
                    value={formData.pacienteId.toString()}
                    onValueChange={(value) => setFormData({ ...formData, pacienteId: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {todosPacientes.map((p: any) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.nombre} - {p.documento || p.correo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Paciente *</Label>
                    <Select
                      value={formData.tipoPaciente}
                      onValueChange={(value: any) => setFormData({ ...formData, tipoPaciente: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MENOR">Menor de Edad</SelectItem>
                        <SelectItem value="ADULTO_MAYOR">Adulto Mayor</SelectItem>
                        <SelectItem value="PERSONA_DISCAPACIDAD">Persona con Discapacidad</SelectItem>
                        <SelectItem value="RECUPERACION">En Recuperación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Parentesco *</Label>
                    <Select
                      value={formData.parentesco}
                      onValueChange={(value: any) => setFormData({ ...formData, parentesco: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PADRE">Padre</SelectItem>
                        <SelectItem value="MADRE">Madre</SelectItem>
                        <SelectItem value="TUTOR">Tutor Legal</SelectItem>
                        <SelectItem value="HIJO">Hijo/a</SelectItem>
                        <SelectItem value="FAMILIAR">Familiar</SelectItem>
                        <SelectItem value="ENFERMERA">Enfermera</SelectItem>
                        <SelectItem value="AUXILIAR">Auxiliar</SelectItem>
                        <SelectItem value="CONTRATADO">Cuidador Contratado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Documento de Autorización</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.documentoAutorizacionUrl && (
                    <p className="text-sm text-muted-foreground">✓ Documento cargado</p>
                  )}
                </div>

                <div className="space-y-3 border rounded-lg p-4">
                  <Label className="text-base font-semibold">Permisos del Cuidador</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="puedeAgendar"
                        checked={formData.permisos.puedeAgendar}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, permisos: { ...formData.permisos, puedeAgendar: !!checked } })
                        }
                      />
                      <Label htmlFor="puedeAgendar" className="cursor-pointer">
                        Puede agendar citas médicas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="puedeCancelar"
                        checked={formData.permisos.puedeCancelar}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, permisos: { ...formData.permisos, puedeCancelar: !!checked } })
                        }
                      />
                      <Label htmlFor="puedeCancelar" className="cursor-pointer">
                        Puede cancelar citas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="puedeAccederHistoria"
                        checked={formData.permisos.puedeAccederHistoria}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, permisos: { ...formData.permisos, puedeAccederHistoria: !!checked } })
                        }
                      />
                      <Label htmlFor="puedeAccederHistoria" className="cursor-pointer">
                        Puede acceder al historial clínico
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="puedeSubirExamenes"
                        checked={formData.permisos.puedeSubirExamenes}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, permisos: { ...formData.permisos, puedeSubirExamenes: !!checked } })
                        }
                      />
                      <Label htmlFor="puedeSubirExamenes" className="cursor-pointer">
                        Puede subir exámenes médicos
                      </Label>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={vincularMutation.isPending}>
                  {vincularMutation.isPending ? "Vinculando..." : "Vincular Paciente"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {pacientesVinculados.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tienes pacientes vinculados</h3>
            <p className="text-muted-foreground mb-4">
              Comienza vinculando un paciente para gestionar su atención médica
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Vincular Primer Paciente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pacientesVinculados.map((rel: any) => (
            <motion.div
              key={rel.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{rel.pacienteNombre || "Paciente"}</CardTitle>
                      <CardDescription className="mt-1">
                        {rel.tipoPaciente?.replace('_', ' ')}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => desvincularMutation.mutate(rel.id)}
                      aria-label="Desvincular paciente"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Parentesco</p>
                    <Badge variant="outline">{rel.parentesco}</Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Permisos</p>
                    <div className="flex flex-wrap gap-1">
                      {rel.permisos?.puedeAgendar && <Badge variant="secondary" className="text-xs">Agendar</Badge>}
                      {rel.permisos?.puedeCancelar && <Badge variant="secondary" className="text-xs">Cancelar</Badge>}
                      {rel.permisos?.puedeAccederHistoria && <Badge variant="secondary" className="text-xs">Historial</Badge>}
                      {rel.permisos?.puedeSubirExamenes && <Badge variant="secondary" className="text-xs">Exámenes</Badge>}
                    </div>
                  </div>

                  {rel.documentoAutorizacionUrl && (
                    <div>
                      <p className="text-sm font-medium mb-1">Documentación</p>
                      <Badge variant="outline" className="text-xs">
                        ✓ Autorización firmada
                      </Badge>
                    </div>
                  )}

                  <Button className="w-full mt-4" variant="outline">
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
