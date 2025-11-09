import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSelector from "@/components/LanguageSelector";
import DarkModeToggle from "@/components/DarkModeToggle";
import NotificationCenter from "@/components/NotificationCenter";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import ChatbotFloating from "@/components/ChatbotFloating";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 flex items-center px-6 gap-4">
            <SidebarTrigger />
            <div className="flex-1 flex items-center justify-end gap-4">
              <LanguageSelector />
              <DarkModeToggle />
              <NotificationCenter />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">{user?.nombre}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.nombre}</span>
                      <span className="text-xs text-muted-foreground">{user?.correo}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-background">
            <div className="container mx-auto p-6 md:p-8">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
      <AccessibilityToolbar />
      <ChatbotFloating />
    </SidebarProvider>
  );
}
