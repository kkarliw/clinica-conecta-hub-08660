import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Bell, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import kenkoLogo from "@/assets/kenko-logo.png";

export default function Privacidad() {
  const sections = [
    {
      icon: Database,
      title: "1. Información que Recopilamos",
      content: `Recopilamos información necesaria para proporcionar nuestros servicios:

• Datos de identificación: nombre, documento de identidad, fecha de nacimiento
• Datos de contacto: correo electrónico, número telefónico, dirección
• Datos de salud: historias clínicas, diagnósticos, tratamientos
• Datos de uso: registros de acceso, actividad en la plataforma
• Datos técnicos: dirección IP, tipo de dispositivo, navegador`
    },
    {
      icon: Lock,
      title: "2. Cómo Protegemos tu Información",
      content: `Implementamos medidas de seguridad de nivel empresarial:

• Encriptación AES-256 para datos en reposo
• Conexiones TLS 1.3 para datos en tránsito
• Autenticación multifactor disponible
• Auditorías de seguridad periódicas
• Servidores con certificación ISO 27001
• Copias de seguridad automáticas encriptadas`
    },
    {
      icon: Eye,
      title: "3. Cómo Usamos tu Información",
      content: `Utilizamos la información recopilada para:

• Proporcionar y mantener nuestros servicios
• Gestionar citas y recordatorios
• Permitir la comunicación entre profesionales y pacientes
• Generar reportes y estadísticas anonimizadas
• Mejorar la experiencia del usuario
• Cumplir con obligaciones legales y regulatorias`
    },
    {
      icon: UserCheck,
      title: "4. Tus Derechos",
      content: `Como titular de los datos, tienes derecho a:

• Acceder a tu información personal
• Rectificar datos inexactos o incompletos
• Solicitar la eliminación de tus datos
• Oponerte al tratamiento de tus datos
• Solicitar la portabilidad de tu información
• Revocar el consentimiento otorgado`
    },
    {
      icon: Bell,
      title: "5. Retención de Datos",
      content: `Conservamos la información durante:

• Datos de cuenta: mientras la cuenta esté activa
• Historias clínicas: según la normativa local (mínimo 10 años)
• Registros de auditoría: 5 años
• Datos de uso: 2 años

Después del período de retención, los datos son eliminados de forma segura.`
    }
  ];

  const trustIndicators = [
    { icon: Lock, title: "Encriptación AES-256", subtitle: "Nivel bancario" },
    { icon: Shield, title: "ISO 27001", subtitle: "Certificación de seguridad" },
    { icon: UserCheck, title: "GDPR Compliant", subtitle: "Normativa europea" }
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
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Protección de Datos</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Política de Privacidad
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tu seguridad y privacidad son nuestra prioridad absoluta
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {trustIndicators.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <item.icon className="w-7 h-7 text-primary" />
                  </motion.div>
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
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
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mt-12 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-8 text-center">
              <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">¿Preguntas sobre privacidad?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Nuestro equipo de protección de datos está disponible para resolver tus inquietudes.
              </p>
              <Link to="/contacto">
                <Button className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Contactar al DPO
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
