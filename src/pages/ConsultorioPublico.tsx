import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    MapPin, Star, Phone, Mail, Clock, Calendar, ArrowLeft,
    CheckCircle2, Share2, Heart, Stethoscope, Users, MessageCircle,
    ChevronRight, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import kenkoLogo from "@/assets/kenko-logo.png";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import ChatbotFloating from "@/components/ChatbotFloating";
import { Consultorio, Servicio, ProfesionalSalud } from "@/types";

// Mock data
const mockConsultorio: Consultorio = {
    id: 1,
    nombre: "Clínica Dental Sonrisa",
    slug: "clinica-dental-sonrisa",
    descripcion: "Somos un centro odontológico especializado con más de 15 años de experiencia brindando atención de calidad. Nuestro equipo de profesionales altamente calificados utiliza tecnología de última generación para garantizar los mejores resultados en cada tratamiento.",
    direccion: "Calle 100 #15-20, Usaquén",
    ciudad: "Bogotá",
    telefono: "+57 1 234 5678",
    email: "contacto@sonrisa.com",
    especialidades: ["Odontología General", "Ortodoncia", "Implantes", "Blanqueamiento", "Endodoncia"],
    horarioAtencion: {
        "Lunes": "8:00 AM - 6:00 PM",
        "Martes": "8:00 AM - 6:00 PM",
        "Miércoles": "8:00 AM - 6:00 PM",
        "Jueves": "8:00 AM - 6:00 PM",
        "Viernes": "8:00 AM - 6:00 PM",
        "Sábado": "9:00 AM - 2:00 PM"
    },
    activo: true,
    verificado: true,
    rating: 4.9,
    totalReviews: 128
};

const mockServicios: Servicio[] = [
    { id: 1, consultorioId: 1, nombre: "Consulta General", descripcion: "Evaluación dental completa", precio: 50000, duracionMinutos: 30, especialidad: "Odontología General", activo: true },
    { id: 2, consultorioId: 1, nombre: "Limpieza Dental", descripcion: "Profilaxis y eliminación de sarro", precio: 80000, duracionMinutos: 45, especialidad: "Odontología General", activo: true },
    { id: 3, consultorioId: 1, nombre: "Blanqueamiento", descripcion: "Blanqueamiento dental profesional", precio: 350000, duracionMinutos: 60, especialidad: "Estética Dental", activo: true },
    { id: 4, consultorioId: 1, nombre: "Ortodoncia Consulta", descripcion: "Evaluación para brackets o alineadores", precio: 100000, duracionMinutos: 45, especialidad: "Ortodoncia", activo: true },
    { id: 5, consultorioId: 1, nombre: "Extracción Simple", descripcion: "Extracción de diente simple", precio: 120000, duracionMinutos: 30, especialidad: "Cirugía Oral", activo: true }
];

const mockProfesionales: ProfesionalSalud[] = [
    { id: 1, nombre: "María", apellido: "González", especialidad: "Odontología General", email: "maria@sonrisa.com", telefono: "+57 300 111 2222", numeroLicencia: "12345" },
    { id: 2, nombre: "Carlos", apellido: "Rodríguez", especialidad: "Ortodoncia", email: "carlos@sonrisa.com", telefono: "+57 300 333 4444", numeroLicencia: "23456" },
    { id: 3, nombre: "Ana", apellido: "Martínez", especialidad: "Endodoncia", email: "ana@sonrisa.com", telefono: "+57 300 555 6666", numeroLicencia: "34567" }
];

const mockReviews = [
    { id: 1, nombre: "Juan P.", rating: 5, comentario: "Excelente atención, muy profesionales. Me hicieron una limpieza dental y quedé muy satisfecho.", fecha: "Hace 2 días" },
    { id: 2, nombre: "Laura M.", rating: 5, comentario: "La Dra. González es increíble. Muy paciente y explica todo detalladamente.", fecha: "Hace 1 semana" },
    { id: 3, nombre: "Pedro S.", rating: 4, comentario: "Buen servicio, aunque a veces hay un poco de espera. Recomendado.", fecha: "Hace 2 semanas" }
];

