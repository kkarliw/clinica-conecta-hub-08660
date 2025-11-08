import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Historia {
  id: number;
  fecha: string;
  pacienteNombre: string;
  diagnostico: string;
  formulaMedica: string;
}

export default function DoctorPrescriptions() {
  const [prescripciones, setPrescripciones] = useState<Historia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescripciones();
  }, []);

  const fetchPrescripciones = async () => {
    try {
      const token = localStorage.getItem('healix_token');
      const response = await fetch('http://localhost:4567/api/historias-clinicas', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const conFormula = data.filter((h: Historia) => h.formulaMedica);
        setPrescripciones(conFormula);
      }
    } catch (error) {
      console.error('Error al cargar prescripciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (id: number) => {
    try {
      const token = localStorage.getItem('healix_token');
      const response = await fetch(`http://localhost:4567/api/historias-clinicas/${id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prescripcion-${id}.pdf`;
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fórmulas Médicas</h1>
        <p className="text-muted-foreground">Prescripciones emitidas</p>
      </div>

      <div className="grid gap-4">
        {prescripciones.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No hay fórmulas médicas registradas</p>
          </Card>
        ) : (
          prescripciones.map((prescripcion) => (
            <Card key={prescripcion.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(prescripcion.fecha), "PPP", { locale: es })}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{prescripcion.pacienteNombre}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadPDF(prescripcion.id)}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Descargar
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Badge variant="outline" className="mb-2">Diagnóstico</Badge>
                    <p className="text-sm">{prescripcion.diagnostico}</p>
                  </div>

                  <div>
                    <Badge variant="default" className="mb-2">
                      <FileText className="w-3 h-3 mr-1" />
                      Fórmula Médica
                    </Badge>
                    <p className="text-sm font-medium whitespace-pre-line">
                      {prescripcion.formulaMedica}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
