import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Activity, Heart, Droplet, TrendingUp, Weight, Pill, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PatientHealth() {
  const [activeTab, setActiveTab] = useState('vitales');

  const vitales = [
    {
      icon: Heart,
      label: 'Presión Arterial',
      value: '120/80',
      unit: 'mmHg',
      status: 'Normal',
      color: 'bg-green-500/10 text-green-600',
      iconColor: 'text-green-600'
    },
    {
      icon: Activity,
      label: 'Frecuencia Cardíaca',
      value: '72',
      unit: 'bpm',
      status: 'Normal',
      color: 'bg-blue-500/10 text-blue-600',
      iconColor: 'text-blue-600'
    },
    {
      icon: Droplet,
      label: 'Glucosa',
      value: '95',
      unit: 'mg/dL',
      status: 'Normal',
      color: 'bg-purple-500/10 text-purple-600',
      iconColor: 'text-purple-600'
    },
    {
      icon: TrendingUp,
      label: 'IMC',
      value: '23.5',
      unit: 'kg/m²',
      status: 'Peso saludable',
      color: 'bg-orange-500/10 text-orange-600',
      iconColor: 'text-orange-600'
    }
  ];

  const vacunas = [
    { nombre: 'COVID-19', fecha: '2024-01-15', refuerzo: '2024-07-15', estado: 'Al día' },
    { nombre: 'Influenza', fecha: '2023-11-20', refuerzo: '2024-11-20', estado: 'Al día' },
    { nombre: 'Hepatitis B', fecha: '2020-03-10', refuerzo: '-', estado: 'Completa' },
    { nombre: 'Tétanos', fecha: '2022-05-15', refuerzo: '2032-05-15', estado: 'Al día' },
  ];

  const recomendaciones = [
    {
      icon: Activity,
      titulo: 'Actividad Física',
      descripcion: 'Realiza al menos 30 minutos de actividad física moderada diariamente.',
      progreso: 75
    },
    {
      icon: Heart,
      titulo: 'Alimentación',
      descripcion: 'Mantén una dieta balanceada rica en frutas, verduras y proteínas.',
      progreso: 60
    },
    {
      icon: Droplet,
      titulo: 'Hidratación',
      descripcion: 'Consume al menos 8 vasos de agua al día para mantenerte hidratado.',
      progreso: 80
    },
    {
      icon: Weight,
      titulo: 'Control de Peso',
      descripcion: 'Mantén un peso saludable mediante ejercicio y alimentación balanceada.',
      progreso: 85
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel de Salud"
        description="Seguimiento completo de tu estado de salud"
        breadcrumbs={[
          { label: 'Dashboard', href: '/paciente/dashboard' },
          { label: 'Mi Salud' }
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vitales">Signos Vitales</TabsTrigger>
          <TabsTrigger value="vacunas">Vacunación</TabsTrigger>
          <TabsTrigger value="recomendaciones">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="vitales" className="mt-6 space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {vitales.map((vital, index) => (
              <motion.div
                key={vital.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all hover-scale">
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg ${vital.color} w-fit`}>
                      <vital.icon className={`w-6 h-6 ${vital.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{vital.label}</p>
                      <p className="text-3xl font-bold">
                        {vital.value}
                        <span className="text-lg text-muted-foreground ml-1">{vital.unit}</span>
                      </p>
                      <Badge className={`mt-2 ${vital.color} border-0`}>
                        {vital.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Historial de Mediciones</h3>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">Gráfico de evolución próximamente</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="vacunas" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Registro de Vacunación</h3>
            <div className="space-y-4">
              {vacunas.map((vacuna, index) => (
                <motion.div
                  key={vacuna.nombre}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Pill className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{vacuna.nombre}</h4>
                      <p className="text-sm text-muted-foreground">
                        Aplicada: {new Date(vacuna.fecha).toLocaleDateString('es-CO')}
                      </p>
                      {vacuna.refuerzo !== '-' && (
                        <p className="text-xs text-muted-foreground">
                          Próximo refuerzo: {new Date(vacuna.refuerzo).toLocaleDateString('es-CO')}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {vacuna.estado}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="recomendaciones" className="mt-6">
          <div className="grid gap-4">
            {recomendaciones.map((rec, index) => (
              <motion.div
                key={rec.titulo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <rec.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{rec.titulo}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {rec.descripcion}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Cumplimiento</span>
                          <span className="font-medium">{rec.progreso}%</span>
                        </div>
                        <Progress value={rec.progreso} className="h-2" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
