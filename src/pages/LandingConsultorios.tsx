import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight, Calendar, Users, BarChart3, DollarSign,
    CheckCircle2, Clock, Shield, Star, Zap, MessageCircle,
    Building2, Phone, Mail, Stethoscope, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import kenkoLogo from "@/assets/kenko-logo.png";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import ChatbotFloating from "@/components/ChatbotFloating";

const features = [
    {
        icon: Calendar,
        title: "Agenda Inteligente",
        description: "Sistema de citas con recordatorios automáticos y reducción de inasistencias hasta en un 80%."
    },
    {
        icon: Users,
        title: "Nuevos Pacientes",
        description: "Atrae pacientes de toda la ciudad que buscan activamente servicios médicos."
    },
    {
        icon: BarChart3,
        title: "Análisis Detallado",
        description: "Dashboards en tiempo real con métricas de ocupación, ingresos y rendimiento."
    },
    {
        icon: DollarSign,
        title: "Pagos Seguros",
        description: "Recibe pagos en línea de forma segura con múltiples métodos disponibles."
    },
    {
        icon: Shield,
        title: "Datos Protegidos",
        description: "Cumplimiento HIPAA y encriptación de nivel bancario para historias clínicas."
    },
    {
        icon: Zap,
        title: "Fácil de Usar",
        description: "Interfaz intuitiva. Tu equipo estará operando en menos de 24 horas."
    }
];

const testimonials = [
    {
        name: "Dra. María González",
        role: "Odontóloga - Clínica Sonrisa",
        content: "Desde que nos unimos a Kenkō, nuestras citas aumentaron un 40%. La plataforma es increíblemente fácil de usar.",
        rating: 5
    },
    {
        name: "Dr. Carlos Mendoza",
        role: "Director - Centro Médico Salud+",
        content: "La gestión de pacientes y citas nunca había sido tan simple. Recomiendo Kenkō a todos mis colegas.",
        rating: 5
    },
    {
        name: "Dra. Ana Torres",
        role: "Psicóloga Clínica",
        content: "El sistema de telemedicina integrado me permite atender pacientes de cualquier parte. Excelente inversión.",
        rating: 5
    }
];

const stats = [
    { value: "500+", label: "Consultorios activos" },
    { value: "50K+", label: "Citas mensuales" },
    { value: "40%", label: "Más pacientes" },
    { value: "99.9%", label: "Uptime" }
];

