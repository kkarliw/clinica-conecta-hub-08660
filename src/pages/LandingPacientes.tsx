import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Search, MapPin, Star, Stethoscope, Heart, Baby,
    Brain, Bone, Eye, Smile, Shield, Clock, ArrowRight,
    CheckCircle2, Users, Calendar, Phone, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import kenkoLogo from "@/assets/kenko-logo.png";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import ChatbotFloating from "@/components/ChatbotFloating";
import { Consultorio } from "@/types";

// Mock data for featured consultorios
const mockConsultorios: Consultorio[] = [
    {
        id: 1,
        nombre: "Clínica Dental Sonrisa",
        slug: "clinica-dental-sonrisa",
        descripcion: "Especialistas en odontología estética y general",
        direccion: "Calle 100 #15-20",
        ciudad: "Bogotá",
        telefono: "+57 1 234 5678",
        email: "contacto@sonrisa.com",
        logoUrl: "",
        especialidades: ["Odontología General", "Ortodoncia", "Implantes"],
        activo: true,
        verificado: true,
        rating: 4.9,
        totalReviews: 128
    },
    {
        id: 2,
        nombre: "Centro Médico Salud Integral",
        slug: "salud-integral",
        descripcion: "Atención médica completa para toda la familia",
        direccion: "Carrera 7 #45-10",
        ciudad: "Bogotá",
        telefono: "+57 1 987 6543",
        email: "info@saludintegral.com",
        especialidades: ["Medicina General", "Pediatría", "Ginecología"],
        activo: true,
        verificado: true,
        rating: 4.8,
        totalReviews: 256
    },
    {
        id: 3,
        nombre: "Fisioterapia & Bienestar",
        slug: "fisio-bienestar",
        descripcion: "Recuperación y rehabilitación física especializada",
        direccion: "Av. 19 #120-45",
        ciudad: "Bogotá",
        telefono: "+57 1 555 1234",
        email: "citas@fisiobienestar.com",
        especialidades: ["Fisioterapia", "Rehabilitación", "Terapia Deportiva"],
        activo: true,
        verificado: true,
        rating: 4.7,
        totalReviews: 89
    }
];

const especialidades = [
    { icon: Heart, name: "Cardiología", color: "bg-red-500/10 text-red-600" },
    { icon: Baby, name: "Pediatría", color: "bg-pink-500/10 text-pink-600" },
    { icon: Brain, name: "Neurología", color: "bg-purple-500/10 text-purple-600" },
    { icon: Bone, name: "Traumatología", color: "bg-orange-500/10 text-orange-600" },
    { icon: Eye, name: "Oftalmología", color: "bg-blue-500/10 text-blue-600" },
    { icon: Smile, name: "Odontología", color: "bg-cyan-500/10 text-cyan-600" },
    { icon: Stethoscope, name: "Medicina General", color: "bg-green-500/10 text-green-600" },
    { icon: Users, name: "Psicología", color: "bg-indigo-500/10 text-indigo-600" }
];

