import { Calendar, FileText, LayoutDashboard, Heart, User } from "lucide-react";
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
  { title: "Inicio", url: "/paciente/dashboard", icon: LayoutDashboard },
  { title: "Mis Citas", url: "/paciente/citas", icon: Calendar },
  { title: "Historial Médico", url: "/paciente/historial", icon: FileText },
  { title: "Mi Salud", url: "/paciente/salud", icon: Heart },
  { title: "Mi Perfil", url: "/paciente/perfil", icon: User },
];

export function PatientSidebar() {
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
          <SidebarGroupLabel>Mi Portal</SidebarGroupLabel>
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
