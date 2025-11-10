import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Activity, Heart, Thermometer, Droplets, Wind, Scale, Syringe, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { getPanelSalud, getSignosVitales } from "@/services/salud.service";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SignosVitales, Vacuna } from "@/types";

export default function PatientHealthComplete() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("vitales");

  const { data: panelSalud, isLoading: isLoadingPanel } = useQuery({
    queryKey: ["panel-salud", user?.id],
    queryFn: () => getPanelSalud(user?.id || 0),
    enabled: !!user?.id,
  });

  const { data: historialSignosVitales = [], isLoading: isLoadingHistorial } = useQuery({
    queryKey: ["signos-vitales-historial", user?.id],
    queryFn: () => getSignosVitales(user?.id || 0),
    enabled: !!user?.id,
  });

  if (isLoadingPanel || isLoadingHistorial) {
    return <LoadingState message="Cargando información de salud..." />;
  }

  const ultimosSignos = panelSalud?.ultimosSignosVitales;
  const vacunasPendientes = panelSalud?.vacunasPendientes || [];
  const todasVacunas = panelSalud?.todasVacunas || [];

  // Preparar datos para gráficos
  const datosGraficos = historialSignosVitales
    .slice()
    .reverse()
    .slice(-10)
    .map((signo: SignosVitales) => ({
      fecha: new Date(signo.fechaRegistro).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }),
      temperatura: signo.temperatura,
      presionSistolica: signo.presionSistolica,
      presionDiastolica: signo.presionDiastolica,
      frecuenciaCardiaca: signo.frecuenciaCardiaca,
      saturacionOxigeno: signo.saturacionOxigeno,
    }));

  const signosVitalesActuales = [
    {
      icon: Thermometer,
      label: "Temperatura",
      value: ultimosSignos?.temperatura ? `${ultimosSignos.temperatura}°C` : "N/A",
      status: ultimosSignos?.temperatura && ultimosSignos.temperatura >= 36 && ultimosSignos.temperatura <= 37.5 ? "normal" : "alert",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      icon: Activity,
      label: "Presión Arterial",
      value: ultimosSignos?.presionSistolica && ultimosSignos?.presionDiastolica 
        ? `${ultimosSignos.presionSistolica}/${ultimosSignos.presionDiastolica}` 
        : "N/A",
      unit: "mmHg",
      status: "normal",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Heart,
      label: "Frecuencia Cardíaca",
      value: ultimosSignos?.frecuenciaCardiaca || "N/A",
      unit: "bpm",
      status: "normal",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: Wind,
      label: "Frecuencia Respiratoria",
      value: ultimosSignos?.frecuenciaRespiratoria || "N/A",
      unit: "rpm",
      status: "normal",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      icon: Droplets,
      label: "Saturación de O₂",
      value: ultimosSignos?.saturacionOxigeno || "N/A",
      unit: "%",
      status: ultimosSignos?.saturacionOxigeno && ultimosSignos.saturacionOxigeno >= 95 ? "normal" : "alert",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Scale,
      label: "Peso",
      value: ultimosSignos?.peso || "N/A",
      unit: "kg",
      status: "normal",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel de Salud</h1>
          <p className="text-muted-foreground mt-1">
            Monitorea tu estado de salud y vacunación
          </p>
        </div>
        <div className="flex gap-2">
          {ultimosSignos && (
            <Badge variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Última actualización: {new Date(ultimosSignos.fechaRegistro).toLocaleDateString('es-CO')}
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vitales">Signos Vitales</TabsTrigger>
          <TabsTrigger value="graficos">Evolución</TabsTrigger>
          <TabsTrigger value="vacunas">Vacunación</TabsTrigger>
        </TabsList>

        <TabsContent value="vitales" className="space-y-6">
          {!ultimosSignos ? (
            <EmptyState
              icon={Activity}
              title="Sin registros de signos vitales"
              description="Aún no se han registrado tus signos vitales. Consulta con tu médico en tu próxima cita."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {signosVitalesActuales.map((signo, index) => (
                  <motion.div
                    key={signo.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {signo.label}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${signo.bgColor}`}>
                          <signo.icon className={`w-5 h-5 ${signo.color}`} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-baseline gap-2">
                          <div className="text-2xl font-bold text-foreground">
                            {signo.value}
                          </div>
                          {signo.unit && (
                            <span className="text-sm text-muted-foreground">{signo.unit}</span>
                          )}
                        </div>
                        {signo.status === "alert" && (
                          <div className="flex items-center gap-1 mt-2 text-amber-600">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs">Fuera de rango normal</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {ultimosSignos.observaciones && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Observaciones Médicas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{ultimosSignos.observaciones}</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="graficos" className="space-y-6">
          {datosGraficos.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="Sin historial disponible"
              description="Necesitas al menos 2 registros para ver la evolución de tus signos vitales."
            />
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Evolución de Temperatura</CardTitle>
                  <CardDescription>Últimos 10 registros</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={datosGraficos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis domain={[35, 39]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="temperatura" stroke="#ef4444" name="Temperatura (°C)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Evolución de Presión Arterial</CardTitle>
                  <CardDescription>Últimos 10 registros</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={datosGraficos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis domain={[60, 160]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="presionSistolica" stroke="#3b82f6" name="Sistólica" strokeWidth={2} />
                      <Line type="monotone" dataKey="presionDiastolica" stroke="#06b6d4" name="Diastólica" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Frecuencia Cardíaca</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={datosGraficos}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis domain={[50, 120]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="frecuenciaCardiaca" stroke="#ec4899" name="bpm" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Saturación de Oxígeno</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={datosGraficos}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis domain={[90, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="saturacionOxigeno" stroke="#10b981" name="%" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="vacunas" className="space-y-6">
          {vacunasPendientes.length > 0 && (
            <Card className="border-amber-500/50 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
                  <AlertCircle className="w-5 h-5" />
                  Vacunas Pendientes ({vacunasPendientes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vacunasPendientes.map((vacuna: Vacuna) => (
                    <div key={vacuna.id} className="p-4 bg-background rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{vacuna.nombreVacuna}</h4>
                          {vacuna.proximaDosis && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Próxima dosis: {new Date(vacuna.proximaDosis).toLocaleDateString('es-CO')}
                            </p>
                          )}
                          {vacuna.observaciones && (
                            <p className="text-sm text-muted-foreground mt-1">{vacuna.observaciones}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/50">
                          Pendiente
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Syringe className="w-5 h-5 text-primary" />
                Historial de Vacunación
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todasVacunas.length === 0 ? (
                <EmptyState
                  icon={Syringe}
                  title="Sin registros de vacunación"
                  description="No se han registrado vacunas en tu historial."
                />
              ) : (
                <div className="space-y-3">
                  {todasVacunas.map((vacuna: Vacuna) => (
                    <div key={vacuna.id} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{vacuna.nombreVacuna}</h4>
                          {vacuna.dosis && (
                            <p className="text-sm text-muted-foreground">Dosis: {vacuna.dosis}</p>
                          )}
                        </div>
                        <Badge 
                          variant={vacuna.estado === 'APLICADA' ? 'default' : 'secondary'}
                          className={vacuna.estado === 'APLICADA' ? 'bg-green-500' : ''}
                        >
                          {vacuna.estado}
                        </Badge>
                      </div>
                      {vacuna.fechaAplicacion && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          Aplicada: {new Date(vacuna.fechaAplicacion).toLocaleDateString('es-CO')}
                        </div>
                      )}
                      {vacuna.proximaDosis && vacuna.estado !== 'APLICADA' && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="w-4 h-4" />
                          Próxima dosis: {new Date(vacuna.proximaDosis).toLocaleDateString('es-CO')}
                        </div>
                      )}
                      {vacuna.observaciones && (
                        <p className="text-sm text-muted-foreground mt-2">{vacuna.observaciones}</p>
                      )}
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