export default function ConsultorioPublico() {
    const { slug } = useParams();
    const [activeTab, setActiveTab] = useState("servicios");
    const [isFavorite, setIsFavorite] = useState(false);

    // In real app, fetch consultorio by slug
    const consultorio = mockConsultorio;

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/buscar">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/">
                                <img src={kenkoLogo} alt="Kenkō" className="h-10 w-auto" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Share2 className="w-5 h-5" />
                            </Button>
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Iniciar sesión</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="pt-20">
                {/* Hero Banner */}
                <div className="h-48 md:h-64 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                </div>

                <div className="container mx-auto px-6 -mt-20 relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="flex flex-col md:flex-row gap-6 items-start"
                    >
                        {/* Logo */}
                        <div className="w-32 h-32 rounded-2xl bg-card border-4 border-background shadow-xl flex items-center justify-center shrink-0">
                            <Stethoscope className="w-16 h-16 text-primary" />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold">{consultorio.nombre}</h1>
                                {consultorio.verificado && (
                                    <Badge className="bg-green-500">
                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verificado
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{consultorio.ciudad}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-foreground">{consultorio.rating}</span>
                                    <span>({consultorio.totalReviews} reseñas)</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {consultorio.especialidades?.map((esp, i) => (
                                    <Badge key={i} variant="secondary">{esp}</Badge>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link to={`/agendar/${consultorio.slug}`}>
                                    <Button size="lg" className="gap-2">
                                        <Calendar className="w-5 h-5" /> Agendar cita
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="gap-2">
                                    <Phone className="w-5 h-5" /> Llamar
                                </Button>
                                <Button size="lg" variant="outline" className="gap-2">
                                    <MessageCircle className="w-5 h-5" /> Mensaje
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-10">
                        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
                            {[
                                { value: "servicios", label: "Servicios" },
                                { value: "profesionales", label: "Profesionales" },
                                { value: "horarios", label: "Horarios" },
                                { value: "resenas", label: "Reseñas" },
                                { value: "info", label: "Información" }
                            ].map(tab => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Servicios Tab */}
                        <TabsContent value="servicios" className="mt-8">
                            <div className="grid gap-4">
                                {mockServicios.map((servicio) => (
                                    <Card key={servicio.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg mb-1">{servicio.nombre}</h3>
                                                    <p className="text-muted-foreground text-sm mb-2">{servicio.descripcion}</p>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" /> {servicio.duracionMinutos} min
                                                        </span>
                                                        <Badge variant="outline">{servicio.especialidad}</Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-primary">
                                                            ${servicio.precio.toLocaleString()}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">COP</p>
                                                    </div>
                                                    <Link to={`/agendar/${consultorio.slug}?servicio=${servicio.id}`}>
                                                        <Button>Agendar</Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Profesionales Tab */}
                        <TabsContent value="profesionales" className="mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {mockProfesionales.map((prof) => (
                                    <Card key={prof.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6 text-center">
                                            <Avatar className="w-20 h-20 mx-auto mb-4">
                                                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                                    {prof.nombre[0]}{prof.apellido[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <h3 className="font-semibold text-lg">
                                                Dr(a). {prof.nombre} {prof.apellido}
                                            </h3>
                                            <p className="text-muted-foreground mb-4">{prof.especialidad}</p>
                                            <Link to={`/agendar/${consultorio.slug}?profesional=${prof.id}`}>
                                                <Button variant="outline" className="w-full gap-2">
                                                    <Calendar className="w-4 h-4" /> Ver disponibilidad
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Horarios Tab */}
                        <TabsContent value="horarios" className="mt-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" /> Horario de Atención
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {Object.entries(consultorio.horarioAtencion || {}).map(([dia, horario]) => (
                                            <div key={dia} className="flex justify-between py-2 border-b last:border-0">
                                                <span className="font-medium">{dia}</span>
                                                <span className="text-muted-foreground">{horario}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between py-2">
                                            <span className="font-medium">Domingo</span>
                                            <span className="text-muted-foreground">Cerrado</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Reseñas Tab */}
                        <TabsContent value="resenas" className="mt-8">
                            <div className="grid gap-6">
                                {/* Rating Summary */}
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-8">
                                            <div className="text-center">
                                                <p className="text-5xl font-bold text-primary mb-1">{consultorio.rating}</p>
                                                <div className="flex gap-1 justify-center mb-1">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <Star key={i} className={`w-5 h-5 ${i <= Math.round(consultorio.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                                                    ))}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{consultorio.totalReviews} reseñas</p>
                                            </div>
                                            <div className="flex-1">
                                                {[5, 4, 3, 2, 1].map(rating => (
                                                    <div key={rating} className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm w-3">{rating}</span>
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-yellow-400 rounded-full"
                                                                style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 10}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Reviews List */}
                                {mockReviews.map((review) => (
                                    <Card key={review.id}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <Avatar>
                                                    <AvatarFallback>{review.nombre[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div>
                                                            <p className="font-semibold">{review.nombre}</p>
                                                            <p className="text-xs text-muted-foreground">{review.fecha}</p>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map(i => (
                                                                <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-muted-foreground">{review.comentario}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Info Tab */}
                        <TabsContent value="info" className="mt-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Acerca de nosotros</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{consultorio.descripcion}</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Contacto</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Dirección</p>
                                                <p className="font-medium">{consultorio.direccion}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Teléfono</p>
                                                <p className="font-medium">{consultorio.telefono}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Email</p>
                                                <p className="font-medium">{consultorio.email}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sticky CTA for mobile */}
                <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 md:hidden z-40">
                    <Link to={`/agendar/${consultorio.slug}`}>
                        <Button className="w-full gap-2" size="lg">
                            <Calendar className="w-5 h-5" /> Agendar cita
                        </Button>
                    </Link>
                </div>
            </main>

            {/* Accessibility & Chatbot */}
            <AccessibilityToolbar />
            <ChatbotFloating />
        </div>
    );
}
