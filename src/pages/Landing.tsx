import { Link } from "react-router-dom";
import { 
  ArrowRight, Calendar, Users, FileText, Shield, Clock, HeartPulse,
  Activity, Bell, Video, BarChart3, Stethoscope, ClipboardCheck,
  Settings, TrendingUp, MessageSquare, Download, UserCheck, Pill
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import healixLogo from "@/assets/healix-logo.png";

export default function Landing() {
  const features = [
    {
      icon: Users,
      title: "Gestión Integral de Pacientes",
      description: "Administra información completa de manera segura, con acceso rápido al historial médico y datos relevantes."
    },
    {
      icon: Calendar,
      title: "Agendamiento Inteligente",
      description: "Sistema de citas con recordatorios automáticos y confirmaciones, reduciendo inasistencias hasta un 60%."
    },
    {
      icon: FileText,
      title: "Historias Clínicas Digitales",
      description: "Registro estructurado, búsqueda instantánea y exportación en PDF con trazabilidad completa."
    },
    {
      icon: Shield,
      title: "Seguridad Certificada",
      description: "Protección de datos con encriptación de nivel bancario y cumplimiento de normativas de salud."
    },
    {
      icon: Video,
      title: "Telemedicina Integrada",
      description: "Consultas virtuales con videollamada, chat en tiempo real y prescripción digital."
    },
    {
      icon: BarChart3,
      title: "Análisis y Reportes",
      description: "Dashboards en tiempo real con métricas de productividad y satisfacción del paciente."
    }
  ];

  const patientFeatures = [
    { icon: Activity, title: "Panel de Inicio", description: "Resumen de próximas citas, recordatorios y resultados recientes" },
    { icon: Calendar, title: "Mis Citas", description: "Agenda, reprograma o cancela citas con recordatorios automáticos" },
    { icon: FileText, title: "Historial Médico", description: "Acceso completo a diagnósticos, resultados y documentos descargables" },
    { icon: TrendingUp, title: "Mi Salud", description: "Seguimiento de signos vitales, vacunas y evolución con gráficas interactivas" },
    { icon: MessageSquare, title: "Asistente Virtual", description: "Chat con tu consultorio o chatbot de orientación médica" },
    { icon: UserCheck, title: "Mi Perfil", description: "Información personal, aseguradora y preferencias de contacto" },
  ];

  const doctorFeatures = [
    { icon: Calendar, title: "Agenda Inteligente", description: "Vista de citas por día, semana o mes con confirmaciones rápidas" },
    { icon: Users, title: "Mis Pacientes", description: "Acceso inmediato al historial clínico completo y notas médicas" },
    { icon: Pill, title: "Prescripciones Digitales", description: "Crear fórmulas y tratamientos con posibilidad de adjuntar archivos" },
    { icon: ClipboardCheck, title: "Historias Clínicas", description: "Registro estructurado con búsqueda avanzada por paciente" },
    { icon: BarChart3, title: "Dashboard de Desempeño", description: "Métricas de pacientes atendidos, tiempos y satisfacción" },
    { icon: Stethoscope, title: "Perfil Profesional", description: "Especialidad, horarios de atención y datos de contacto" },
  ];

  const adminFeatures = [
    { icon: Users, title: "Gestión de Usuarios", description: "Registro, edición de pacientes y profesionales con roles personalizados" },
    { icon: Calendar, title: "Citas Globales", description: "Control total de agendas con filtros por fecha, profesional o especialidad" },
    { icon: Shield, title: "Historias Clínicas Seguras", description: "Visualización con control de accesos y trazabilidad completa" },
    { icon: BarChart3, title: "Estadísticas en Tiempo Real", description: "Gráficos de productividad, pacientes nuevos y rendimiento general" },
    { icon: Settings, title: "Configuración Central", description: "Administra horarios, especialidades, notificaciones y políticas" },
    { icon: Download, title: "Exportación Avanzada", description: "Reportes descargables en PDF y Excel con datos personalizados" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent via-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={healixLogo} alt="Healix Pro" className="h-10 w-10" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Healix Pro
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="font-medium">Iniciar sesión</Button>
            </Link>
            <Link to="/registro">
              <Button className="gap-2 font-medium shadow-lg shadow-primary/20">
                Registrarse <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-8">
            <motion.img 
              src={healixLogo} 
              alt="Healix Pro Logo" 
              className="h-28 w-28 drop-shadow-2xl"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Tu consultorio digital,{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              más inteligente
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
            Gestiona pacientes, citas y diagnósticos con tecnología de vanguardia
          </p>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Diseñado para profesionales de la salud que buscan eficiencia, seguridad y una experiencia excepcional
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/registro">
              <Button size="lg" className="text-lg gap-2 px-8 py-6 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all">
                Comenzar gratis <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:bg-accent">
                Ver demo
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Seguridad certificada</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span>+500 profesionales</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-primary" />
              <span>Soporte 24/7</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-transparent to-card/30">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Todo lo que necesitas en un solo lugar
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades diseñadas pensando en la eficiencia y el cuidado de tus pacientes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Patient Panel Section */}
      <section className="container mx-auto px-4 py-24 bg-gradient-to-br from-accent/30 via-transparent to-accent/30 rounded-3xl my-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full mb-6">
              <Activity className="w-6 h-6 text-primary" />
              <span className="font-semibold text-primary">Para Pacientes</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Tu salud, siempre accesible
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Un espacio intuitivo y seguro donde puedes gestionar toda tu información médica desde cualquier lugar.
              Agenda citas, consulta tu historial y mantén el control de tu bienestar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patientFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-l-4 border-l-primary hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-card rounded-2xl border-2 border-primary/20">
            <div className="flex items-start gap-4">
              <Bell className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-2">Extras incluidos</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Notificaciones push y recordatorios automáticos por correo electrónico
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Teleconsultas integradas con videollamada segura
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Doctor Panel Section */}
      <section className="container mx-auto px-4 py-24 bg-gradient-to-br from-medical-mint/20 via-transparent to-medical-mint/20 rounded-3xl my-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-secondary/20 rounded-full mb-6">
              <Stethoscope className="w-6 h-6 text-secondary-foreground" />
              <span className="font-semibold text-secondary-foreground">Para Profesionales de la Salud</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Optimiza tu práctica médica
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Herramientas diseñadas para mejorar tu flujo de trabajo diario. Dedica más tiempo a tus pacientes
              y menos a tareas administrativas con tecnología inteligente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctorFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-l-4 border-l-secondary hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-card rounded-2xl border-2 border-secondary/30">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-6 h-6 text-secondary-foreground flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-2">Ventajas adicionales</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                    Dashboard con métricas de desempeño y satisfacción del paciente
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                    Alertas automáticas para nuevas citas o cambios en la agenda
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Admin Panel Section */}
      <section className="container mx-auto px-4 py-24 bg-gradient-to-br from-medical-lavender/20 via-transparent to-medical-lavender/20 rounded-3xl my-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-medical-lavender/30 rounded-full mb-6">
              <Settings className="w-6 h-6 text-foreground" />
              <span className="font-semibold text-foreground">Para Administradores</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Control total de tu organización
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Gestiona clínicas, EPS o consultorios con un centro de comando completo. 
              Supervisión en tiempo real, estadísticas detalladas y configuración centralizada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-l-4 border-l-medical-lavender hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-medical-lavender/20 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-card rounded-2xl border-2 border-medical-lavender/30">
            <div className="flex items-start gap-4">
              <Download className="w-6 h-6 text-foreground flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-2">Funciones premium</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-medical-lavender"></div>
                    Módulo opcional de pagos y facturación integrado
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-medical-lavender"></div>
                    Exportación avanzada de reportes en múltiples formatos (PDF, Excel, CSV)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary via-primary to-secondary rounded-3xl p-12 md:p-16 text-center text-primary-foreground shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para transformar tu práctica médica?
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-3xl mx-auto">
              Únete a cientos de profesionales de la salud que ya confían en Healix Pro para ofrecer una mejor experiencia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/registro">
                <Button size="lg" variant="secondary" className="text-lg gap-2 px-8 py-6 font-semibold shadow-xl hover:scale-105 transition-transform">
                  Crear cuenta gratis <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Ver todas las funciones
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex items-center justify-center gap-8 text-sm opacity-90 flex-wrap">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Setup en 5 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5" />
                <span>Soporte incluido</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={healixLogo} alt="Healix Pro" className="h-10 w-10" />
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Healix Pro
                </span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Plataforma integral de gestión médica diseñada para modernizar consultorios, 
                clínicas y centros de salud con tecnología de vanguardia.
              </p>
              <div className="flex gap-2">
                <Link to="/registro">
                  <Button size="sm" variant="default">Comenzar ahora</Button>
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Plataforma</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/login" className="hover:text-primary transition-colors">Iniciar sesión</Link></li>
                <li><Link to="/registro" className="hover:text-primary transition-colors">Registrarse</Link></li>
                <li><a href="#features" className="hover:text-primary transition-colors">Funcionalidades</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Precios</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Soporte</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Política de privacidad</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Términos y condiciones</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Healix Pro. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-primary transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
