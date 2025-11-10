import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Plus, Clock, MapPin, Phone, User, Stethoscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getPacientesCuidador, agendarCitaComoCuidador, solicitarAcompanamiento } from "@/services/cuidador.service";
import { getProfesionales } from "@/lib/api";
import { LoadingState } from "@/components/ui/LoadingState";
import { motion } from "framer-motion";

export default function CuidadorCitas() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isNuevaCitaOpen, setIsNuevaCitaOpen] = useState(false);
  const [isAcompaniamientoOpen, setIsAcompaniamientoOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState<any>(null);
  const [vistaSimplificada, setVistaSimplificada] = useState(false);

  const { data: pacientes = [], isLoading } = useQuery({
    queryKey: ['cuidador-pacientes', user?.id],
    queryFn: () => getPacientesCuidador(user?.id || 0),
    enabled: !!user?.id
  });

  const { data: profesionales = [] } = useQuery({
    queryKey: ['profesionales'],
    queryFn: getProfesionales
  });

  const agendarCitaMutation = useMutation({
    mutationFn: agendarCitaComoCuidador,
    onSuccess: () => {
      toast({
        title: "Cita agendada",
        description: "La cita se ha agendado correctamente",
      });
      setIsNuevaCitaOpen(false);
      queryClient.invalidateQueries({ queryKey: ['cuidador-pacientes'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo agendar la cita",
        variant: "destructive",
      });
    }
  });

  const solicitarAcompaniamientoMutation = useMutation({
    mutationFn: ({ citaId, payload }: any) => solicitarAcompanamiento(citaId, payload),
    onSuccess: () => {
      toast({
        title: "Acompañamiento solicitado",
        description: "Se ha solicitado el personal de apoyo",
      });
      setIsAcompaniamientoOpen(false);
      queryClient.invalidateQueries({ queryKey: ['cuidador-pacientes'] });
    }
  });

  const handleAgendarCita = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    agendarCitaMutation.mutate({
      pacienteId: parseInt(formData.get('pacienteId') as string),
      profesionalId: parseInt(formData.get('profesionalId') as string),
      fechaHora: formData.get('fechaHora') as string,
      motivo: formData.get('motivo') as string,
      solicitadoPorCuidadorId: user?.id,
    });
  };

  const handleSolicitarAcompanamiento = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    solicitarAcompaniamientoMutation.mutate({
      citaId: selectedCita?.id,
      payload: {
        solicitanteCuidadorId: user?.id,
        tipoPersonal: formData.get('tipoPersonal') as string,
        horaSalida: formData.get('horaSalida') as string,
        lugarRecogida: formData.get('lugarRecogida') as string,
        transporte: formData.get('transporte') === 'true',
      }
    });
  };

  if (isLoading) {
    return <LoadingState message="Cargando citas..." />;
  }

  const pacientesConPermisoAgendar = pacientes.filter((p: any) => p.permisos?.puedeAgendar);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Citas</h1>
          <p className="text-muted-foreground mt-1">
            Agenda y gestiona citas para tus pacientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={vistaSimplificada ? "default" : "outline"}
            onClick={() => setVistaSimplificada(!vistaSimplificada)}
            aria-label="Activar vista simplificada"
          >
            {vistaSimplificada ? "Vista Normal" : "Vista Simplificada"}
          </Button>
          <Dialog open={isNuevaCitaOpen} onOpenChange={setIsNuevaCitaOpen}>
            <DialogTrigger asChild>
              <Button className={vistaSimplificada ? "text-lg py-6" : ""}>
                <Plus className="w-4 h-4 mr-2" />
                Agendar Cita
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Agendar Nueva Cita</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAgendarCita} className="space-y-4">
                <div>
                  <Label htmlFor="pacienteId">Paciente</Label>
                  <Select name="pacienteId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {pacientesConPermisoAgendar.map((p: any) => (
                        <SelectItem key={p.pacienteId} value={p.pacienteId.toString()}>
                          {p.pacienteNombre} ({p.tipoPaciente})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="profesionalId">Médico/Especialista</Label>
                  <Select name="profesionalId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar profesional" />
                    </SelectTrigger>
                    <SelectContent>
                      {profesionales.map((prof: any) => (
                        <SelectItem key={prof.id} value={prof.id.toString()}>
                          {prof.nombre} {prof.apellido} - {prof.especialidad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fechaHora">Fecha y Hora</Label>
                  <Input
                    id="fechaHora"
                    name="fechaHora"
                    type="datetime-local"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="motivo">Motivo de la Consulta</Label>
                  <Textarea
                    id="motivo"
                    name="motivo"
                    placeholder="Describe el motivo de la cita"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={agendarCitaMutation.isPending}>
                    {agendarCitaMutation.isPending ? "Agendando..." : "Agendar Cita"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsNuevaCitaOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {pacientesConPermisoAgendar.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No tienes pacientes con permiso para agendar citas
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pacientes.map((paciente: any, index: number) => (
            <motion.div
              key={paciente.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={vistaSimplificada ? "border-4" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className={vistaSimplificada ? "text-2xl" : ""}>
                        {paciente.pacienteNombre}
                      </CardTitle>
                      <CardDescription>
                        {paciente.tipoPaciente} - {paciente.parentesco}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {paciente.permisos?.puedeAgendar && (
                        <Badge variant="secondary">Puede agendar</Badge>
                      )}
                      {paciente.permisos?.puedeCancelar && (
                        <Badge variant="secondary">Puede cancelar</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Próximas citas y opciones de acompañamiento
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className={vistaSimplificada ? "text-lg py-6" : ""}
                      onClick={() => {
                        setSelectedCita({ pacienteId: paciente.pacienteId });
                        setIsAcompaniamientoOpen(true);
                      }}
                    >
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Solicitar Acompañamiento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Dialog Acompañamiento */}
      <Dialog open={isAcompaniamientoOpen} onOpenChange={setIsAcompaniamientoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Personal de Apoyo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSolicitarAcompanamiento} className="space-y-4">
            <div>
              <Label htmlFor="tipoPersonal">Tipo de Personal</Label>
              <Select name="tipoPersonal" required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENFERMERA">Enfermera</SelectItem>
                  <SelectItem value="FISIOTERAPEUTA">Fisioterapeuta</SelectItem>
                  <SelectItem value="AUXILIAR">Auxiliar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="horaSalida">Hora de Salida</Label>
              <Input
                id="horaSalida"
                name="horaSalida"
                type="time"
                required
              />
            </div>

            <div>
              <Label htmlFor="lugarRecogida">Lugar de Recogida</Label>
              <Input
                id="lugarRecogida"
                name="lugarRecogida"
                placeholder="Dirección completa"
                required
              />
            </div>

            <div>
              <Label htmlFor="transporte">¿Necesita Transporte Adaptado?</Label>
              <Select name="transporte" required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sí</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={solicitarAcompaniamientoMutation.isPending}>
                {solicitarAcompaniamientoMutation.isPending ? "Solicitando..." : "Solicitar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAcompaniamientoOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
