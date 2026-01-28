import { Link } from "react-router-dom";
import { ArrowLeft, Shield, FileText, Scale, AlertCircle, CheckCircle2, BookOpen, Users, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import kenkoLogo from "@/assets/kenko-logo.png";

export default function Terminos() {
  const sections = [
    {
      icon: FileText,
      title: "1. Aceptación de los Términos",
      content: `Al acceder y utilizar la plataforma Kenkō, usted acepta estar sujeto a estos Términos y Condiciones de Uso. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.

Kenkō se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos inmediatamente después de su publicación en la plataforma.`
    },
    {
      icon: Shield,
      title: "2. Descripción del Servicio",
      content: `Kenkō es una plataforma de gestión de consultorios médicos que proporciona:

• Gestión integral de pacientes y profesionales de la salud
• Sistema de agendamiento de citas médicas
• Almacenamiento seguro de historias clínicas digitales
• Herramientas de análisis y reportes
• Comunicación entre profesionales y pacientes

El servicio está diseñado exclusivamente para uso profesional en el ámbito de la salud.`
    },
    {
      icon: Users,
      title: "3. Responsabilidades del Usuario",
      content: `Como usuario de Kenkō, usted se compromete a:

• Proporcionar información veraz y actualizada
• Mantener la confidencialidad de sus credenciales de acceso
• No compartir su cuenta con terceros no autorizados
• Utilizar la plataforma de manera ética y legal
• Cumplir con todas las normativas de protección de datos de salud
• Notificar inmediatamente cualquier uso no autorizado`
    },
    {
      icon: AlertCircle,
      title: "4. Limitaciones y Exclusiones",
      content: `Kenkō proporciona herramientas de gestión, pero:

• No reemplaza el juicio clínico profesional
• No es responsable de las decisiones médicas tomadas
• No garantiza disponibilidad ininterrumpida del servicio
• Se reserva el derecho de suspender cuentas que violen estos términos

La información médica almacenada es responsabilidad del profesional que la registra.`
    },
    {
      icon: Scale,
      title: "5. Propiedad Intelectual",
      content: `Todo el contenido de la plataforma Kenkō, incluyendo pero no limitado a:

• Logos, marcas y nombres comerciales
• Diseños, interfaces y experiencia de usuario
• Código fuente y algoritmos
• Documentación y materiales de apoyo

Son propiedad exclusiva de Kenkō y están protegidos por las leyes de propiedad intelectual aplicables.`
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        className="border-b bg-card/95 backdrop-blur-xl sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={kenkoLogo} alt="Kenkō" className="h-10 md:h-12 w-auto" />
          </Link>
          <Link to="/">
            <Button variant="ghost" className="gap-2 hover:bg-primary/5">
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-accent/50 to-background py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(hsl(238_41%_41%_/_0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(238_41%_41%_/_0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20">
              <Scale className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Documento Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Última actualización: {new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {sections.map((section, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="overflow-hidden border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div 
                      className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      <section.icon className="w-7 h-7 text-primary" />
                    </motion.div>
                    <h2 className="text-2xl font-bold pt-3">{section.title}</h2>
                  </div>
                  <div className="text-muted-foreground whitespace-pre-line leading-relaxed pl-[4.5rem]">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mt-12 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">¿Tienes preguntas?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Si tienes dudas sobre nuestros términos y condiciones, estamos aquí para ayudarte.
              </p>
              <Link to="/contacto">
                <Button className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Contáctanos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <img src={kenkoLogo} alt="Kenkō" className="h-12 w-auto mb-4 brightness-0 invert" />
              <p className="text-primary-foreground/70 max-w-md">
                La plataforma líder en gestión de consultorios médicos. El camino a tu salud.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-3 text-primary-foreground/70">
                <li><Link to="/terminos" className="hover:text-primary-foreground transition-colors">Términos de uso</Link></li>
                <li><Link to="/privacidad" className="hover:text-primary-foreground transition-colors">Privacidad</Link></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-3 text-primary-foreground/70">
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> contacto@kenko.health</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +57 (1) 234 5678</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Bogotá, Colombia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/50">
            <p>© {new Date().getFullYear()} Kenkō. El camino a tu salud. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
