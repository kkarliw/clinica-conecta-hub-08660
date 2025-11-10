import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useQuery } from '@tanstack/react-query';
import { getHistoriasClinicasPaciente } from '@/lib/api';
import { motion } from 'framer-motion';

interface Historia {
  id: number;
  fecha: string;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
  formulaMedica?: string;
  profesional?: {
    nombre?: string;
    apellido?: string;
    especialidad?: string;
  };
}

export default function PatientHistory() {
  const user = JSON.parse(localStorage.getItem('healix_user') || '{}');
  const pacienteId = user.id || 0;

  const { data: historias = [], isLoading } = useQuery({
    queryKey: ['historias-paciente', pacienteId],
    queryFn: () => getHistoriasClinicasPaciente(pacienteId),
    enabled: pacienteId > 0,
  });

  const handleDownloadPDF = async (id: number) => {
    try {
      const token = localStorage.getItem('healix_token');
      const response = await fetch(`http://localhost:4567/api/historias/${id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historia-clinica-${id}.pdf`;
        a.click();
      }
    } catch (error) {
      console.error('Error al descargar PDF:', error);
    }
  };

  if (isLoading) {
    return <LoadingState message="Cargando tu historia clínica..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Historia Clínica"
        description="Tu historial médico completo"
        breadcrumbs={[
          { label: 'Dashboard', href: '/paciente/dashboard' },
          { label: 'Historia Clínica' }
        ]}
      />

      <div className="grid gap-4">
        {historias.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No hay registros médicos"
            description="Aún no tienes registros en tu historia clínica"
          />
        ) : (
          historias.map((historia, index) => (
            <motion.div
              key={historia.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(historia.fecha), "PPP", { locale: es })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        Dr. {historia.profesional?.nombre} {historia.profesional?.apellido}
                        {historia.profesional?.especialidad && (
                          <span className="text-xs">• {historia.profesional.especialidad}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPDF(historia.id)}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        <FileText className="w-3 h-3 mr-1" />
                        Motivo
                      </Badge>
                      <p className="text-sm">{historia.motivoConsulta}</p>
                    </div>

                    <div>
                      <Badge variant="outline" className="mb-2">Diagnóstico</Badge>
                      <p className="text-sm font-medium">{historia.diagnostico}</p>
                    </div>

                    <div>
                      <Badge variant="outline" className="mb-2">Tratamiento</Badge>
                      <p className="text-sm">{historia.tratamiento}</p>
                    </div>

                    {historia.formulaMedica && (
                      <div>
                        <Badge variant="outline" className="mb-2">Fórmula Médica</Badge>
                        <p className="text-sm">{historia.formulaMedica}</p>
                      </div>
                    )}

                    {historia.observaciones && (
                      <div>
                        <Badge variant="outline" className="mb-2">Observaciones</Badge>
                        <p className="text-sm text-muted-foreground">{historia.observaciones}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
