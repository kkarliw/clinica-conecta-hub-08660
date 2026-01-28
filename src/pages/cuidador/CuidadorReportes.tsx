import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, Heart, Activity, Thermometer, Droplet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getPacientesCuidador, registrarReporteDiario, getReportesDiarios } from "@/services/cuidador.service";
import { LoadingState } from "@/components/ui/LoadingState";
import { motion } from "framer-motion";

export default function CuidadorReportes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isNuevoReporteOpen, setIsNuevoReporteOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<any>(null);
  const [vistaSimplificada, setVistaSimplificada] = useState(false);

  const { data: pacientes = [], isLoading } = useQuery({
    queryKey: ['cuidador-pacientes', user?.id],
    queryFn: () => getPacientesCuidador(user?.id || 0),
    enabled: !!user?.id
  });

  const { data: reportes = [] } = useQuery({
    queryKey: ['reportes-diarios', selectedPaciente?.pacienteId],
    queryFn: () => getReportesDiarios(selectedPaciente?.pacienteId),
    enabled: !!selectedPaciente?.pacienteId
  });

  const registrarReporteMutation = useMutation({
    mutationFn: ({ pacienteId, payload }: any) => registrarReporteDiario(pacienteId, payload),
    onSuccess: () => {
      toast({
        title: "Reporte registrado",
        description: "El reporte diario se ha guardado correctamente",
      });
      setIsNuevoReporteOpen(false);
      queryClient.invalidateQueries({ queryKey: ['reportes-diarios'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo registrar el reporte",
        variant: "destructive",
      });
    }
  });

  const handleRegistrarReporte = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const signosVitales: any = {};
    const presion = formData.get('presionArterial');
    const frecuencia = formData.get('frecuenciaCardiaca');
    const temperatura = formData.get('temperatura');
    const saturacion = formData.get('saturacionOxigeno');

    if (presion) signosVitales.presionArterial = presion;
    if (frecuencia) signosVitales.frecuenciaCardiaca = parseInt(frecuencia as string);
    if (temperatura) signosVitales.temperatura = parseFloat(temperatura as string);
    if (saturacion) signosVitales.saturacionOxigeno = parseInt(saturacion as string);

    registrarReporteMutation.mutate({
      pacienteId: selectedPaciente?.pacienteId,
      payload: {
        cuidadorId: user?.id,
        fecha: new Date().toISOString(),
        resumenDia: formData.get('resumenDia') as string,
        medicamentosTomados: formData.get('medicamentosTomados') === 'on',
        signosVitales: Object.keys(signosVitales).length > 0 ? signosVitales : undefined,
        estadoEmocional: formData.get('estadoEmocional') as string,
        observaciones: formData.get('observaciones') as string,
      }
    });
  };

  if (isLoading) {
    return <LoadingState message="Cargando información..." />;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes Diarios</h1>
          <p className="text-muted-foreground mt-1">
            Registra el estado y evolución diaria de tus pacientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={vistaSimplificada ? "default" : "outline"}
            onClick={() => setVistaSimplificada(!vistaSimplificada)}
          >
            {vistaSimplificada ? "Vista Normal" : "Vista Simplificada"}
          </Button>
          <Dialog open={isNuevoReporteOpen} onOpenChange={setIsNuevoReporteOpen}>
            <DialogTrigger asChild>
              <Button className={vistaSimplificada ? "text-lg py-6" : ""}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Reporte
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Reporte Diario</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleRegistrarReporte} className="space-y-4">
                <div>
                  <Label htmlFor="pacienteSelect">Paciente</Label>
                  <Select 
                    onValueChange={(value) => {
                      const paciente = pacientes.find((p: any) => p.pacienteId === parseInt(value));
                      setSelectedPaciente(paciente);
                    }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {pacientes.map((p: any) => (
                        <SelectItem key={p.pacienteId} value={p.pacienteId.toString()}>
                          {p.pacienteNombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="resumenDia">Resumen del Día</Label>
                  <Textarea
                    id="resumenDia"
                    name="resumenDia"
                    placeholder="Describe cómo estuvo el día del paciente"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="medicamentosTomados" name="medicamentosTomados" />
                  <Label htmlFor="medicamentosTomados" className="cursor-pointer">
                    ¿Tomó todos sus medicamentos?
                  </Label>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Signos Vitales (Opcional)
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="presionArterial" className="text-sm">Presión Arterial</Label>
                      <Input
                        id="presionArterial"
                        name="presionArterial"
                        placeholder="120/80"
                      />
                    </div>

                    <div>
                      <Label htmlFor="frecuenciaCardiaca" className="text-sm">Frecuencia Cardíaca (bpm)</Label>
                      <Input
                        id="frecuenciaCardiaca"
                        name="frecuenciaCardiaca"
                        type="number"
                        placeholder="75"
                      />
                    </div>

                    <div>
                      <Label htmlFor="temperatura" className="text-sm">Temperatura (°C)</Label>
                      <Input
                        id="temperatura"
                        name="temperatura"
                        type="number"
                        step="0.1"
                        placeholder="36.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="saturacionOxigeno" className="text-sm">Saturación O₂ (%)</Label>
                      <Input
                        id="saturacionOxigeno"
                        name="saturacionOxigeno"
                        type="number"
                        placeholder="98"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="estadoEmocional">Estado Emocional</Label>
                  <Select name="estadoEmocional" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EXCELENTE">😊 Excelente</SelectItem>
                      <SelectItem value="BIEN">🙂 Bien</SelectItem>
                      <SelectItem value="REGULAR">😐 Regular</SelectItem>
                      <SelectItem value="MAL">😟 Mal</SelectItem>
                      <SelectItem value="CRITICO">😰 Crítico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="observaciones">Observaciones Adicionales</Label>
                  <Textarea
                    id="observaciones"
                    name="observaciones"
                    placeholder="Cualquier detalle relevante"
                    rows={2}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={registrarReporteMutation.isPending}>
                    {registrarReporteMutation.isPending ? "Guardando..." : "Guardar Reporte"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsNuevoReporteOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
                      {paciente.tipoPaciente}
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedPaciente(paciente);
                      setIsNuevoReporteOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Hoy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Reportes recientes
                </p>
                <div className="space-y-2">
                  {reportes.length > 0 ? (
                    reportes.slice(0, 3).map((reporte: any) => (
                      <div key={reporte.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {new Date(reporte.fecha).toLocaleDateString('es-CO')}
                          </span>
                          <Badge variant={
                            reporte.estadoEmocional === 'EXCELENTE' ? 'default' :
                            reporte.estadoEmocional === 'CRITICO' ? 'destructive' : 'secondary'
                          }>
                            {reporte.estadoEmocional}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{reporte.resumenDia}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay reportes registrados aún
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
