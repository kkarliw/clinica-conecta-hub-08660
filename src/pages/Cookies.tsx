import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Cookie, Shield, Settings, Info, CheckCircle2, 
  ArrowLeft, Building2, Phone, Mail, MapPin,
  BarChart3, Target, Lock, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import kenkoLogo from "@/assets/kenko-logo.png";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const cookieTypes = [
  {
    id: 'necessary',
    name: 'Cookies Necesarias',
    description: 'Esenciales para el funcionamiento del sitio. No se pueden desactivar.',
    icon: Lock,
    required: true,
    examples: ['Sesión de usuario', 'Preferencias de accesibilidad', 'Token de autenticación']
  },
  {
    id: 'functional',
    name: 'Cookies Funcionales',
    description: 'Mejoran la experiencia recordando tus preferencias.',
    icon: Settings,
    required: false,
    examples: ['Idioma preferido', 'Modo oscuro/claro', 'Zona horaria']
  },
  {
    id: 'analytics',
    name: 'Cookies de Análisis',
    description: 'Nos ayudan a entender cómo usas la plataforma.',
    icon: BarChart3,
    required: false,
    examples: ['Páginas visitadas', 'Tiempo de sesión', 'Errores detectados']
  },
  {
    id: 'marketing',
    name: 'Cookies de Marketing',
    description: 'Permiten mostrarte contenido relevante.',
    icon: Target,
    required: false,
    examples: ['Preferencias de contenido', 'Campañas vistas', 'Intereses']
  }
];

export default function Cookies() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: true
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('cookie-preferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
      setSaved(true);
    }
  }, []);

  const handleToggle = (cookieType: keyof CookiePreferences) => {
    if (cookieType === 'necessary') return; // Cannot toggle necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [cookieType]: !prev[cookieType]
    }));
    setSaved(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent', 'true');
    setSaved(true);
    toast.success('Preferencias guardadas', {
      description: 'Tus preferencias de cookies han sido actualizadas.'
    });
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie-preferences', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent', 'true');
    setSaved(true);
    toast.success('Todas las cookies aceptadas');
  };

  const rejectOptional = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setPreferences(onlyNecessary);
    localStorage.setItem('cookie-preferences', JSON.stringify(onlyNecessary));
    localStorage.setItem('cookie-consent', 'true');
    setSaved(true);
    toast.success('Solo cookies esenciales activadas');
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={kenkoLogo} alt="Kenkō" className="h-10 w-auto" />
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/privacidad" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacidad
              </Link>
              <Link to="/terminos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Términos
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm">Iniciar sesión</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
            >
              <Cookie className="w-10 h-10 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">Política de Cookies</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              En Kenkō utilizamos cookies para mejorar tu experiencia. Aquí puedes gestionar tus preferencias.
            </p>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8 border-2 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={acceptAll} className="gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Aceptar todas
                </Button>
                <Button onClick={rejectOptional} variant="outline" className="gap-2">
                  <Shield className="w-4 h-4" />
                  Solo esenciales
                </Button>
                <Button onClick={savePreferences} variant="secondary" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Guardar selección
                </Button>
              </div>
              {saved && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-green-600 mt-4 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Preferencias guardadas
                </motion.p>
              )}
            </CardContent>
          </Card>

          {/* Cookie Types */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 mb-12"
          >
            {cookieTypes.map((cookie) => (
              <motion.div key={cookie.id} variants={itemVariants}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <cookie.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{cookie.name}</h3>
                            {cookie.required && (
                              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                Requerida
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-3">{cookie.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {cookie.examples.map((example, idx) => (
                              <span 
                                key={idx}
                                className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
                              >
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          id={cookie.id}
                          checked={preferences[cookie.id as keyof CookiePreferences]}
                          onCheckedChange={() => handleToggle(cookie.id as keyof CookiePreferences)}
                          disabled={cookie.required}
                        />
                        <Label htmlFor={cookie.id} className="sr-only">
                          {cookie.required ? 'Siempre activa' : 'Activar/Desactivar'}
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  ¿Qué son las cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>
                  Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo 
                  cuando los visitas.
                </p>
                <p>
                  Nos ayudan a recordar tus preferencias, mantenerte conectado y mejorar nuestros servicios.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Tus derechos
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>
                  Puedes cambiar tus preferencias en cualquier momento volviendo a esta página.
                </p>
                <p>
                  También puedes eliminar las cookies desde la configuración de tu navegador.
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          {/* Contact */}
          <div className="text-center text-muted-foreground">
            <p className="mb-2">¿Tienes preguntas sobre nuestro uso de cookies?</p>
            <Link to="/contacto" className="text-primary hover:underline font-medium">
              Contáctanos
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1E1E2E] text-white mt-16">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src={kenkoLogo} alt="Kenkō" className="h-12 w-auto mb-4 brightness-0 invert" />
              <p className="text-gray-400 text-sm">
                Transformando la atención médica con tecnología de vanguardia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#5A5FCF]">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/terminos" className="hover:text-white transition-colors">Términos</Link></li>
                <li><Link to="/privacidad" className="hover:text-white transition-colors">Privacidad</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#5A5FCF]">Empresa</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
                <li><a href="#about" className="hover:text-white transition-colors">Sobre nosotros</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#5A5FCF]">Contacto</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> +57 601 234 5678
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> contacto@kenko.health
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Bogotá, Colombia
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-gray-700" />
          <div className="text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Kenkō. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
