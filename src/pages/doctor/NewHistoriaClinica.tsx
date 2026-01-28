import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function NewHistoriaClinica() {
  const navigate = useNavigate();
  const location = useLocation();
  const { citaId, pacienteId } = location.state || {};
  
  const [formData, setFormData] = useState({
    motivoConsulta: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    formulaMedica: '',
    requiereIncapacidad: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('healix_token');
      const user = JSON.parse(localStorage.getItem('healix_user') || '{}');
      
      const response = await fetch('http://localhost:4567/api/historias', {
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

      if (response.status === 401) { window.location.href = '/login'; return; }
      if (response.status === 403) { toast({ title: 'Acceso denegado', description: 'No tienes permisos para crear historias', variant: 'destructive' }); return; }
      
      if (response.ok) {
        const historia = await response.json();
        
        // Actualizar estado de la cita
        if (citaId) {
          await fetch(`http://localhost:4567/api/citas/${citaId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ estado: 'completada' }),
          });
        }

        toast({
          title: 'Historia clínica creada',
          description: 'El registro médico ha sido guardado exitosamente',
        });
        
        navigate('/medico/agenda');
      } else {
        throw new Error('Error al crear historia clínica');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la historia clínica',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate('/doctor/agenda')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Nueva Historia Clínica</h1>
        
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
              Requiere Incapacidad
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Historia Clínica'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
