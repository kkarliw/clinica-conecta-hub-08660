import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, ArrowLeft, Stethoscope, Heart, Shield, Briefcase, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import healixLogo from "@/assets/healix-logo.png";
import { useAuth } from "@/contexts/AuthContext";

type UserRole = "PACIENTE" | "MEDICO" | "RECEPCIONISTA" | "ADMIN" | "CUIDADOR" | null;

interface RoleCard {
  role: UserRole;
  title: string;
  description: string;
  icon: any;
  color: string;
  requiresCode?: boolean;
}

const roleCards: RoleCard[] = [
  {
    role: "PACIENTE",
    title: "Paciente",
    description: "Accede a tu historial médico y agenda citas",
    icon: Heart,
    color: "from-secondary/20 to-secondary/5"
  },
  {
    role: "CUIDADOR",
    title: "Cuidador",
    description: "Gestiona el cuidado y seguimiento de tus pacientes",
    icon: Users,
    color: "from-green-500/20 to-green-500/5"
  },
  {
    role: "MEDICO",
    title: "Médico",
    description: "Gestiona pacientes, citas e historias clínicas",
    icon: Stethoscope,
    color: "from-primary/20 to-primary/5"
  },
  {
    role: "RECEPCIONISTA",
    title: "Recepcionista",
    description: "Gestiona agendamiento y atención de pacientes",
    icon: Briefcase,
    color: "from-accent/20 to-accent/5"
  },
  {
    role: "ADMIN",
    title: "Administrador",
    description: "Gestión completa del sistema (requiere clave)",
    icon: Shield,
    color: "from-muted/20 to-muted/5",
    requiresCode: true
  }
];

export default function Registro() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    numeroDocumento: "",
    numeroLicencia: "",
    claveAdmin: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setFormData({
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      password: "",
      confirmPassword: "",
      numeroDocumento: "",
      numeroLicencia: "",
      claveAdmin: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden", { 
        description: "Por favor verifica que ambas contraseñas sean iguales" 
      });
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Contraseña muy corta", { 
        description: "La contraseña debe tener al menos 8 caracteres" 
      });
      return;
    }

    setIsLoading(true);

    try {
      const registroData = {
        nombre: `${formData.nombre} ${formData.apellido}`.trim(),
        correo: formData.correo,
        password: formData.password,
        rol: selectedRole
      };

      await register(registroData);
      
      toast.success("¡Cuenta creada exitosamente!", { 
        description: "Ya puedes iniciar sesión con tu cuenta" 
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      const errorMessage = error.message || "Error al crear la cuenta";
      toast.error("Error en el registro", { 
        description: errorMessage 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            aria-label="Volver al inicio"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <div className="text-center mb-8">
            <img src={healixLogo} alt="Healix Pro" className="h-20 w-20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Crear cuenta en Healix Pro</h1>
            <p className="text-muted-foreground">Selecciona el tipo de cuenta que deseas crear</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleCards.map((card, index) => (
              <motion.div
                key={card.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 bg-gradient-to-br ${card.color}`}
                  onClick={() => handleRoleSelect(card.role)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Seleccionar rol de ${card.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRoleSelect(card.role);
                    }
                  }}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background/50 flex items-center justify-center">
                      <card.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{card.title}</CardTitle>
                    <CardDescription className="mt-2">{card.description}</CardDescription>
                  </CardHeader>
                  {card.requiresCode && (
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Shield className="w-3 h-3" />
                        <span>Requiere código de acceso</span>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
            <Link to="/login" className="text-primary font-medium hover:underline">
              Inicia sesión
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => setSelectedRole(null)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          aria-label="Volver a selección de rol"
        >
          <ArrowLeft className="w-4 h-4" />
          Cambiar tipo de cuenta
        </button>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {roleCards.find(r => r.role === selectedRole)?.icon && (
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {(() => {
                    const Icon = roleCards.find(r => r.role === selectedRole)?.icon;
                    return Icon ? <Icon className="w-8 h-8 text-primary" /> : null;
                  })()}
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">
              Registro como {roleCards.find(r => r.role === selectedRole)?.title}
            </CardTitle>
            <CardDescription>
              {roleCards.find(r => r.role === selectedRole)?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Juan"
                    className="pl-10"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="apellido"
                    type="text"
                    placeholder="Pérez"
                    className="pl-10"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="correo">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="correo"
                    type="email"
                    placeholder="tu@correo.com"
                    className="pl-10"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    required
                  />
                </div>
              </div>

              {(selectedRole === "PACIENTE" || selectedRole === "CUIDADOR") && (
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="+57 300 123 4567"
                      className="pl-10"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              {selectedRole === "CUIDADOR" && (
                <div className="space-y-2">
                  <Label htmlFor="numeroDocumento">Número de Documento</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="numeroDocumento"
                      type="text"
                      placeholder="Cédula o documento de identidad"
                      className="pl-10"
                      value={formData.numeroDocumento}
                      onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repite tu contraseña"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
              <Link to="/login" className="text-primary font-medium hover:underline">
                Inicia sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