export default function LandingConsultorios() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3">
                            <img src={kenkoLogo} alt="Kenkō" className="h-12 w-auto" />
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            <Link to="/pacientes" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Soy Paciente
                            </Link>
                            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Características
                            </a>
                            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Precios
                            </a>
                        </nav>

                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <Button variant="ghost">Iniciar sesión</Button>
                            </Link>
                            <Link to="/registro/consultorio">
                                <Button className="gap-2">
                                    Registrar consultorio <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/10" />

                {/* Decorative elements */}
                <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                        >
                            <motion.div variants={fadeInUp} className="mb-6">
                                <Badge variant="secondary" className="text-sm px-4 py-2">
                                    🚀 Para profesionales de la salud
                                </Badge>
                            </motion.div>

                            <motion.h1
                                variants={fadeInUp}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                            >
                                Haz crecer tu
                                <br />
                                <span className="text-primary">consultorio</span> con Kenkō
                            </motion.h1>

                            <motion.p
                                variants={fadeInUp}
                                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg"
                            >
                                Únete al marketplace médico más grande de Colombia. Atrae nuevos pacientes,
                                gestiona citas y aumenta tus ingresos.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-8">
                                <Link to="/registro/consultorio">
                                    <Button size="lg" className="text-lg gap-2 px-8 w-full sm:w-auto">
                                        Comenzar gratis <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="/contacto">
                                    <Button size="lg" variant="outline" className="text-lg gap-2 px-8 w-full sm:w-auto">
                                        <MessageCircle className="w-5 h-5" />
                                        Hablar con ventas
                                    </Button>
                                </Link>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>Sin costo de registro</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>Activo en 24 horas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>Soporte incluido</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Stats cards */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {stats.map((stat, index) => (
                                <Card key={index} className="bg-card/80 backdrop-blur border-2 hover:border-primary/30 transition-colors">
                                    <CardContent className="p-6 text-center">
                                        <p className="text-4xl font-bold text-primary mb-1">{stat.value}</p>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-accent/30">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Todo lo que necesitas para{" "}
                            <span className="text-primary">crecer</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Herramientas diseñadas para optimizar tu práctica médica
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
                                <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                                            <feature.icon className="w-7 h-7 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Comienza en <span className="text-primary">3 pasos</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                step: "1",
                                icon: Building2,
                                title: "Registra tu consultorio",
                                description: "Completa el formulario con los datos de tu consultorio en menos de 5 minutos."
                            },
                            {
                                step: "2",
                                icon: Stethoscope,
                                title: "Configura servicios",
                                description: "Agrega tus servicios, precios y horarios de atención."
                            },
                            {
                                step: "3",
                                icon: TrendingUp,
                                title: "Recibe pacientes",
                                description: "Empieza a recibir citas de pacientes que buscan tus servicios."
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="text-center relative"
                            >
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
                                )}
                                <div className="relative w-20 h-20 mx-auto mb-6">
                                    <div className="absolute inset-0 rounded-2xl bg-primary/10" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <item.icon className="w-9 h-9 text-primary" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-accent/30">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Lo que dicen nuestros <span className="text-primary">clientes</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {testimonials.map((testimonial, index) => (
                            <motion.div key={index} variants={fadeInUp}>
                                <Card className="h-full">
                                    <CardContent className="p-6">
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                                        <div>
                                            <p className="font-semibold">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Planes simples y <span className="text-primary">transparentes</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Sin costos ocultos. Paga solo por lo que usas.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {/* Free Plan */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <Card className="h-full">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold mb-2">Básico</h3>
                                    <p className="text-muted-foreground mb-6">Perfecto para empezar</p>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">Gratis</span>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {[
                                            "Hasta 20 citas/mes",
                                            "Perfil público",
                                            "1 profesional",
                                            "Soporte por email"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                <span className="text-sm">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to="/registro/consultorio">
                                        <Button variant="outline" className="w-full">Comenzar gratis</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Pro Plan */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <Card className="h-full border-primary border-2 relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-primary">Más popular</Badge>
                                </div>
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold mb-2">Profesional</h3>
                                    <p className="text-muted-foreground mb-6">Para consultorios en crecimiento</p>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">$99.000</span>
                                        <span className="text-muted-foreground">/mes</span>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {[
                                            "Citas ilimitadas",
                                            "Hasta 5 profesionales",
                                            "Recordatorios SMS",
                                            "Reportes avanzados",
                                            "Soporte prioritario"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                <span className="text-sm">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to="/registro/consultorio">
                                        <Button className="w-full">Comenzar prueba gratis</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Enterprise */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <Card className="h-full">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold mb-2">Empresarial</h3>
                                    <p className="text-muted-foreground mb-6">Para clínicas y redes</p>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">Personalizado</span>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {[
                                            "Todo de Profesional",
                                            "Profesionales ilimitados",
                                            "API personalizada",
                                            "Múltiples sedes",
                                            "Gerente de cuenta dedicado"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                <span className="text-sm">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to="/contacto">
                                        <Button variant="outline" className="w-full">Contactar ventas</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.h2
                            variants={fadeInUp}
                            className="text-3xl md:text-5xl font-bold mb-6 text-primary-foreground"
                        >
                            ¿Listo para hacer crecer
                            <br />
                            tu consultorio?
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto"
                        >
                            Únete a cientos de profesionales que ya confían en Kenkō
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/registro/consultorio">
                                <Button size="lg" variant="secondary" className="text-lg gap-2 px-8">
                                    Registrar consultorio <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/contacto">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="text-lg gap-2 px-8 bg-transparent border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                                >
                                    <Phone className="w-5 h-5" />
                                    Hablar con un experto
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-card border-t py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={kenkoLogo} alt="Kenkō" className="h-10 w-auto" />
                        </Link>
                        <nav className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                            <Link to="/pacientes" className="hover:text-primary transition-colors">Soy Paciente</Link>
                            <a href="#features" className="hover:text-primary transition-colors">Características</a>
                            <a href="#pricing" className="hover:text-primary transition-colors">Precios</a>
                            <Link to="/terminos" className="hover:text-primary transition-colors">Términos</Link>
                            <Link to="/privacidad" className="hover:text-primary transition-colors">Privacidad</Link>
                        </nav>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Kenkō. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Accessibility & Chatbot */}
            <AccessibilityToolbar />
            <ChatbotFloating />
        </div>
    );
}
