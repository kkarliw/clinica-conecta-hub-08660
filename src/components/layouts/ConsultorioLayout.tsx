import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Menu, X, Home, Calendar, Stethoscope, Users, Clock,
    Settings, LogOut, Bell, ChevronDown, Building2, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import kenkoLogo from "@/assets/kenko-logo.png";
import DarkModeToggle from "@/components/DarkModeToggle";

interface ConsultorioLayoutProps {
    children: React.ReactNode;
}

const navigation = [
    { name: "Dashboard", href: "/consultorio/dashboard", icon: Home },
    { name: "Citas", href: "/consultorio/citas", icon: Calendar },
    { name: "Servicios", href: "/consultorio/servicios", icon: Stethoscope },
    { name: "Profesionales", href: "/consultorio/profesionales", icon: Users },
    { name: "Horarios", href: "/consultorio/horarios", icon: Clock },
    { name: "Reseñas", href: "/consultorio/resenas", icon: Star },
    { name: "Configuración", href: "/consultorio/perfil", icon: Settings }
];

export default function ConsultorioLayout({ children }: ConsultorioLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const currentPath = window.location.pathname;

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-card border-r transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b">
                        <Link to="/consultorio/dashboard" className="flex items-center gap-3">
                            <img src={kenkoLogo} alt="Kenkō" className="h-10 w-auto" />
                            <Badge variant="secondary" className="text-xs">Admin</Badge>
                        </Link>
                    </div>

                    {/* Consultorio Info */}
                    <div className="p-4 border-b">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">Clínica Dental Sonrisa</p>
                                <p className="text-xs text-muted-foreground">consultoriosonrisa</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = currentPath === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                        }
                  `}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom section */}
                    <div className="p-4 border-t">
                        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Cerrar sesión</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top header */}
                <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                            <h2 className="text-lg font-semibold hidden sm:block">Panel de Administración</h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <DarkModeToggle />

                            {/* Notifications */}
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </Button>

                            {/* User menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="gap-2">
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback>AD</AvatarFallback>
                                        </Avatar>
                                        <span className="hidden md:inline">Admin</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to="/consultorio/perfil">
                                            <Settings className="w-4 h-4 mr-2" /> Configuración
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to={`/consultorio/clinica-dental-sonrisa`}>
                                            <Building2 className="w-4 h-4 mr-2" /> Ver perfil público
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => logout && logout()}>
                                        <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
