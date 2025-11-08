import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import healixLogo from "@/assets/healix-logo.png";

export default function RecuperarPassword() {
  const [correo, setCorreo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de envío - aquí conectarías con tu API
    setTimeout(() => {
      setEnviado(true);
      toast.success("Instrucciones enviadas a tu correo");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio de sesión
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            {enviado ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Check className="w-8 h-8 text-secondary" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Revisa tu correo</CardTitle>
                <CardDescription>
                  Te hemos enviado instrucciones para restablecer tu contraseña
                </CardDescription>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <img src={healixLogo} alt="Healix Pro" className="h-16 w-16" />
                </div>
                <CardTitle className="text-2xl">Recuperar contraseña</CardTitle>
                <CardDescription>
                  Ingresa tu correo y te enviaremos instrucciones
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {!enviado ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="correo"
                      type="email"
                      placeholder="tu@correo.com"
                      className="pl-10"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar instrucciones"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Si no ves el correo, revisa tu carpeta de spam
                </p>
                <Link to="/login">
                  <Button className="w-full">Volver al inicio de sesión</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
