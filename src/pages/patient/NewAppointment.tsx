import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfesionales, createCita } from '@/lib/api';

interface Profesional {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
}

export default function NewAppointment() {
  const [formData, setFormData] = useState({
    profesionalId: '',
    fechaHora: '',
    motivo: '',
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profesionales = [] } = useQuery({
    queryKey: ['profesionales'],
    queryFn: getProfesionales,
  });

  const createCitaMutation = useMutation({
    mutationFn: createCita,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas-paciente'] });
      toast({
        title: 'Cita creada',
        description: 'Tu solicitud de cita ha sido registrada exitosamente',
      });
      navigate('/paciente/citas');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo crear la cita. Intenta nuevamente.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('healix_user') || '{}');
    
    createCitaMutation.mutate({
      pacienteId: user.id,
      profesionalId: parseInt(formData.profesionalId),
      fecha: formData.fechaHora,
      motivo: formData.motivo,
      estado: 'PENDIENTE',
    });
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
                    {prof.nombre} {prof.apellido} - {prof.especialidad}
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

          <Button type="submit" className="w-full" disabled={createCitaMutation.isPending}>
            {createCitaMutation.isPending ? 'Creando...' : 'Solicitar Cita'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
