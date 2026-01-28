import { Home, Calendar, Users, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import kenkoLogo from "@/assets/kenko-logo.png";

export default function RecepcionistaSidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: Home, label: "Panel Principal", path: "/recepcion/dashboard" },
    { icon: Calendar, label: "Citas", path: "/recepcion/citas" },
    { icon: Users, label: "Pacientes", path: "/recepcion/pacientes" },
    { icon: Settings, label: "Configuración", path: "/recepcion/perfil" },
  ];

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src={kenkoLogo} alt="Kenkō" className="h-14 w-auto" />
        </div>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-sidebar-border">
        <p className="text-sm font-medium text-sidebar-foreground">{user?.nombre}</p>
        <p className="text-xs text-sidebar-foreground/60">{user?.correo}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
