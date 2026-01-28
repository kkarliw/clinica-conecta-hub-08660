import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, ArrowLeft, Stethoscope, Heart, Shield, Briefcase, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import kenkoLogo from "@/assets/kenko-logo.png";
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
    role: "MEDICO",
    title: "Médico",
    description: "Gestiona pacientes, citas e historias clínicas",
    icon: Stethoscope,
    color: "from-primary/20 to-primary/5",
    requiresCode: true
  },
  {
    role: "RECEPCIONISTA",
    title: "Recepcionista",
    description: "Gestiona agendamiento y atención de pacientes",
    icon: Briefcase,
    color: "from-accent/20 to-accent/5",
    requiresCode: true
  },
  {
    role: "CUIDADOR",
    title: "Cuidador",
    description: "Registra y monitorea el cuidado de pacientes",
    icon: Users,
    color: "from-blue-500/20 to-blue-500/5",
    requiresCode: true
  },
  {
    role: "ADMIN",
    title: "Administrador",
    description: "Gestión completa del sistema",
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
    // Campos específicos por rol
    numeroLicencia: "", // Médico
    claveAdmin: "", // Admin
    codigoVerificacion: "" // MEDICO, RECEPCIONISTA, CUIDADOR, ADMIN
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
      numeroLicencia: "",
      claveAdmin: "",
      codigoVerificacion: ""
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

    // Validar código de verificación para roles profesionales
    if (selectedRole && ['MEDICO', 'RECEPCIONISTA', 'CUIDADOR', 'ADMIN'].includes(selectedRole)) {
      if (formData.codigoVerificacion !== 'TaylorSwift13') {
        toast.error("Código de verificación incorrecto", { 
          description: "El código ingresado no es válido" 
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      // Preparar datos según el rol
      const registroData: any = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        password: formData.password,
        rol: selectedRole
      };

      // Agregar campos específicos según el rol
      if (selectedRole === "PACIENTE") {
        registroData.telefono = formData.telefono;
      } else if (selectedRole === "MEDICO") {
        registroData.numeroLicencia = formData.numeroLicencia;
        registroData.telefono = formData.telefono;
      } else if (selectedRole === "RECEPCIONISTA") {
        registroData.telefono = formData.telefono;
      } else if (selectedRole === "ADMIN") {
        registroData.claveAdmin = formData.claveAdmin;
      }

      await register(registroData);
      
      toast.success("¡Cuenta creada exitosamente!", { 
        description: "Ya puedes iniciar sesión con tu cuenta" 
      });
      
      // Redirigir automáticamente al login después del registro exitoso
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

  // Si no hay rol seleccionado, mostrar selección de roles
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl"
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
            <img src={kenkoLogo} alt="Kenkō" className="h-24 w-auto mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2 font-['Poppins']">Crear cuenta en Kenkō</h1>
            <p className="text-muted-foreground">Selecciona el tipo de cuenta que deseas crear</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roleCards.map((card, index) => (
              <motion.div
                key={card.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] duration-300 bg-gradient-to-br ${card.color} border-2 border-transparent hover:border-primary/20`}
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

  // Formulario según el rol seleccionado
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

        <Card className="shadow-2xl border-2 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
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
              {/* Campos comunes */}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Juan Pérez"
                    className="pl-10"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    aria-required="true"
                    aria-label="Nombre completo"
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
                    aria-required="true"
                    aria-label="Correo electrónico"
                  />
                </div>
              </div>


              {/* Campo apellido común para todos */}
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
                    aria-required="true"
                    aria-label="Apellido"
                  />
                </div>
              </div>

              {/* Campos específicos por rol */}
              {selectedRole === "PACIENTE" && (
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
                      aria-required="true"
                      aria-label="Teléfono"
                    />
                  </div>
                </div>
              )}

              {selectedRole === "MEDICO" && (
                <>
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
                        aria-required="true"
                        aria-label="Teléfono"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numeroLicencia">Número de Licencia</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="numeroLicencia"
                        type="text"
                        placeholder="Número de licencia médica"
                        className="pl-10"
                        value={formData.numeroLicencia}
                        onChange={(e) => setFormData({ ...formData, numeroLicencia: e.target.value })}
                        required
                        aria-required="true"
                        aria-label="Número de licencia"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Podrás configurar tu especialidad desde tu perfil después del registro
                    </p>
                  </div>
                </>
              )}

              {selectedRole === "RECEPCIONISTA" && (
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
                      aria-required="true"
                      aria-label="Teléfono"
                    />
                  </div>
                </div>
              )}

              {selectedRole === "CUIDADOR" && (
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
                      aria-required="true"
                      aria-label="Teléfono"
                    />
                  </div>
                </div>
              )}

              {selectedRole === "ADMIN" && (
                <div className="space-y-2">
                  <Label htmlFor="claveAdmin">Clave de Administrador</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="claveAdmin"
                      type="password"
                      placeholder="Clave especial de acceso"
                      className="pl-10"
                      value={formData.claveAdmin}
                      onChange={(e) => setFormData({ ...formData, claveAdmin: e.target.value })}
                      required
                      aria-required="true"
                      aria-label="Clave de administrador"
                      aria-describedby="clave-admin-help"
                    />
                  </div>
                  <p id="clave-admin-help" className="text-xs text-muted-foreground">
                    Solo usuarios autorizados pueden crear cuentas de administrador
                  </p>
                </div>
              )}

              {/* Código de verificación para roles profesionales */}
              {selectedRole && ['MEDICO', 'RECEPCIONISTA', 'CUIDADOR', 'ADMIN'].includes(selectedRole) && (
                <div className="space-y-2">
                  <Label htmlFor="codigoVerificacion">Código de Verificación</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="codigoVerificacion"
                      type="password"
                      placeholder="Código institucional"
                      className="pl-10"
                      value={formData.codigoVerificacion}
                      onChange={(e) => setFormData({ ...formData, codigoVerificacion: e.target.value })}
                      required
                      aria-required="true"
                      aria-label="Código de verificación"
                      aria-describedby="codigo-verificacion-help"
                    />
                  </div>
                  <p id="codigo-verificacion-help" className="text-xs text-muted-foreground">
                    Código institucional requerido para personal médico y administrativo
                  </p>
                </div>
              )}

              {/* Contraseñas */}
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
                    aria-required="true"
                    aria-label="Contraseña"
                    aria-describedby="password-help"
                  />
                </div>
                <p id="password-help" className="text-xs text-muted-foreground">
                  Debe tener al menos 8 caracteres
                </p>
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
                    aria-required="true"
                    aria-label="Confirmar contraseña"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 font-semibold text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300" 
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </span>
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Inicia sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
