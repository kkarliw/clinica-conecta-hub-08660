import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export default function PatientProfile() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    edad: '',
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('healix_user') || '{}');
    setProfile({
      nombre: user.nombre || '',
      correo: user.correo || '',
      telefono: '',
      direccion: '',
      edad: '',
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('healix_token');
      const user = JSON.parse(localStorage.getItem('healix_user') || '{}');
      
      const response = await fetch(`http://localhost:4567/api/pacientes/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        toast({
          title: 'Perfil actualizado',
          description: 'Tus datos han sido guardados correctamente',
        });
        setEditing(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información personal</p>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Información Personal</h2>
          {!editing ? (
            <Button onClick={() => setEditing(true)}>Editar</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <User className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <Label>Nombre Completo</Label>
              {editing ? (
                <Input
                  value={profile.nombre}
                  onChange={(e) => setProfile({ ...profile, nombre: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="font-medium">{profile.nombre}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <Label>Correo Electrónico</Label>
              <p className="font-medium">{profile.correo}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <Label>Teléfono</Label>
              {editing ? (
                <Input
                  value={profile.telefono}
                  onChange={(e) => setProfile({ ...profile, telefono: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="font-medium">{profile.telefono || 'No especificado'}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <Label>Dirección</Label>
              {editing ? (
                <Input
                  value={profile.direccion}
                  onChange={(e) => setProfile({ ...profile, direccion: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="font-medium">{profile.direccion || 'No especificada'}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <Label>Edad</Label>
              {editing ? (
                <Input
                  type="number"
                  value={profile.edad}
                  onChange={(e) => setProfile({ ...profile, edad: e.target.value })}
                  className="mt-1"
                />
              ) : (
                <p className="font-medium">{profile.edad || 'No especificada'}</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
