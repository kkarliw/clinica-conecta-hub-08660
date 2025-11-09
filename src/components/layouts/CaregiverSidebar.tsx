import { Home, Users, Calendar, FileText, Bell, Settings, LogOut, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import healixLogo from "@/assets/healix-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { title: "Dashboard", icon: Home, href: "/cuidador/dashboard" },
  { title: "Mis Pacientes", icon: Users, href: "/cuidador/pacientes" },
  { title: "Perfil", icon: Settings, href: "/cuidador/perfil" },
];

export default function CaregiverSidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <img src={healixLogo} alt="Healix Pro" className="h-10 w-10" />
        <div>
          <h2 className="font-bold text-lg">Healix Pro</h2>
          <p className="text-xs text-muted-foreground">Panel Cuidador</p>
        </div>
      </div>

      <div className="border-b px-6 py-4 bg-primary/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{user?.nombre}</p>
            <p className="text-xs text-muted-foreground">Cuidador</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}>
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
