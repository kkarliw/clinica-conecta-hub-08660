import { useState } from "react";
import { motion } from "framer-motion";
import {
    Building2, Mail, Phone, MapPin, Globe, Camera,
    Save, Upload, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import ConsultorioLayout from "@/components/layouts/ConsultorioLayout";

const especialidades = [
    "Medicina General", "Odontología", "Pediatría", "Ginecología",
    "Cardiología", "Psicología", "Fisioterapia", "Nutrición",
    "Oftalmología", "Dermatología", "Traumatología"
];

const ciudades = [
    "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena",
    "Bucaramanga", "Pereira", "Manizales"
];

export default function ConsultorioPerfil() {
    const [hasChanges, setHasChanges] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "Clínica Dental Sonrisa",
        slug: "clinica-dental-sonrisa",
        descripcion: "Somos un centro odontológico especializado con más de 15 años de experiencia brindando atención de calidad. Nuestro equipo de profesionales altamente calificados utiliza tecnología de última generación para garantizar los mejores resultados en cada tratamiento.",
        direccion: "Calle 100 #15-20, Usaquén",
        ciudad: "Bogotá",
        telefono: "+57 1 234 5678",
        email: "contacto@sonrisa.com",
        website: "www.clinicasonrisa.com",
        especialidadPrincipal: "Odontología"
    });

    const [especialidadesSeleccionadas, setEspecialidadesSeleccionadas] = useState([
        "Odontología General", "Ortodoncia", "Implantes", "Blanqueamiento"
    ]);

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const toggleEspecialidad = (esp: string) => {
        setEspecialidadesSeleccionadas(prev =>
            prev.includes(esp) ? prev.filter(e => e !== esp) : [...prev, esp]
        );
        setHasChanges(true);
    };

    const handleSave = () => {
        toast.success("Perfil actualizado correctamente");
        setHasChanges(false);
    };

    return (
        <ConsultorioLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Perfil del Consultorio</h1>
                        <p className="text-muted-foreground">Configura la información pública de tu consultorio</p>
                    </div>
                    <Button onClick={handleSave} disabled={!hasChanges} className="gap-2">
                        <Save className="w-4 h-4" /> Guardar Cambios
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Logo & Banner */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Imagen del Consultorio</CardTitle>
                                <CardDescription>El logo y banner que verán los pacientes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Banner */}
                                    <div>
                                        <Label className="mb-2 block">Banner</Label>
                                        <div className="relative h-32 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-dashed flex items-center justify-center group cursor-pointer hover:border-primary transition-colors">
                                            <div className="text-center">
                                                <Upload className="w-8 h-8 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                                                <p className="text-sm text-muted-foreground mt-2">Subir imagen (1200x400px)</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Logo */}
                                    <div>
                                        <Label className="mb-2 block">Logo</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-24 rounded-2xl bg-primary/10 border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                                <Camera className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                <p>Recomendado: 200x200px</p>
                                                <p>Formatos: PNG, JPG</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información Básica</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="nombre">Nombre del consultorio</Label>
                                    <div className="relative mt-1">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="nombre"
                                            value={formData.nombre}
                                            onChange={(e) => updateField("nombre", e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="slug">URL Pública</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm text-muted-foreground">kenko.com/consultorio/</span>
                                        <Input
                                            id="slug"
                                            value={formData.slug}
                                            onChange={(e) => updateField("slug", e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="descripcion">Descripción</Label>
                                    <Textarea
                                        id="descripcion"
                                        value={formData.descripcion}
                                        onChange={(e) => updateField("descripcion", e.target.value)}
                                        className="mt-1"
                                        rows={4}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formData.descripcion.length}/500 caracteres
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contacto y Ubicación</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative mt-1">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => updateField("email", e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="telefono">Teléfono</Label>
                                        <div className="relative mt-1">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="telefono"
                                                value={formData.telefono}
                                                onChange={(e) => updateField("telefono", e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="direccion">Dirección</Label>
                                    <div className="relative mt-1">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="direccion"
                                            value={formData.direccion}
                                            onChange={(e) => updateField("direccion", e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Ciudad</Label>
                                        <Select
                                            value={formData.ciudad}
                                            onValueChange={(value) => updateField("ciudad", value)}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ciudades.map(c => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="website">Sitio Web</Label>
                                        <div className="relative mt-1">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="website"
                                                value={formData.website}
                                                onChange={(e) => updateField("website", e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Specialties */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Especialidades</CardTitle>
                                <CardDescription>Selecciona las especialidades que ofreces</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {especialidades.map(esp => (
                                        <Badge
                                            key={esp}
                                            variant={especialidadesSeleccionadas.includes(esp) ? "default" : "outline"}
                                            className="cursor-pointer hover:bg-primary/80"
                                            onClick={() => toggleEspecialidad(esp)}
                                        >
                                            {esp}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Profile Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Vista Previa</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg border overflow-hidden">
                                    <div className="h-20 bg-gradient-to-br from-primary/20 to-primary/5" />
                                    <div className="p-4 pt-0 -mt-6">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 border-2 border-card flex items-center justify-center mb-3">
                                            <Building2 className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="font-semibold text-sm">{formData.nombre}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{formData.ciudad}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Estado</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Perfil público</span>
                                    <Badge variant="default">Activo</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Verificación</span>
                                    <Badge variant="outline" className="text-green-600">Verificado</Badge>
                                </div>
                                <Separator />
                                <div className="text-sm text-muted-foreground">
                                    <p>Miembro desde: Enero 2024</p>
                                    <p>Citas recibidas: 256</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Danger Zone */}
                        <Card className="border-destructive/30">
                            <CardHeader>
                                <CardTitle className="text-lg text-destructive">Zona de Peligro</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Estas acciones son irreversibles
                                </p>
                                <Button variant="destructive" className="w-full gap-2">
                                    <Trash2 className="w-4 h-4" /> Eliminar Consultorio
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </ConsultorioLayout>
    );
}
