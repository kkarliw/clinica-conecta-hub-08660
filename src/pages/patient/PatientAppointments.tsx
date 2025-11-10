import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Plus, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCitasPaciente, updateCita } from '@/lib/api';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Cita {
  id?: number;
  fecha: string;
  motivo: string;
  estado?: string;
  profesional?: {
    nombre?: string;
    apellido?: string;
    especialidad?: string;
  };
}

export default function PatientAppointments() {
  const [activeTab, setActiveTab] = useState('proximas');
  const [citaToCancel, setCitaToCancel] = useState<number | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const user = JSON.parse(localStorage.getItem('healix_user') || '{}');
  const pacienteId = user.id || 0;

  const { data: citas = [], isLoading } = useQuery({
    queryKey: ['citas-paciente', pacienteId],
    queryFn: () => getCitasPaciente(pacienteId),
    enabled: pacienteId > 0,
  });

  const cancelCitaMutation = useMutation({
    mutationFn: (citaId: number) => updateCita(citaId, { estado: 'cancelada' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas-paciente'] });
      toast({
        title: 'Cita cancelada',
        description: 'Tu cita ha sido cancelada exitosamente',
      });
      setCitaToCancel(null);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo cancelar la cita. Intenta nuevamente.',
        variant: 'destructive',
      });
    },
  });

  const getEstadoBadge = (estado?: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      'pendiente': { variant: 'default', label: 'Pendiente' },
      'confirmada': { variant: 'secondary', label: 'Confirmada' },
      'completada': { variant: 'outline', label: 'Completada' },
      'cancelada': { variant: 'destructive', label: 'Cancelada' },
    };
    
    const config = variants[estado.toLowerCase()] || variants['pendiente'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getFilteredCitas = () => {
    const now = new Date();
    switch (activeTab) {
      case 'proximas':
        return citas.filter(c => new Date(c.fecha) > now && c.estado.toLowerCase() !== 'cancelada');
      case 'pasadas':
        return citas.filter(c => new Date(c.fecha) <= now || c.estado.toLowerCase() === 'completada');
      default:
        return citas;
    }
  };

  const canCancelCita = (cita: Cita) => {
    if (!cita.id || !cita.estado) return false;
    const citaDate = new Date(cita.fecha);
    const now = new Date();
    const estado = cita.estado.toLowerCase();
    
    // Solo se puede cancelar si está pendiente o confirmada y es una cita futura
    return (estado === 'pendiente' || estado === 'confirmada') && citaDate > now;
  };

  const filteredCitas = getFilteredCitas();

  if (isLoading) {
    return <LoadingState message="Cargando tus citas..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Citas"
        description="Gestiona tus citas médicas"
        breadcrumbs={[
          { label: 'Dashboard', href: '/paciente/dashboard' },
          { label: 'Citas' }
        ]}
        actions={
          <Button onClick={() => navigate('/paciente/citas/nueva')} className="gap-2">
            <Plus className="w-4 h-4" />
            Nueva Cita
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proximas">Próximas</TabsTrigger>
          <TabsTrigger value="pasadas">Pasadas</TabsTrigger>
          <TabsTrigger value="todas">Todas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredCitas.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No tienes citas"
              description={`No tienes citas ${activeTab} registradas.`}
              action={{
                label: 'Agendar cita',
                onClick: () => navigate('/paciente/citas/nueva')
              }}
            />
          ) : (
            <div className="grid gap-4">
              {filteredCitas.map((cita, index) => (
                <motion.div
                  key={cita.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all hover-scale">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-4 flex-wrap">
                          {getEstadoBadge(cita.estado)}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(cita.fecha), "PPP", { locale: es })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {format(new Date(cita.fecha), "p", { locale: es })}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{cita.motivo}</h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>
                              {cita.profesional?.nombre} {cita.profesional?.apellido}
                            </span>
                            {cita.profesional?.especialidad && (
                              <>
                                <span>•</span>
                                <span className="text-sm">{cita.profesional.especialidad}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {canCancelCita(cita) && cita.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCitaToCancel(cita.id!)}
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={citaToCancel !== null} onOpenChange={() => setCitaToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar cita?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas cancelar esta cita? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, mantener</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => citaToCancel && cancelCitaMutation.mutate(citaToCancel)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, cancelar cita
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
