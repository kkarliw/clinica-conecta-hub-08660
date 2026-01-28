import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/LoadingState";
import { 
  User, Mail, Phone, MapPin, Calendar, FileText, 
  Activity, Syringe, ArrowLeft, Download, Edit
} from "lucide-react";
import { 
  getPacienteById, 
  getCitasPaciente, 
  getHistoriasClinicasPaciente,
  getSignosVitalesPorPaciente,
  getVacunasPorPaciente 
} from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Paciente, CitaMedica, HistoriaClinica } from "@/types";
import { generateHistoriaPDF } from "@/lib/pdfGenerator";
import { toast } from "sonner";

export default function PacienteDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pacienteId = parseInt(id || "0");

  const { data: paciente, isLoading: loadingPaciente } = useQuery({
    queryKey: ["paciente", pacienteId],
    queryFn: () => getPacienteById(pacienteId),
    enabled: pacienteId > 0,
  });

  const { data: citas = [], isLoading: loadingCitas } = useQuery({
    queryKey: ["citas-paciente", pacienteId],
    queryFn: () => getCitasPaciente(pacienteId),
    enabled: pacienteId > 0,
  });

  const { data: historias = [], isLoading: loadingHistorias } = useQuery({
    queryKey: ["historias-paciente", pacienteId],
    queryFn: () => getHistoriasClinicasPaciente(pacienteId),
    enabled: pacienteId > 0,
  });

  const { data: signosVitales = [], isLoading: loadingSignos } = useQuery({
    queryKey: ["signos-vitales", pacienteId],
    queryFn: () => getSignosVitalesPorPaciente(pacienteId),
    enabled: pacienteId > 0,
  });

  const { data: vacunas = [], isLoading: loadingVacunas } = useQuery({
    queryKey: ["vacunas", pacienteId],
    queryFn: () => getVacunasPorPaciente(pacienteId),
    enabled: pacienteId > 0,
  });

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleDownloadPDF = (historia: HistoriaClinica) => {
    if (paciente) {
      const profesional = {
        nombre: historia.profesionalNombre || "Profesional",
        especialidad: "Medicina General"
      };
      generateHistoriaPDF(historia, paciente, profesional as any);
      toast.success("PDF generado exitosamente");
    }
  };

  if (loadingPaciente) {
    return <LoadingState message="Cargando información del paciente..." />;
  }

  if (!paciente) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Paciente no encontrado</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {paciente.nombre} {paciente.apellido}
            </h1>
            <p className="text-muted-foreground">
              Documento: {paciente.numeroDocumento}
            </p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Edit className="w-4 h-4" />
          Editar Paciente
        </Button>
      </div>

      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Edad</p>
              <p className="font-medium">{calcularEdad(paciente.fechaNacimiento)} años</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Género</p>
              <p className="font-medium">{paciente.genero}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Correo</p>
              <p className="font-medium">{paciente.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="font-medium">{paciente.telefono}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Dirección</p>
              <p className="font-medium">{paciente.direccion}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs con información detallada */}
      <Tabs defaultValue="citas" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="citas" className="gap-2">
            <Calendar className="w-4 h-4" />
            Citas ({citas.length})
          </TabsTrigger>
          <TabsTrigger value="historias" className="gap-2">
            <FileText className="w-4 h-4" />
            Historias ({historias.length})
          </TabsTrigger>
          <TabsTrigger value="signos" className="gap-2">
            <Activity className="w-4 h-4" />
            Signos Vitales
          </TabsTrigger>
          <TabsTrigger value="vacunas" className="gap-2">
            <Syringe className="w-4 h-4" />
            Vacunas
          </TabsTrigger>
        </TabsList>

        {/* Tab Citas */}
        <TabsContent value="citas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Citas</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingCitas ? (
                <LoadingState />
              ) : citas.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay citas registradas
                </p>
              ) : (
                <div className="space-y-3">
                  {citas.map((cita) => (
                    <div
                      key={cita.id}
                      className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="font-medium">
                              {format(new Date(cita.fecha), "PPP 'a las' p", { locale: es })}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Profesional</p>
                            <p className="font-medium">
                              {cita.profesional?.nombre} {cita.profesional?.apellido}
                              {cita.profesional?.especialidad && (
                                <span className="text-sm text-muted-foreground ml-2">
                                  ({cita.profesional.especialidad})
                                </span>
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Motivo</p>
                            <p>{cita.motivo}</p>
                          </div>
                        </div>
                        <Badge variant={cita.estado === "completada" ? "outline" : "default"}>
                          {cita.estado || "Pendiente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Historias Clínicas */}
        <TabsContent value="historias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historias Clínicas</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingHistorias ? (
                <LoadingState />
              ) : historias.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay historias clínicas registradas
                </p>
              ) : (
                <div className="space-y-3">
                  {historias.map((historia) => (
                    <div
                      key={historia.id}
                      className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="font-medium">
                              {format(new Date(historia.fecha), "PPP", { locale: es })}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadPDF(historia)}
                            className="gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Descargar PDF
                          </Button>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Diagnóstico</p>
                          <p className="font-medium">{historia.diagnostico}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tratamiento</p>
                          <p>{historia.tratamiento}</p>
                        </div>
                        {historia.formulaMedica && (
                          <div>
                            <p className="text-sm text-muted-foreground">Fórmula Médica</p>
                            <p>{historia.formulaMedica}</p>
                          </div>
                        )}
                        {historia.observaciones && (
                          <div>
                            <p className="text-sm text-muted-foreground">Observaciones</p>
                            <p>{historia.observaciones}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Signos Vitales */}
        <TabsContent value="signos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Signos Vitales</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSignos ? (
                <LoadingState />
              ) : signosVitales.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay signos vitales registrados
                </p>
              ) : (
                <div className="space-y-3">
                  {signosVitales.map((signo: any) => (
                    <div
                      key={signo.id}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Fecha</p>
                          <p className="font-medium">
                            {format(new Date(signo.fecha), "PPP", { locale: es })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Presión Arterial</p>
                          <p className="font-medium">{signo.presionArterial}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Frecuencia Cardíaca</p>
                          <p className="font-medium">{signo.frecuenciaCardiaca} bpm</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Temperatura</p>
                          <p className="font-medium">{signo.temperatura}°C</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Vacunas */}
        <TabsContent value="vacunas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Esquema de Vacunación</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingVacunas ? (
                <LoadingState />
              ) : vacunas.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay vacunas registradas
                </p>
              ) : (
                <div className="space-y-3">
                  {vacunas.map((vacuna: any) => (
                    <div
                      key={vacuna.id}
                      className="border border-border rounded-lg p-4 flex items-start justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Syringe className="w-4 h-4 text-primary" />
                          <span className="font-medium">{vacuna.nombre}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Fecha: {format(new Date(vacuna.fecha), "PPP", { locale: es })}
                        </p>
                        {vacuna.dosis && (
                          <p className="text-sm text-muted-foreground">
                            Dosis: {vacuna.dosis}
                          </p>
                        )}
                      </div>
                      <Badge variant={vacuna.aplicada ? "default" : "outline"}>
                        {vacuna.aplicada ? "Aplicada" : "Pendiente"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
