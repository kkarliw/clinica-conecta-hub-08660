import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, FileText, Search } from 'lucide-react';

interface Paciente {
  id: number;
  nombre: string;
  correo: string;
  telefono?: string;
  edad?: number;
}

export default function DoctorPatients() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPacientes();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = pacientes.filter(p =>
      (p.nombre || '').toLowerCase().includes(term) ||
      (p.correo || '').toLowerCase().includes(term)
    );
    setFilteredPacientes(filtered);
  }, [searchTerm, pacientes]);

  const fetchPacientes = async () => {
    try {
      const token = localStorage.getItem('healix_token');
      const response = await fetch('http://localhost:4567/api/pacientes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const raw = await response.json();
        const mapped = raw.map((p: any) => ({ ...p, correo: p.email }));
        setPacientes(mapped);
        setFilteredPacientes(mapped);
      }
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mis Pacientes</h1>
        <p className="text-muted-foreground">Gestiona tus pacientes atendidos</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar paciente por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPacientes.length === 0 ? (
          <Card className="p-8 text-center col-span-full">
            <p className="text-muted-foreground">No se encontraron pacientes</p>
          </Card>
        ) : (
          filteredPacientes.map((paciente) => (
            <Card key={paciente.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{paciente.nombre}</h3>
                    {paciente.edad && (
                      <p className="text-sm text-muted-foreground">{paciente.edad} años</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{paciente.correo}</span>
                  </div>
                  {paciente.telefono && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{paciente.telefono}</span>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => navigate(`/medico/historias/${paciente.id}`)}
                >
                  <FileText className="w-4 h-4" />
                  Ver Historia
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
