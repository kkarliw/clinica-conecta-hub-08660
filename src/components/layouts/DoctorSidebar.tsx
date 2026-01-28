import { Calendar, Users, FileText, LayoutDashboard, Pill, User } from "lucide-react";
import { NavLink } from "react-router-dom";
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
import kenkoLogo from "@/assets/kenko-logo.png";

const menuItems = [
  { title: "Dashboard", url: "/medico/dashboard", icon: LayoutDashboard },
  { title: "Mi Agenda", url: "/medico/agenda", icon: Calendar },
  { title: "Mis Pacientes", url: "/medico/pacientes", icon: Users },
  { title: "Fórmulas Médicas", url: "/medico/formulas", icon: Pill },
  { title: "Mi Perfil", url: "/medico/perfil", icon: User },
];

export function DoctorSidebar() {
  const { open } = useSidebar();

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
      </SidebarContent>
    </Sidebar>
  );
}
