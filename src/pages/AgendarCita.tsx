import { useState, useMemo } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft, Calendar, Clock, User, Mail, Phone, MapPin,
    CheckCircle2, ChevronLeft, ChevronRight, Stethoscope,
    CreditCard, Shield, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import kenkoLogo from "@/assets/kenko-logo.png";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import ChatbotFloating from "@/components/ChatbotFloating";
import { Consultorio, Servicio } from "@/types";

// Mock data
const mockConsultorio: Consultorio = {
    id: 1,
    nombre: "Clínica Dental Sonrisa",
    slug: "clinica-dental-sonrisa",
    descripcion: "Centro odontológico especializado",
    direccion: "Calle 100 #15-20, Usaquén",
    ciudad: "Bogotá",
    telefono: "+57 1 234 5678",
    email: "contacto@sonrisa.com",
    especialidades: ["Odontología General", "Ortodoncia", "Implantes"],
    activo: true,
    verificado: true,
    rating: 4.9,
    totalReviews: 128
};

const mockServicios: Servicio[] = [
    { id: 1, consultorioId: 1, nombre: "Consulta General", descripcion: "Evaluación dental completa", precio: 50000, duracionMinutos: 30, especialidad: "Odontología General", activo: true },
    { id: 2, consultorioId: 1, nombre: "Limpieza Dental", descripcion: "Profilaxis y eliminación de sarro", precio: 80000, duracionMinutos: 45, especialidad: "Odontología General", activo: true },
    { id: 3, consultorioId: 1, nombre: "Blanqueamiento", descripcion: "Blanqueamiento dental profesional", precio: 350000, duracionMinutos: 60, especialidad: "Estética Dental", activo: true },
];

const mockHorarios = [
    { hora: "08:00", disponible: true },
    { hora: "08:30", disponible: true },
    { hora: "09:00", disponible: false },
    { hora: "09:30", disponible: true },
    { hora: "10:00", disponible: true },
    { hora: "10:30", disponible: false },
    { hora: "11:00", disponible: true },
    { hora: "11:30", disponible: true },
    { hora: "14:00", disponible: true },
    { hora: "14:30", disponible: false },
    { hora: "15:00", disponible: true },
    { hora: "15:30", disponible: true },
    { hora: "16:00", disponible: true },
    { hora: "16:30", disponible: true },
];

