import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
  profesionalNombre: string;
  profesionalEspecialidad?: string;
}

export default function PatientAppointments() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('proximas');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCitas();
  }, []);

  const fetchCitas = async () => {
    try {
      const token = localStorage.getItem('healix_token');
      const user = JSON.parse(localStorage.getItem('healix_user') || '{}');
      
      const response = await fetch(`http://localhost:4567/api/citas/paciente/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCitas(data);
      }
    } catch (error) {
      console.error('Error al cargar citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
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

  const filteredCitas = getFilteredCitas();

  if (loading) {
    return <LoadingState message="Cargando tus citas..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Citas"
        description="Gestiona tus citas médicas"
        breadcrumbs={[
          { label: 'Dashboard', href: '/patient/dashboard' },
          { label: 'Citas' }
        ]}
        actions={
          <Button onClick={() => navigate('/patient/appointments/new')} className="gap-2">
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
                onClick: () => navigate('/patient/appointments/new')
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
                            <span>{cita.profesionalNombre}</span>
                            {cita.profesionalEspecialidad && (
                              <>
                                <span>•</span>
                                <span className="text-sm">{cita.profesionalEspecialidad}</span>
                              </>
                            )}
                          </div>
                        </div>
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
