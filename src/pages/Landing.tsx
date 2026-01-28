import { Link } from "react-router-dom";
import {
  ArrowRight, Calendar, Users, FileText, Shield, Clock,
  Activity, Video, BarChart3, Stethoscope, CheckCircle2,
  Building2, Phone, Mail, MapPin, Heart, UserCheck,
  Laptop, MessageCircle, Lock, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRef } from "react";
import kenkoLogo from "@/assets/kenko-logo.png";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import ChatbotFloating from "@/components/ChatbotFloating";

export default function Landing() {
  const heroRef = useRef(null);

  const features = [
    {
      icon: Users,
      title: "Gestión de Pacientes",
      description: "Administra información completa de manera segura, con acceso rápido al historial médico."
    },
    {
      icon: Calendar,
      title: "Agendamiento Inteligente",
      description: "Sistema de citas con recordatorios automáticos y reducción de inasistencias."
    },
    {
      icon: FileText,
      title: "Historias Clínicas Digitales",
      description: "Registro estructurado, búsqueda instantánea y exportación en PDF."
    },
    {
      icon: Shield,
      title: "Seguridad Certificada",
      description: "Encriptación de nivel bancario y cumplimiento de normativas de salud."
    },
    {
      icon: Video,
      title: "Telemedicina Integrada",
      description: "Consultas virtuales con videollamada, chat y prescripción digital."
    },
    {
      icon: BarChart3,
      title: "Análisis y Reportes",
      description: "Dashboards en tiempo real con métricas de productividad."
    }
  ];

  const stats = [
    { number: "500+", label: "Profesionales", icon: Stethoscope },
    { number: "50K+", label: "Pacientes gestionados", icon: Users },
    { number: "99.9%", label: "Uptime garantizado", icon: Activity },
    { number: "24/7", label: "Soporte disponible", icon: Clock }
  ];

  const howToUseSteps = [
    {
      step: "01",
      icon: UserCheck,
      title: "Crea tu cuenta",
      description: "Regístrate en menos de 2 minutos. Sin tarjeta de crédito."
    },
    {
      step: "02",
      icon: Laptop,
      title: "Configura tu consultorio",
      description: "Personaliza horarios, servicios y perfiles de profesionales."
    },
    {
      step: "03",
      icon: Users,
      title: "Importa tus pacientes",
      description: "Migra tu base de datos o empieza desde cero."
    },
    {
      step: "04",
      icon: Activity,
      title: "Comienza a gestionar",
      description: "Agenda citas, crea historias clínicas y optimiza tu práctica."
    }
  ];

  // Animaciones sutiles
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3" aria-label="Kenkō - Inicio">
              <img src={kenkoLogo} alt="Kenkō" className="h-12 md:h-14 w-auto" />
            </Link>

            <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Navegación principal">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Características
              </a>
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Sobre Nosotros
              </a>
              <a href="#how-to-use" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Cómo Usar
              </a>
              <Link to="/contacto" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Contacto
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="font-medium">Iniciar sesión</Button>
              </Link>
              <Link to="/registro">
                <Button className="gap-2">
                  Comenzar <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/40 to-background" aria-hidden="true" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-left"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                <span className="text-primary">Gestiona</span> tu consultorio
                <br />
                de forma <span className="text-primary">inteligente</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed"
              >
                Agenda citas, administra pacientes y optimiza tu práctica médica
                con la plataforma más completa de Latinoamérica.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 mb-10"
              >
                <Link to="/registro">
                  <Button size="lg" className="text-base gap-2 px-8 w-full sm:w-auto">
                    Comenzar gratis <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/contacto">
                  <Button size="lg" variant="outline" className="text-base gap-2 px-8 w-full sm:w-auto">
                    <MessageCircle className="w-5 h-5" />
                    Hablar con ventas
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Datos encriptados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>ISO 27001</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Logo Visual */}
            <motion.div
              className="relative flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                {/* Subtle circle behind logo */}
                <div
                  className="absolute -inset-8 rounded-full bg-gradient-to-br from-primary/10 to-transparent"
                  aria-hidden="true"
                />

                {/* Main Logo */}
                <img
                  src={kenkoLogo}
                  alt="Kenkō - El camino a tu salud"
                  className="relative z-10 w-56 md:w-72 lg:w-80 h-auto"
                />

                {/* Stats cards */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-card shadow-lg rounded-xl p-4 border"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Citas hoy</p>
                      <p className="font-bold text-lg">24</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 bg-card shadow-lg rounded-xl p-4 border"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pacientes</p>
                      <p className="font-bold text-lg text-green-600">+12%</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-accent/30" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Estadísticas de Kenkō</h2>
        <div className="container mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-primary" aria-hidden="true" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20" aria-labelledby="about-heading">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Building2 className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-primary">Sobre Nosotros</span>
              </motion.div>

              <motion.h2 variants={fadeInUp} id="about-heading" className="text-3xl md:text-4xl font-bold mb-6">
                Transformando la
                <br />
                <span className="text-primary">atención médica</span>
              </motion.h2>

              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-8 leading-relaxed">
                En Kenkō, creemos que la tecnología debe simplificar la vida de los profesionales de la salud.
                Nuestra misión es proporcionar herramientas intuitivas que permitan a médicos
                y clínicas enfocarse en lo que realmente importa: sus pacientes.
              </motion.p>

              <motion.div variants={fadeInUp} className="space-y-4">
                {[
                  { icon: Heart, text: "Diseñado por profesionales de la salud" },
                  { icon: Lock, text: "Seguridad y privacidad como prioridad" },
                  { icon: Activity, text: "Tecnología rápida y confiable" }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border hover:border-primary/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-6"
            >
              <motion.div variants={fadeInUp} className="bg-primary text-primary-foreground p-8 rounded-2xl">
                <Stethoscope className="w-10 h-10 mb-4 opacity-80" aria-hidden="true" />
                <p className="text-4xl font-bold mb-2">5+</p>
                <p className="opacity-80">Años de experiencia</p>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-card border-2 p-8 rounded-2xl mt-8">
                <Users className="w-10 h-10 text-primary mb-4" aria-hidden="true" />
                <p className="text-4xl font-bold mb-2">500+</p>
                <p className="text-muted-foreground">Clínicas confían en nosotros</p>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-card border-2 p-8 rounded-2xl">
                <Building2 className="w-10 h-10 text-primary mb-4" aria-hidden="true" />
                <p className="text-4xl font-bold mb-2">10+</p>
                <p className="text-muted-foreground">Países en Latinoamérica</p>
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-gradient-to-br from-primary/15 to-primary/5 p-8 rounded-2xl mt-8">
                <CheckCircle2 className="w-10 h-10 text-primary mb-4" aria-hidden="true" />
                <p className="text-4xl font-bold mb-2">99%</p>
                <p className="text-muted-foreground">Satisfacción del cliente</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-accent/20" aria-labelledby="features-heading">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4">
              Todo lo que necesitas,
              <br />
              <span className="text-primary">en un solo lugar</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Herramientas diseñadas para optimizar cada aspecto de tu práctica médica
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg hover:border-primary/20 transition-all duration-300 bg-card">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                      <feature.icon className="w-7 h-7 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="how-to-use" className="py-20" aria-labelledby="howto-heading">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 id="howto-heading" className="text-3xl md:text-4xl font-bold mb-4">
              Comienza en <span className="text-primary">4 pasos</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Configurar tu consultorio nunca fue tan fácil
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {howToUseSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative text-center"
              >
                {/* Connector line */}
                {index < howToUseSteps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-border"
                    aria-hidden="true"
                  />
                )}

                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-2xl bg-primary/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <step.icon className="w-9 h-9 text-primary" aria-hidden="true" />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold"
                    aria-hidden="true"
                  >
                    {step.step}
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Link to="/registro">
              <Button size="lg" className="text-base gap-2 px-10">
                Empezar ahora - Es gratis
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary" aria-labelledby="cta-heading">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              id="cta-heading"
              className="text-3xl md:text-5xl font-bold mb-6 text-primary-foreground"
            >
              El futuro de tu consultorio
              <br />
              comienza hoy
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto"
            >
              Únete a cientos de profesionales que ya confían en Kenkō para gestionar sus consultorios
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/registro">
                <Button size="lg" variant="secondary" className="text-base gap-2 px-8">
                  Crear cuenta gratis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contacto">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base gap-2 px-8 bg-transparent border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <MessageCircle className="w-5 h-5" />
                  Hablar con ventas
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16" role="contentinfo">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <img src={kenkoLogo} alt="Kenkō" className="h-14 w-auto mb-6 brightness-0 invert" />
              <p className="text-primary-foreground/70 mb-6 max-w-md leading-relaxed">
                La plataforma líder en gestión de consultorios médicos.
                Transformando la manera en que los profesionales de la salud conectan con sus pacientes.
              </p>
            </div>

            {/* Links */}
            <nav aria-label="Producto">
              <h4 className="font-bold mb-6 text-lg">Producto</h4>
              <ul className="space-y-4 text-primary-foreground/70">
                <li><a href="#features" className="hover:text-primary-foreground transition-colors">Características</a></li>
                <li><a href="#how-to-use" className="hover:text-primary-foreground transition-colors">Cómo usar</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Integraciones</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">API</a></li>
              </ul>
            </nav>

            <nav aria-label="Empresa">
              <h4 className="font-bold mb-6 text-lg">Empresa</h4>
              <ul className="space-y-4 text-primary-foreground/70">
                <li><a href="#about" className="hover:text-primary-foreground transition-colors">Sobre nosotros</a></li>
                <li><Link to="/contacto" className="hover:text-primary-foreground transition-colors">Contacto</Link></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Blog</a></li>
              </ul>
            </nav>

            <nav aria-label="Legal">
              <h4 className="font-bold mb-6 text-lg">Legal</h4>
              <ul className="space-y-4 text-primary-foreground/70">
                <li><Link to="/terminos" className="hover:text-primary-foreground transition-colors">Términos de uso</Link></li>
                <li><Link to="/privacidad" className="hover:text-primary-foreground transition-colors">Privacidad</Link></li>
                <li><Link to="/cookies" className="hover:text-primary-foreground transition-colors">Cookies</Link></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Seguridad</a></li>
              </ul>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="border-t border-primary-foreground/10 pt-10 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                  <Mail className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/50">Email</p>
                  <p className="font-medium">contacto@kenko.health</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                  <Phone className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/50">Teléfono</p>
                  <p className="font-medium">+57 (1) 234 5678</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/50">Ubicación</p>
                  <p className="font-medium">Bogotá, Colombia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/50">
              © {new Date().getFullYear()} Kenkō. El camino a tu salud. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-primary-foreground/50">
              <Link to="/terminos" className="hover:text-primary-foreground transition-colors">Términos</Link>
              <Link to="/privacidad" className="hover:text-primary-foreground transition-colors">Privacidad</Link>
              <Link to="/cookies" className="hover:text-primary-foreground transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Accessibility & Chatbot */}
      <AccessibilityToolbar />
      <ChatbotFloating />
    </div>
  );
}
