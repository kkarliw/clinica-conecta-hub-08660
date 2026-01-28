import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, FileText, Bell, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Cita {
  id: number;
  fecha: string;
  motivo: string;
  estado: string;
  pacienteNombre: string;
  pacienteId: number;
  profesionalId: number;
}

export default function DoctorAgenda() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todas');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCitas();
  }, []);

  const fetchCitas = async () => {
    try {
      const token = localStorage.getItem('healix_token');
      const user = JSON.parse(localStorage.getItem('healix_user') || '{}');
      
      const response = await fetch('http://localhost:4567/api/citas', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.status === 401) { window.location.href = '/login'; return; }
      if (response.status === 403) { toast({ title: 'Acceso denegado', description: 'No tienes permisos para ver estas citas', variant: 'destructive' }); return; }
      
      if (response.ok) {
        const raw = await response.json();
        const normalized: Cita[] = raw.map((c: any) => ({
          id: c.id,
          fecha: c.fecha,
          motivo: c.motivo,
          estado: c.estado,
          pacienteNombre: c.paciente?.nombre || 'Paciente',
          pacienteId: c.paciente?.id,
          profesionalId: c.profesional?.id,
        }));
        const misCitas = normalized.filter((c: Cita) => c.profesionalId === user.id);
        setCitas(misCitas);
      }
    } catch (error) {
      console.error('Error al cargar citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToGoogleCalendar = (cita: Cita) => {
    const startDate = new Date(cita.fecha);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Cita: ${cita.pacienteNombre}`)}&dates=${format(startDate, "yyyyMMdd'T'HHmmss")}/${format(endDate, "yyyyMMdd'T'HHmmss")}&details=${encodeURIComponent(cita.motivo)}&location=Clínica`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const enableNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast({
            title: 'Notificaciones activadas',
            description: 'Recibirás alertas de tus próximas citas',
          });
        }
      });
    }
  };

  const handleAtender = (citaId: number, pacienteId: number, pacienteNombre: string) => {
    navigate('/medico/completar-cita', { state: { citaId, pacienteId, pacienteNombre } });
  };

  const getFilteredCitas = () => {
    const now = new Date();
    switch (activeTab) {
      case 'pendientes':
        return citas.filter(c => c.estado.toLowerCase() === 'pendiente' || c.estado.toLowerCase() === 'confirmada');
      case 'hoy':
        return citas.filter(c => {
          const citaDate = new Date(c.fecha);
          return citaDate.toDateString() === now.toDateString();
        });
      case 'completadas':
        return citas.filter(c => c.estado.toLowerCase() === 'completada');
      default:
        return citas;
    }
  };

  const filteredCitas = getFilteredCitas();

  if (loading) {
    return <LoadingState message="Cargando tu agenda..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi Agenda"
        description="Gestiona tus citas programadas"
          breadcrumbs={[
            { label: 'Dashboard', href: '/medico/dashboard' },
            { label: 'Agenda' }
          ]}
        actions={
          <Button onClick={enableNotifications} variant="outline" className="gap-2">
            <Bell className="w-4 h-4" />
            Activar Notificaciones
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="hoy">Hoy</TabsTrigger>
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="completadas">Completadas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredCitas.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No hay citas"
              description={`No tienes citas ${activeTab === 'todas' ? '' : activeTab} por el momento.`}
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
                          <Badge 
                            variant={cita.estado.toLowerCase() === 'confirmada' ? 'default' : 'secondary'}
                            className="animate-fade-in"
                          >
                            {cita.estado}
                          </Badge>
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
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-lg">{cita.pacienteNombre}</h3>
                          </div>
                          <p className="text-muted-foreground">{cita.motivo}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => addToGoogleCalendar(cita)}
                          variant="outline"
                          className="gap-2 whitespace-nowrap"
                        >
                          <Calendar className="w-4 h-4" />
                          Agregar a Calendar
                        </Button>
                        {(cita.estado.toLowerCase() === 'pendiente' || cita.estado.toLowerCase() === 'confirmada') && (
                          <Button
                            size="sm"
                            onClick={() => handleAtender(cita.id, cita.pacienteId, cita.pacienteNombre)}
                            className="gap-2"
                          >
                            <FileText className="w-4 h-4" />
                            Atender
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
