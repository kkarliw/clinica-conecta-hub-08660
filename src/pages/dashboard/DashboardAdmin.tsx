import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, FileText, Settings, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Panel de Administrador</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Admin: <span className="font-medium text-foreground">{user?.nombre}</span>
            </span>
            <Button variant="outline" onClick={logout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => navigate("/pacientes")}
            role="button"
            tabIndex={0}
            aria-label="Gestionar pacientes"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Pacientes</CardTitle>
              <CardDescription>Gestionar registro de pacientes</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => navigate("/profesionales")}
            role="button"
            tabIndex={0}
            aria-label="Gestionar profesionales"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Profesionales</CardTitle>
              <CardDescription>Gestionar médicos y especialistas</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => navigate("/citas")}
            role="button"
            tabIndex={0}
            aria-label="Gestionar citas"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Citas</CardTitle>
              <CardDescription>Gestionar todas las citas médicas</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => navigate("/historias-clinicas")}
            role="button"
            tabIndex={0}
            aria-label="Ver historias clínicas"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardTitle>Historias Clínicas</CardTitle>
              <CardDescription>Acceso a historiales médicos</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => navigate("/estadisticas")}
            role="button"
            tabIndex={0}
            aria-label="Ver estadísticas"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <BarChart className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Estadísticas</CardTitle>
              <CardDescription>Reportes y métricas del sistema</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            role="button"
            tabIndex={0}
            aria-label="Configuración del sistema"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                <Settings className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Configuración</CardTitle>
              <CardDescription>Ajustes del sistema</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
