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
import healixLogo from "@/assets/healix-logo.png";

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
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <img src={healixLogo} alt="Healix Pro" className="w-8 h-8" />
            {open && <span className="font-bold text-lg text-primary">Healix Pro</span>}
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
