import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Profesional {
  id: number;
  nombre: string;
  especialidad: string;
}

export default function NewAppointment() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [formData, setFormData] = useState({
    profesionalId: '',
    fechaHora: '',
    motivo: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfesionales();
  }, []);

  const fetchProfesionales = async () => {
    try {
      const token = localStorage.getItem('healix_token');
      const response = await fetch('http://localhost:4567/api/profesionales', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfesionales(data);
      }
    } catch (error) {
      console.error('Error al cargar profesionales:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('healix_token');
      const user = JSON.parse(localStorage.getItem('healix_user') || '{}');
      
      const response = await fetch('http://localhost:4567/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pacienteId: user.id,
          profesionalId: parseInt(formData.profesionalId),
          fechaHora: formData.fechaHora,
          motivo: formData.motivo,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Cita creada',
          description: 'Tu solicitud de cita ha sido registrada exitosamente',
        });
        navigate('/paciente/citas');
      } else {
        throw new Error('Error al crear la cita');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la cita. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/paciente/citas')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Solicitar Nueva Cita</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profesional">Médico</Label>
            <Select
              value={formData.profesionalId}
              onValueChange={(value) => setFormData({ ...formData, profesionalId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un médico" />
              </SelectTrigger>
              <SelectContent>
                {profesionales.map((prof) => (
                  <SelectItem key={prof.id} value={prof.id.toString()}>
                    {prof.nombre} - {prof.especialidad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaHora">Fecha y Hora</Label>
            <Input
              id="fechaHora"
              type="datetime-local"
              value={formData.fechaHora}
              onChange={(e) => setFormData({ ...formData, fechaHora: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo de la Consulta</Label>
            <Textarea
              id="motivo"
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              placeholder="Describe el motivo de tu consulta..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creando...' : 'Solicitar Cita'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
