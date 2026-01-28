import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function CompletarCita() {
  const navigate = useNavigate();
  const location = useLocation();
  const { citaId, pacienteId, pacienteNombre } = location.state || {};
  
  const [formData, setFormData] = useState({
    motivoConsulta: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    formulaMedica: '',
    requiereIncapacidad: false,
  });
  const [loading, setLoading] = useState(false);
  const [incapacidadId, setIncapacidadId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('healix_token');
      const user = JSON.parse(localStorage.getItem('healix_user') || '{}');
      
      const historialResponse = await fetch('http://localhost:4567/api/historial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pacienteId,
          profesionalId: user.id,
          fecha: new Date().toISOString(),
          ...formData,
        }),
      });

      if (!historialResponse.ok) {
        throw new Error('Error al crear historia clínica');
      }

      const historia = await historialResponse.json();

      if (formData.requiereIncapacidad) {
        const incapacidadResponse = await fetch('http://localhost:4567/api/incapacidad/pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            historiaClinicaId: historia.id,
            pacienteId,
            diasIncapacidad: 3,
            fechaInicio: new Date().toISOString(),
          }),
        });

        if (incapacidadResponse.ok) {
          const incapacidad = await incapacidadResponse.json();
          setIncapacidadId(incapacidad.id);
        }
      }

      if (citaId) {
        await fetch(`http://localhost:4567/api/citas/${citaId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ estado: 'COMPLETADA' }),
        });
      }

      toast({
        title: 'Consulta completada',
        description: 'La historia clínica ha sido registrada exitosamente',
      });

      if (!formData.requiereIncapacidad) {
        navigate('/doctor/agenda');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo completar el registro',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!incapacidadId) return;

    try {
      const token = localStorage.getItem('healix_token');
      const response = await fetch(`http://localhost:4567/api/incapacidad/pdf/${incapacidadId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `incapacidad_${incapacidadId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: 'Descarga exitosa',
          description: 'El PDF de incapacidad ha sido descargado',
        });

        setTimeout(() => navigate('/doctor/agenda'), 1500);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo descargar el PDF',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate('/doctor/agenda')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-2">Completar Consulta</h1>
        <p className="text-muted-foreground mb-6">Paciente: {pacienteNombre}</p>
        
        {incapacidadId ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                ¡Consulta completada exitosamente!
              </h2>
              <p className="text-muted-foreground mb-4">
                Se ha generado una incapacidad para el paciente
              </p>
              <Button onClick={handleDownloadPDF} className="gap-2">
                <Download className="w-4 h-4" />
                Descargar PDF de Incapacidad
              </Button>
            </div>
            <Button variant="outline" onClick={() => navigate('/doctor/agenda')}>
              Ir a mi agenda
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motivoConsulta">Motivo de Consulta</Label>
              <Textarea
                id="motivoConsulta"
                value={formData.motivoConsulta}
                onChange={(e) => setFormData({ ...formData, motivoConsulta: e.target.value })}
                placeholder="Describe el motivo principal de la consulta..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnostico">Diagnóstico</Label>
              <Textarea
                id="diagnostico"
                value={formData.diagnostico}
                onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
                placeholder="Escribe el diagnóstico médico..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tratamiento">Tratamiento</Label>
              <Textarea
                id="tratamiento"
                value={formData.tratamiento}
                onChange={(e) => setFormData({ ...formData, tratamiento: e.target.value })}
                placeholder="Indica el tratamiento recomendado..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="formulaMedica">Fórmula Médica</Label>
              <Textarea
                id="formulaMedica"
                value={formData.formulaMedica}
                onChange={(e) => setFormData({ ...formData, formulaMedica: e.target.value })}
                placeholder="Medicamentos y dosis..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                placeholder="Observaciones adicionales..."
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiereIncapacidad"
                checked={formData.requiereIncapacidad}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, requiereIncapacidad: checked as boolean })
                }
              />
              <Label htmlFor="requiereIncapacidad" className="cursor-pointer">
                Requiere Incapacidad (se generará PDF automáticamente)
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Guardando...' : 'Completar Consulta'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
