import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Heart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPaciente() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Panel de Paciente</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Bienvenido, <span className="font-medium text-foreground">{user?.nombre}</span>
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
            onClick={() => navigate("/patient/appointments")}
            role="button"
            tabIndex={0}
            aria-label="Ver mis citas"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Mis Citas</CardTitle>
              <CardDescription>Ver y gestionar citas médicas</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => navigate("/patient/history")}
            role="button"
            tabIndex={0}
            aria-label="Ver historial clínico"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Historial Clínico</CardTitle>
              <CardDescription>Accede a tu historial médico</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => navigate("/patient/health")}
            role="button"
            tabIndex={0}
            aria-label="Panel de salud"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Salud Personal</CardTitle>
              <CardDescription>Seguimiento de salud y signos vitales</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => navigate("/patient/profile")}
            role="button"
            tabIndex={0}
            aria-label="Ver perfil"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center mb-2">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardTitle>Mi Perfil</CardTitle>
              <CardDescription>Ver y editar información personal</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
