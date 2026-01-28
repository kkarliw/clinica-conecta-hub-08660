import { LayoutDashboard, Users, Stethoscope, Calendar, FileText, BarChart, Settings, User, TrendingUp, FileDown } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import kenkoLogo from "@/assets/kenko-logo.png";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Pacientes", url: "/admin/pacientes", icon: Users },
  { title: "Profesionales", url: "/admin/profesionales", icon: Stethoscope },
  { title: "Citas", url: "/admin/citas", icon: Calendar },
  { title: "Historias Clínicas", url: "/admin/historias", icon: FileText },
  { title: "Estadísticas", url: "/admin/estadisticas", icon: BarChart },
  { title: "Dashboard Analítico", url: "/admin/analytics", icon: TrendingUp },
  { title: "Exportar Datos", url: "/admin/exportar", icon: FileDown },
  { title: "Configuración", url: "/admin/configuracion", icon: Settings },
];

export default function AdminSidebar() {
  const { open } = useSidebar();
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b flex items-center justify-center">
          <div className="flex items-center gap-2">
            <img 
              src={kenkoLogo} 
              alt="Kenkō" 
              className={`transition-all duration-300 ${open ? 'h-14 w-auto' : 'h-8 w-8 object-contain'}`} 
            />
          </div>
        </div>

        {open && user && (
          <div className="p-4 border-b bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.nombre}</p>
                <p className="text-xs text-muted-foreground truncate">{user.correo}</p>
                <p className="text-xs text-primary font-medium">Administrador</p>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? "bg-primary/10 text-primary" : ""
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {open && (
          <div className="mt-auto p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={logout}
            >
              Cerrar Sesión
            </Button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