export default function AgendarCita() {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialServiceId = searchParams.get("servicio");

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedService, setSelectedService] = useState<number | null>(
        initialServiceId ? parseInt(initialServiceId) : null
    );
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        numeroDocumento: "",
        motivoConsulta: ""
    });

    const consultorio = mockConsultorio;

    const selectedServiceData = useMemo(() => 
        mockServicios.find(s => s.id === selectedService),
        [selectedService]
    );

    // Generate calendar days
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const calendarDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentYear, currentMonth, i);
            const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isWeekend = date.getDay() === 0;
            days.push({ day: i, date, disabled: isPast || isWeekend });
        }
        return days;
    }, [daysInMonth, firstDayOfMonth, currentMonth, currentYear, today]);

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNextStep = () => {
        if (step === 1 && !selectedService) {
            toast.error("Por favor selecciona un servicio");
            return;
        }
        if (step === 2 && (!selectedDate || !selectedTime)) {
            toast.error("Por favor selecciona fecha y hora");
            return;
        }
        if (step === 3) {
            if (!formData.nombre || !formData.email || !formData.telefono) {
                toast.error("Por favor completa los campos requeridos");
                return;
            }
        }
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setStep(5); // Success step
        } catch (error) {
            toast.error("Error al agendar la cita");
        } finally {
            setIsLoading(false);
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to={`/consultorio/${slug}`}>
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/">
                                <img src={kenkoLogo} alt="Kenkō" className="h-10 w-auto" />
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Shield className="w-4 h-4 text-green-500" />
                            Proceso seguro
                        </div>
                    </div>
                </div>
            </header>

            <main className="py-8">
                <div className="container mx-auto px-6 max-w-4xl">
                    {/* Progress Steps */}
                    {step < 5 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between max-w-md mx-auto">
                                {[1, 2, 3, 4].map((s) => (
                                    <div key={s} className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                                            s < step ? 'bg-green-500 text-white' : 
                                            s === step ? 'bg-primary text-primary-foreground' : 
                                            'bg-muted text-muted-foreground'
                                        }`}>
                                            {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                                        </div>
                                        {s < 4 && (
                                            <div className={`w-12 sm:w-20 h-1 mx-2 rounded ${
                                                s < step ? 'bg-green-500' : 'bg-muted'
                                            }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-muted-foreground">
                                <span>Servicio</span>
                                <span>Fecha</span>
                                <span>Datos</span>
                                <span>Confirmar</span>
                            </div>
                        </div>
                    )}

                    {/* Consultorio Info Bar */}
                    {step < 5 && (
                        <Card className="mb-6">
                            <CardContent className="py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Stethoscope className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-semibold truncate">{consultorio.nombre}</h2>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {consultorio.ciudad}
                                        </p>
                                    </div>
                                    {consultorio.verificado && (
                                        <Badge variant="secondary" className="shrink-0">
                                            <CheckCircle2 className="w-3 h-3 mr-1" /> Verificado
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 1: Service Selection */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                        >
                            <h1 className="text-2xl font-bold mb-6">Selecciona un servicio</h1>
                            <RadioGroup
                                value={selectedService?.toString()}
                                onValueChange={(v) => setSelectedService(parseInt(v))}
                                className="space-y-4"
                            >
                                {mockServicios.map((servicio) => (
                                    <Label
                                        key={servicio.id}
                                        htmlFor={`servicio-${servicio.id}`}
                                        className="cursor-pointer"
                                    >
                                        <Card className={`transition-all ${
                                            selectedService === servicio.id 
                                                ? 'border-primary ring-2 ring-primary/20' 
                                                : 'hover:border-primary/30'
                                        }`}>
                                            <CardContent className="p-6 flex items-center gap-4">
                                                <RadioGroupItem value={servicio.id.toString()} id={`servicio-${servicio.id}`} />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{servicio.nombre}</h3>
                                                    <p className="text-sm text-muted-foreground">{servicio.descripcion}</p>
                                                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" /> {servicio.duracionMinutos} min
                                                        </span>
                                                        <Badge variant="outline">{servicio.especialidad}</Badge>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-primary">
                                                        ${servicio.precio.toLocaleString()}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">COP</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Label>
                                ))}
                            </RadioGroup>
                        </motion.div>
                    )}

                    {/* Step 2: Date & Time Selection */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                        >
                            <h1 className="text-2xl font-bold mb-6">Selecciona fecha y hora</h1>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Calendar */}
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">
                                                {monthNames[currentMonth]} {currentYear}
                                            </CardTitle>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" disabled>
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" disabled>
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-7 gap-1 mb-2">
                                            {dayNames.map(day => (
                                                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-7 gap-1">
                                            {calendarDays.map((day, i) => (
                                                <div key={i}>
                                                    {day ? (
                                                        <button
                                                            type="button"
                                                            disabled={day.disabled}
                                                            onClick={() => setSelectedDate(day.date)}
                                                            className={`w-full aspect-square rounded-lg text-sm font-medium transition-colors ${
                                                                day.disabled
                                                                    ? 'text-muted-foreground/40 cursor-not-allowed'
                                                                    : selectedDate?.getDate() === day.day
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : 'hover:bg-accent'
                                                            }`}
                                                        >
                                                            {day.day}
                                                        </button>
                                                    ) : (
                                                        <div className="w-full aspect-square" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Time Slots */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Horarios disponibles</CardTitle>
                                        <CardDescription>
                                            {selectedDate 
                                                ? `${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]}`
                                                : 'Selecciona una fecha primero'
                                            }
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedDate ? (
                                            <div className="grid grid-cols-3 gap-2">
                                                {mockHorarios.map((slot) => (
                                                    <button
                                                        key={slot.hora}
                                                        type="button"
                                                        disabled={!slot.disponible}
                                                        onClick={() => setSelectedTime(slot.hora)}
                                                        className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                                                            !slot.disponible
                                                                ? 'bg-muted text-muted-foreground/40 cursor-not-allowed'
                                                                : selectedTime === slot.hora
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'bg-accent hover:bg-accent/80'
                                                        }`}
                                                    >
                                                        {slot.hora}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p>Selecciona una fecha para ver los horarios disponibles</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Patient Data */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                        >
                            <h1 className="text-2xl font-bold mb-6">Tus datos</h1>
                            
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="nombre">Nombre *</Label>
                                            <div className="relative mt-1">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="nombre"
                                                    placeholder="Tu nombre"
                                                    value={formData.nombre}
                                                    onChange={(e) => updateField("nombre", e.target.value)}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="apellido">Apellido</Label>
                                            <Input
                                                id="apellido"
                                                placeholder="Tu apellido"
                                                value={formData.apellido}
                                                onChange={(e) => updateField("apellido", e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Correo electrónico *</Label>
                                        <div className="relative mt-1">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="tu@email.com"
                                                value={formData.email}
                                                onChange={(e) => updateField("email", e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="telefono">Teléfono *</Label>
                                            <div className="relative mt-1">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="telefono"
                                                    type="tel"
                                                    placeholder="+57 300 000 0000"
                                                    value={formData.telefono}
                                                    onChange={(e) => updateField("telefono", e.target.value)}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="documento">Número de documento</Label>
                                            <Input
                                                id="documento"
                                                placeholder="Tu número de documento"
                                                value={formData.numeroDocumento}
                                                onChange={(e) => updateField("numeroDocumento", e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="motivo">Motivo de consulta</Label>
                                        <Textarea
                                            id="motivo"
                                            placeholder="Describe brevemente el motivo de tu consulta..."
                                            value={formData.motivoConsulta}
                                            onChange={(e) => updateField("motivoConsulta", e.target.value)}
                                            className="mt-1 resize-none"
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                        >
                            <h1 className="text-2xl font-bold mb-6">Confirma tu cita</h1>
                            
                            <div className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Resumen de la cita</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-muted-foreground">Servicio</span>
                                            <span className="font-medium">{selectedServiceData?.nombre}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-muted-foreground">Duración</span>
                                            <span className="font-medium">{selectedServiceData?.duracionMinutos} minutos</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-muted-foreground">Fecha</span>
                                            <span className="font-medium">
                                                {selectedDate && `${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]}, ${selectedDate.getFullYear()}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-muted-foreground">Hora</span>
                                            <span className="font-medium">{selectedTime}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-muted-foreground">Precio</span>
                                            <span className="text-2xl font-bold text-primary">
                                                ${selectedServiceData?.precio.toLocaleString()} COP
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Datos del paciente</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                        <p><span className="text-muted-foreground">Nombre:</span> {formData.nombre} {formData.apellido}</p>
                                        <p><span className="text-muted-foreground">Email:</span> {formData.email}</p>
                                        <p><span className="text-muted-foreground">Teléfono:</span> {formData.telefono}</p>
                                        {formData.motivoConsulta && (
                                            <p><span className="text-muted-foreground">Motivo:</span> {formData.motivoConsulta}</p>
                                        )}
                                    </CardContent>
                                </Card>

                                <div className="bg-accent/50 rounded-lg p-4 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <p className="text-sm text-muted-foreground">
                                        El pago se realiza directamente en el consultorio. Recibirás un correo de confirmación con los detalles de tu cita.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 5: Success */}
                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            className="text-center py-12"
                        >
                            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h1 className="text-3xl font-bold mb-4">¡Cita agendada!</h1>
                            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                                Tu cita ha sido confirmada. Hemos enviado los detalles a tu correo electrónico.
                            </p>

                            <Card className="max-w-md mx-auto mb-8">
                                <CardContent className="p-6 text-left space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        <span>
                                            {selectedDate && `${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]}`} a las {selectedTime}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Stethoscope className="w-5 h-5 text-primary" />
                                        <span>{selectedServiceData?.nombre}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <span>{consultorio.direccion}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/pacientes">
                                    <Button variant="outline" size="lg">
                                        Buscar más consultorios
                                    </Button>
                                </Link>
                                <Link to="/registro">
                                    <Button size="lg">
                                        Crear mi cuenta
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    {step < 5 && (
                        <div className="flex justify-between mt-8">
                            <Button
                                variant="ghost"
                                onClick={() => setStep(step - 1)}
                                disabled={step === 1}
                                className="gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" /> Atrás
                            </Button>

                            {step < 4 ? (
                                <Button onClick={handleNextStep} className="gap-2">
                                    Continuar <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={isLoading}
                                    className="gap-2"
                                >
                                    {isLoading ? (
                                        <>Procesando...</>
                                    ) : (
                                        <>
                                            <CreditCard className="w-4 h-4" /> Confirmar cita
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <AccessibilityToolbar />
            <ChatbotFloating />
        </div>
    );
}
