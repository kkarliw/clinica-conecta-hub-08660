import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Historia {
  id: number;
  fecha: string;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
  formulaMedica?: string;
  requiereIncapacidad?: boolean;
}

export default function ViewPatientHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [historias, setHistorias] = useState<Historia[]>([]);
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistorias();
    fetchPaciente();
  }, [id]);

  const fetchPaciente = async () => {
    try {
      const token = localStorage.getItem('healix_token');
      const response = await fetch(`http://localhost:4567/api/pacientes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPacienteNombre(data.nombre);
      }
    } catch (error) {
      console.error('Error al cargar paciente:', error);
    }
  };

  const fetchHistorias = async () => {
    try {
      const token = localStorage.getItem('healix_token');
      const response = await fetch(`http://localhost:4567/api/historias-clinicas?pacienteId=${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setHistorias(data);
      }
    } catch (error) {
      console.error('Error al cargar historias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (historiaId: number) => {
    try {
      const token = localStorage.getItem('healix_token');
      const response = await fetch(`http://localhost:4567/api/historias-clinicas/${historiaId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historia-${historiaId}.pdf`;
        a.click();
      }
    } catch (error) {
      console.error('Error al descargar PDF:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/doctor/patients')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Historia Clínica</h1>
        <p className="text-muted-foreground">{pacienteNombre}</p>
      </div>

      <div className="grid gap-4">
        {historias.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No hay registros en la historia clínica</p>
          </Card>
        ) : (
          historias.map((historia) => (
            <Card key={historia.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(historia.fecha), "PPP", { locale: es })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadPDF(historia.id)}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Descargar PDF
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      <FileText className="w-3 h-3 mr-1" />
                      Motivo de Consulta
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

                  {historia.requiereIncapacidad && (
                    <Badge variant="secondary">Requiere Incapacidad</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
