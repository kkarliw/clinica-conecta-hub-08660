import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft, HeartPulse, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import kenkoLogo from "@/assets/kenko-logo.png";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    correo: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.correo, formData.password);
      toast.success("Inicio de sesión exitoso");
    } catch (error: any) {
      const errorMessage = error.message || "Error al iniciar sesión. Verifica tus credenciales.";
      toast.error("Error al iniciar sesión", {
        description: errorMessage
      });
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-primary/5 flex">
      {/* Left Side - Branding (hidden on mobile) */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/10"
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-48 h-48 rounded-full bg-white/5"
          animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
        
        <div className="relative z-10 text-center text-white">
          <motion.img 
            src={kenkoLogo} 
            alt="Kenkō" 
            className="h-32 w-auto mx-auto mb-8 brightness-0 invert"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <h1 className="text-4xl font-bold mb-4">Bienvenido a Kenkō</h1>
          <p className="text-xl text-white/80 mb-8 max-w-md">
            La plataforma integral para la gestión de tu consultorio médico
          </p>
          
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: HeartPulse, text: "Gestión integral de pacientes" },
              { icon: Shield, text: "Seguridad de nivel empresarial" },
              { icon: Zap, text: "Tecnología rápida y confiable" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="flex items-center gap-3 text-white/90 justify-center"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>

          <Card className="shadow-2xl border-2 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <motion.div 
                className="flex justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <img src={kenkoLogo} alt="Kenkō" className="h-24 w-auto lg:hidden" />
                <div className="hidden lg:flex w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center">
                  <HeartPulse className="w-8 h-8 text-primary" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold">Iniciar sesión</CardTitle>
              <CardDescription>Accede a tu cuenta de Kenkō</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="correo">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="correo"
                      type="email"
                      placeholder="tu@correo.com"
                      className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="text-right"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link to="/recuperar-password" className="text-sm text-primary hover:underline font-medium">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full h-12 font-semibold text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        className="flex items-center gap-2"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Iniciando sesión...
                      </motion.div>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div 
                className="mt-8 text-center text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <span className="text-muted-foreground">¿No tienes cuenta? </span>
                <Link to="/registro" className="text-primary font-semibold hover:underline">
                  Regístrate aquí
                </Link>
              </motion.div>
            </CardContent>
          </Card>

          {/* Trust badges */}
          <motion.div 
            className="flex justify-center gap-6 mt-6 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-primary" />
              <span>Datos seguros</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-primary" />
              <span>Acceso rápido</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
