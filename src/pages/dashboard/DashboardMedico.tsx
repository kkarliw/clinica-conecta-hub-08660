import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardMedico() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Panel de Médico</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Dr./Dra. <span className="font-medium text-foreground">{user?.nombre}</span>
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
            onClick={() => navigate("/medico/agenda")}
            role="button"
            tabIndex={0}
            aria-label="Ver agenda"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Mi Agenda</CardTitle>
              <CardDescription>Ver y gestionar citas programadas</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => navigate("/medico/pacientes")}
            role="button"
            tabIndex={0}
            aria-label="Ver pacientes"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Mis Pacientes</CardTitle>
              <CardDescription>Gestionar pacientes asignados</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => navigate("/medico/formulas")}
            role="button"
            tabIndex={0}
            aria-label="Ver prescripciones"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Prescripciones</CardTitle>
              <CardDescription>Historial de fórmulas médicas</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => navigate("/medico/perfil")}
            role="button"
            tabIndex={0}
            aria-label="Ver perfil"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center mb-2">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardTitle>Mi Perfil</CardTitle>
              <CardDescription>Ver y editar información profesional</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
