import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { User, Mail, Phone, Briefcase, Save, X } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function DoctorProfile() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    nombre: '',
    correo: '',
    especialidad: '',
    telefono: '',
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('healix_user') || '{}');
    setProfile({
      nombre: user.nombre || '',
      correo: user.correo || '',
      especialidad: '',
      telefono: '',
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('healix_token');
      const user = JSON.parse(localStorage.getItem('healix_user') || '{}');
      
      const response = await fetch(`http://localhost:4567/api/profesionales/${user.id}`, {
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
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Mi Perfil"
        description="Gestiona tu información profesional"
        breadcrumbs={[
          { label: 'Dashboard', href: '/doctor/dashboard' },
          { label: 'Perfil' }
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Información Personal</h2>
            {!editing ? (
              <Button onClick={() => setEditing(true)} className="gap-2">
                <User className="w-4 h-4" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditing(false)} className="gap-2">
                  <X className="w-4 h-4" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={loading} className="gap-2">
                  <Save className="w-4 h-4" />
                  {loading ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            )}
          </div>

          <Separator className="mb-6" />

          <div className="space-y-6">
            <motion.div
              className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-2 rounded-lg bg-primary/10 mt-1">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <Label className="text-sm font-medium">Nombre Completo</Label>
                {editing ? (
                  <Input
                    value={profile.nombre}
                    onChange={(e) => setProfile({ ...profile, nombre: e.target.value })}
                    placeholder="Ingresa tu nombre completo"
                  />
                ) : (
                  <p className="text-lg font-medium">{profile.nombre || 'No especificado'}</p>
                )}
              </div>
            </motion.div>

            <motion.div
              className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-2 rounded-lg bg-secondary/10 mt-1">
                <Mail className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1 space-y-2">
                <Label className="text-sm font-medium">Correo Electrónico</Label>
                <p className="text-lg font-medium text-muted-foreground">{profile.correo}</p>
                <p className="text-xs text-muted-foreground">Este campo no se puede editar</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-2 rounded-lg bg-accent/10 mt-1">
                <Briefcase className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1 space-y-2">
                <Label className="text-sm font-medium">Especialidad Médica</Label>
                {editing ? (
                  <Input
                    value={profile.especialidad}
                    onChange={(e) => setProfile({ ...profile, especialidad: e.target.value })}
                    placeholder="Ej: Cardiología, Pediatría, Medicina General"
                  />
                ) : (
                  <p className="text-lg font-medium">{profile.especialidad || 'No especificada'}</p>
                )}
              </div>
            </motion.div>

            <motion.div
              className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-2 rounded-lg bg-muted/50 mt-1">
                <Phone className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-2">
                <Label className="text-sm font-medium">Teléfono de Contacto</Label>
                {editing ? (
                  <Input
                    value={profile.telefono}
                    onChange={(e) => setProfile({ ...profile, telefono: e.target.value })}
                    placeholder="Ingresa tu número de teléfono"
                  />
                ) : (
                  <p className="text-lg font-medium">{profile.telefono || 'No especificado'}</p>
                )}
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