export default function LandingPacientes() {
    const [searchQuery, setSearchQuery] = useState("");
    const [cityQuery, setCityQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.set("especialidad", searchQuery);
        if (cityQuery) params.set("ciudad", cityQuery);
        navigate(`/buscar?${params.toString()}`);
    };

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
                            <Link to="/buscar" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Buscar Consultorios
                            </Link>
                            <Link to="/para-consultorios" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Para Consultorios
                            </Link>
                        </nav>

                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <Button variant="ghost">Iniciar sesión</Button>
                            </Link>
                            <Link to="/registro">
                                <Button className="gap-2">
                                    Registrarme <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

                {/* Decorative elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="mb-6">
                            <Badge variant="secondary" className="text-sm px-4 py-2">
                                🏥 +500 consultorios verificados
                            </Badge>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                        >
                            Encuentra tu{" "}
                            <span className="text-primary">médico ideal</span>
                            <br />
                            cerca de ti
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
                        >
                            Busca entre cientos de consultorios, compara precios y agenda tu cita en minutos.
                            Atención médica de calidad al alcance de un clic.
                        </motion.p>

                        {/* Search Form */}
                        <motion.form
                            variants={fadeInUp}
                            onSubmit={handleSearch}
                            className="bg-card rounded-2xl shadow-2xl p-4 md:p-6 border max-w-3xl mx-auto"
                        >
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="¿Qué especialidad necesitas?"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 h-14 text-lg border-0 bg-muted/50"
                                    />
                                </div>
                                <div className="flex-1 relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="¿En qué ciudad?"
                                        value={cityQuery}
                                        onChange={(e) => setCityQuery(e.target.value)}
                                        className="pl-12 h-14 text-lg border-0 bg-muted/50"
                                    />
                                </div>
                                <Button type="submit" size="lg" className="h-14 px-8 text-lg gap-2">
                                    <Search className="w-5 h-5" />
                                    Buscar
                                </Button>
                            </div>
                        </motion.form>

                        {/* Trust badges */}
                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-muted-foreground"
                        >
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-primary" />
                                <span>Consultorios verificados</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>Agenda en minutos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span>100% gratis para pacientes</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Especialidades Section */}
            <section className="py-20 bg-accent/30">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Explora por <span className="text-primary">especialidad</span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Encuentra el profesional perfecto para tus necesidades de salud
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {especialidades.map((esp, index) => (
                            <motion.div key={index} variants={fadeInUp}>
                                <Link to={`/buscar?especialidad=${esp.name.toLowerCase()}`}>
                                    <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer group">
                                        <CardContent className="p-6 text-center">
                                            <div className={`w-14 h-14 rounded-2xl ${esp.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                                <esp.icon className="w-7 h-7" />
                                            </div>
                                            <h3 className="font-semibold">{esp.name}</h3>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Featured Consultorios */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="flex items-center justify-between mb-12"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">
                                Consultorios <span className="text-primary">destacados</span>
                            </h2>
                            <p className="text-muted-foreground">
                                Los mejor valorados por nuestros pacientes
                            </p>
                        </div>
                        <Link to="/buscar">
                            <Button variant="outline" className="gap-2">
                                Ver todos <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {mockConsultorios.map((consultorio) => (
                            <motion.div key={consultorio.id} variants={fadeInUp}>
                                <Link to={`/consultorio/${consultorio.slug}`}>
                                    <Card className="overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 group h-full">
                                        {/* Banner placeholder */}
                                        <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 relative">
                                            <div className="absolute -bottom-8 left-6">
                                                <div className="w-16 h-16 rounded-2xl bg-primary/10 border-4 border-card flex items-center justify-center">
                                                    <Stethoscope className="w-8 h-8 text-primary" />
                                                </div>
                                            </div>
                                            {consultorio.verificado && (
                                                <Badge className="absolute top-4 right-4 bg-green-500">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Verificado
                                                </Badge>
                                            )}
                                        </div>

                                        <CardContent className="pt-12 pb-6 px-6">
                                            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                                                {consultorio.nombre}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {consultorio.ciudad}
                                            </p>

                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                {consultorio.descripcion}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {consultorio.especialidades?.slice(0, 2).map((esp, i) => (
                                                    <Badge key={i} variant="secondary" className="text-xs">
                                                        {esp}
                                                    </Badge>
                                                ))}
                                                {(consultorio.especialidades?.length || 0) > 2 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{(consultorio.especialidades?.length || 0) - 2} más
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-semibold">{consultorio.rating}</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        ({consultorio.totalReviews} reseñas)
                                                    </span>
                                                </div>
                                                <Button size="sm" variant="ghost" className="gap-1">
                                                    Ver perfil <ArrowRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How it works */}
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
                            Cómo funciona
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            Agenda tu cita médica en 3 simples pasos
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                step: "1",
                                icon: Search,
                                title: "Busca",
                                description: "Encuentra consultorios por especialidad, ubicación o nombre"
                            },
                            {
                                step: "2",
                                icon: Calendar,
                                title: "Compara",
                                description: "Revisa perfiles, precios y disponibilidad de horarios"
                            },
                            {
                                step: "3",
                                icon: CheckCircle2,
                                title: "Agenda",
                                description: "Reserva tu cita en segundos y recibe confirmación"
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
                            ¿Listo para encontrar
                            <br />
                            tu médico ideal?
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto"
                        >
                            Miles de pacientes ya confían en Kenkō para gestionar su salud
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/buscar">
                                <Button size="lg" variant="secondary" className="text-lg gap-2 px-8">
                                    Buscar consultorios <Search className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/registro">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="text-lg gap-2 px-8 bg-transparent border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                                >
                                    Crear cuenta gratis <ArrowRight className="w-5 h-5" />
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
                            <Link to="/buscar" className="hover:text-primary transition-colors">Buscar</Link>
                            <Link to="/para-consultorios" className="hover:text-primary transition-colors">Para Consultorios</Link>
                            <Link to="/terminos" className="hover:text-primary transition-colors">Términos</Link>
                            <Link to="/privacidad" className="hover:text-primary transition-colors">Privacidad</Link>
                            <Link to="/contacto" className="hover:text-primary transition-colors">Contacto</Link>
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
