import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Building2, User, Mail, Lock, Phone, MapPin, ArrowRight, ArrowLeft,
    CheckCircle2, Stethoscope, Clock, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import kenkoLogo from "@/assets/kenko-logo.png";

const especialidades = [
    "Medicina General", "Odontología", "Pediatría", "Ginecología",
    "Cardiología", "Psicología", "Fisioterapia", "Nutrición",
    "Oftalmología", "Dermatología", "Traumatología", "Otra"
];

const ciudades = [
    "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena",
    "Bucaramanga", "Pereira", "Manizales", "Otra"
];

export default function RegistroConsultorio() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Consultorio data
        nombreConsultorio: "",
        especialidadPrincipal: "",
        direccion: "",
        ciudad: "",
        telefono: "",
        descripcion: "",
        // Admin user data
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNextStep = () => {
        if (step === 1) {
            if (!formData.nombreConsultorio || !formData.especialidadPrincipal || !formData.ciudad) {
                toast.error("Por favor completa los campos requeridos");
                return;
            }
        }
        setStep(step + 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success("¡Consultorio registrado exitosamente!");
            navigate("/consultorio/dashboard");
        } catch (error) {
            toast.error("Error al registrar el consultorio");
        } finally {
            setIsLoading(false);
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 border border-white/20 rounded-full" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 border border-white/20 rounded-full" />
                </div>

                <div className="relative z-10">
                    <Link to="/" className="inline-block">
                        <img src={kenkoLogo} alt="Kenkō" className="h-14 w-auto brightness-0 invert" />
                    </Link>
                </div>

                <div className="relative z-10 text-primary-foreground">
                    <h1 className="text-4xl font-bold mb-6">
                        Haz crecer tu consultorio con Kenkō
                    </h1>
                    <p className="text-lg text-primary-foreground/80 mb-8">
                        Únete a la plataforma médica líder y conecta con miles de pacientes que buscan tus servicios.
                    </p>

                    <div className="space-y-4">
                        {[
                            { icon: Calendar, text: "Recibe citas 24/7 sin esfuerzo" },
                            { icon: Stethoscope, text: "Gestiona tu equipo de profesionales" },
                            { icon: Clock, text: "Activo en menos de 24 horas" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-primary-foreground/60 text-sm">
                    © {new Date().getFullYear()} Kenkō. Todos los derechos reservados.
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="w-full max-w-lg"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link to="/">
                            <img src={kenkoLogo} alt="Kenkō" className="h-12 w-auto mx-auto" />
                        </Link>
                    </div>

                    <Card className="border-0 shadow-2xl">
                        <CardHeader className="text-center pb-4">
                            <CardTitle className="text-2xl">Registra tu consultorio</CardTitle>
                            <CardDescription>
                                {step === 1 ? "Información del consultorio" : "Información del administrador"}
                            </CardDescription>

                            {/* Step indicator */}
                            <div className="flex justify-center gap-2 mt-4">
                                {[1, 2].map(s => (
                                    <div
                                        key={s}
                                        className={`w-12 h-1.5 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'
                                            }`}
                                    />
                                ))}
                            </div>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                {step === 1 ? (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <Label htmlFor="nombreConsultorio">Nombre del consultorio *</Label>
                                            <div className="relative mt-1">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="nombreConsultorio"
                                                    type="text"
                                                    placeholder="Ej: Clínica Dental Sonrisa"
                                                    value={formData.nombreConsultorio}
                                                    onChange={(e) => updateField("nombreConsultorio", e.target.value)}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="especialidad">Especialidad principal *</Label>
                                            <Select
                                                value={formData.especialidadPrincipal}
                                                onValueChange={(value) => updateField("especialidadPrincipal", value)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Selecciona una especialidad" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {especialidades.map(esp => (
                                                        <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="ciudad">Ciudad *</Label>
                                            <Select
                                                value={formData.ciudad}
                                                onValueChange={(value) => updateField("ciudad", value)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Selecciona una ciudad" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ciudades.map(c => (
                                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="direccion">Dirección</Label>
                                            <div className="relative mt-1">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="direccion"
                                                    type="text"
                                                    placeholder="Calle 100 #15-20"
                                                    value={formData.direccion}
                                                    onChange={(e) => updateField("direccion", e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="telefonoConsultorio">Teléfono del consultorio</Label>
                                            <div className="relative mt-1">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="telefonoConsultorio"
                                                    type="tel"
                                                    placeholder="+57 1 234 5678"
                                                    value={formData.telefono}
                                                    onChange={(e) => updateField("telefono", e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="descripcion">Descripción breve</Label>
                                            <Textarea
                                                id="descripcion"
                                                placeholder="Cuéntanos sobre tu consultorio..."
                                                value={formData.descripcion}
                                                onChange={(e) => updateField("descripcion", e.target.value)}
                                                className="mt-1 resize-none"
                                                rows={3}
                                            />
                                        </div>

                                        <Button type="button" onClick={handleNextStep} className="w-full gap-2">
                                            Continuar <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="nombre">Nombre *</Label>
                                                <div className="relative mt-1">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        id="nombre"
                                                        type="text"
                                                        placeholder="Tu nombre"
                                                        value={formData.nombre}
                                                        onChange={(e) => updateField("nombre", e.target.value)}
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="apellido">Apellido *</Label>
                                                <Input
                                                    id="apellido"
                                                    type="text"
                                                    placeholder="Tu apellido"
                                                    value={formData.apellido}
                                                    onChange={(e) => updateField("apellido", e.target.value)}
                                                    className="mt-1"
                                                    required
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

                                        <div>
                                            <Label htmlFor="password">Contraseña *</Label>
                                            <div className="relative mt-1">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    placeholder="Mínimo 6 caracteres"
                                                    value={formData.password}
                                                    onChange={(e) => updateField("password", e.target.value)}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                                            <div className="relative mt-1">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="Repite tu contraseña"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <input type="checkbox" id="terms" className="mt-1 rounded" required />
                                            <label htmlFor="terms" className="text-sm text-muted-foreground">
                                                Acepto los{" "}
                                                <Link to="/terminos" className="text-primary hover:underline">
                                                    términos de servicio
                                                </Link>{" "}
                                                y la{" "}
                                                <Link to="/privacidad" className="text-primary hover:underline">
                                                    política de privacidad
                                                </Link>
                                            </label>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setStep(1)}
                                                className="gap-2"
                                            >
                                                <ArrowLeft className="w-4 h-4" /> Atrás
                                            </Button>
                                            <Button type="submit" className="flex-1 gap-2" disabled={isLoading}>
                                                {isLoading ? (
                                                    <>
                                                        <span className="animate-spin">⏳</span> Registrando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4" /> Registrar consultorio
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </form>

                            <div className="mt-6 text-center text-sm text-muted-foreground">
                                ¿Ya tienes una cuenta?{" "}
                                <Link to="/login" className="text-primary font-medium hover:underline">
                                    Iniciar sesión
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
