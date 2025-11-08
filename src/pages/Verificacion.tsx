import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import healixLogo from "@/assets/healix-logo.png";

export default function Verificacion() {
  const navigate = useNavigate();
  const location = useLocation();
  const correo = location.state?.correo || "tu@correo.com";
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.error("Código incompleto", {
        description: "Por favor ingresa los 6 dígitos del código"
      });
      return;
    }

    setIsLoading(true);

    try {
      await fetch(`http://localhost:4567/api/auth/verificar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: correo,
          codigo: code
        })
      });

      toast.success("¡Cuenta verificada!", {
        description: "Ya puedes iniciar sesión en tu cuenta"
      });
      
      navigate("/login");
    } catch (error) {
      toast.error("Código inválido", {
        description: "El código ingresado no es correcto o ha expirado"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await fetch(`http://localhost:4567/api/auth/reenviar-codigo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo })
      });

      toast.success("Código reenviado", {
        description: "Revisa tu correo electrónico"
      });
    } catch (error) {
      toast.error("Error al reenviar código", {
        description: "Inténtalo de nuevo más tarde"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/registro" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Verifica tu cuenta</CardTitle>
            <CardDescription>
              Ingresa el código de 6 dígitos enviado a<br />
              <span className="font-medium text-foreground">{correo}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
                aria-label="Código de verificación de 6 dígitos"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} aria-label="Primer dígito" />
                  <InputOTPSlot index={1} aria-label="Segundo dígito" />
                  <InputOTPSlot index={2} aria-label="Tercer dígito" />
                  <InputOTPSlot index={3} aria-label="Cuarto dígito" />
                  <InputOTPSlot index={4} aria-label="Quinto dígito" />
                  <InputOTPSlot index={5} aria-label="Sexto dígito" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button 
              onClick={handleVerify} 
              className="w-full" 
              disabled={isLoading || code.length !== 6}
              aria-busy={isLoading}
              aria-label="Verificar cuenta con el código ingresado"
            >
              {isLoading ? "Verificando..." : "Verificar cuenta"}
            </Button>

            <div className="text-center">
              <button
                onClick={handleResend}
                className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                aria-label="Reenviar código de verificación"
              >
                ¿No recibiste el código? Reenviar
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
