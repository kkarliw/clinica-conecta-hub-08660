import { useState } from "react";
import { motion } from "framer-motion";
import {
    Plus, Search, MoreHorizontal, Edit2, Trash2, Mail, Phone,
    User, Shield, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import ConsultorioLayout from "@/components/layouts/ConsultorioLayout";

interface Profesional {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    especialidad: string;
    numeroLicencia: string;
    activo: boolean;
    rol: "medico" | "asistente" | "admin";
}

const especialidades = [
    "Odontología General", "Ortodoncia", "Endodoncia", "Cirugía Oral",
    "Estética Dental", "Periodoncia", "Implantología"
];

// Mock data
const mockProfesionales: Profesional[] = [
    { id: 1, nombre: "María", apellido: "González", email: "maria@sonrisa.com", telefono: "+57 300 111 2222", especialidad: "Odontología General", numeroLicencia: "OD-12345", activo: true, rol: "medico" },
    { id: 2, nombre: "Carlos", apellido: "Rodríguez", email: "carlos@sonrisa.com", telefono: "+57 300 333 4444", especialidad: "Ortodoncia", numeroLicencia: "OD-23456", activo: true, rol: "medico" },
    { id: 3, nombre: "Ana", apellido: "Martínez", email: "ana@sonrisa.com", telefono: "+57 300 555 6666", especialidad: "Endodoncia", numeroLicencia: "OD-34567", activo: true, rol: "medico" },
    { id: 4, nombre: "Laura", apellido: "Pérez", email: "laura@sonrisa.com", telefono: "+57 300 777 8888", especialidad: "", numeroLicencia: "", activo: true, rol: "asistente" }
];

export default function ConsultorioProfesionales() {
    const [profesionales, setProfesionales] = useState(mockProfesionales);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProfesional, setEditingProfesional] = useState<Profesional | null>(null);
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        especialidad: "",
        numeroLicencia: "",
        rol: "medico" as "medico" | "asistente" | "admin"
    });

    const filteredProfesionales = profesionales.filter(p =>
        `${p.nombre} ${p.apellido}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.especialidad.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenDialog = (profesional?: Profesional) => {
        if (profesional) {
            setEditingProfesional(profesional);
            setFormData({
                nombre: profesional.nombre,
                apellido: profesional.apellido,
                email: profesional.email,
                telefono: profesional.telefono,
                especialidad: profesional.especialidad,
                numeroLicencia: profesional.numeroLicencia,
                rol: profesional.rol
            });
        } else {
            setEditingProfesional(null);
            setFormData({ nombre: "", apellido: "", email: "", telefono: "", especialidad: "", numeroLicencia: "", rol: "medico" });
        }
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.nombre || !formData.apellido || !formData.email) {
            toast.error("Completa los campos requeridos");
            return;
        }

        if (editingProfesional) {
            setProfesionales(prev => prev.map(p =>
                p.id === editingProfesional.id
                    ? { ...p, ...formData }
                    : p
            ));
            toast.success("Profesional actualizado");
        } else {
            const newProfesional: Profesional = {
                id: Date.now(),
                ...formData,
                activo: true
            };
            setProfesionales(prev => [...prev, newProfesional]);
            toast.success("Profesional agregado");
        }
        setIsDialogOpen(false);
    };

    const handleDelete = (id: number) => {
        setProfesionales(prev => prev.filter(p => p.id !== id));
        toast.success("Profesional eliminado");
    };

    const getRolBadge = (rol: string) => {
        const roles = {
            medico: { label: "Médico", variant: "default" as const },
            asistente: { label: "Asistente", variant: "secondary" as const },
            admin: { label: "Admin", variant: "outline" as const }
        };
        return roles[rol as keyof typeof roles] || roles.asistente;
    };

    return (
        <ConsultorioLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Profesionales</h1>
                        <p className="text-muted-foreground">Gestiona el equipo de tu consultorio</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2" onClick={() => handleOpenDialog()}>
                                <Plus className="w-4 h-4" /> Agregar Profesional
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>{editingProfesional ? "Editar Profesional" : "Nuevo Profesional"}</DialogTitle>
                                <DialogDescription>
                                    {editingProfesional ? "Modifica los datos del profesional" : "Agrega un nuevo miembro a tu equipo"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="nombre">Nombre *</Label>
                                        <Input
                                            id="nombre"
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="apellido">Apellido *</Label>
                                        <Input
                                            id="apellido"
                                            value={formData.apellido}
                                            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="telefono">Teléfono</Label>
                                    <Input
                                        id="telefono"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label>Rol</Label>
                                    <Select
                                        value={formData.rol}
                                        onValueChange={(value: "medico" | "asistente" | "admin") => setFormData({ ...formData, rol: value })}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="medico">Médico</SelectItem>
                                            <SelectItem value="asistente">Asistente</SelectItem>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {formData.rol === "medico" && (
                                    <>
                                        <div>
                                            <Label>Especialidad</Label>
                                            <Select
                                                value={formData.especialidad}
                                                onValueChange={(value) => setFormData({ ...formData, especialidad: value })}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Seleccionar..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {especialidades.map(esp => (
                                                        <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="licencia">Número de Licencia</Label>
                                            <Input
                                                id="licencia"
                                                value={formData.numeroLicencia}
                                                onChange={(e) => setFormData({ ...formData, numeroLicencia: e.target.value })}
                                                placeholder="OD-12345"
                                                className="mt-1"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                <Button onClick={handleSave}>
                                    {editingProfesional ? "Guardar Cambios" : "Agregar"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-2xl font-bold">{profesionales.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Médicos</p>
                                <p className="text-2xl font-bold">{profesionales.filter(p => p.rol === "medico").length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Asistentes</p>
                                <p className="text-2xl font-bold">{profesionales.filter(p => p.rol === "asistente").length}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar profesional..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProfesionales.map((profesional) => (
                        <motion.div
                            key={profesional.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-14 h-14">
                                                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                                    {profesional.nombre[0]}{profesional.apellido[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold">
                                                    {profesional.rol === "medico" ? "Dr(a). " : ""}
                                                    {profesional.nombre} {profesional.apellido}
                                                </h3>
                                                {profesional.especialidad && (
                                                    <p className="text-sm text-muted-foreground">{profesional.especialidad}</p>
                                                )}
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenDialog(profesional)}>
                                                    <Edit2 className="w-4 h-4 mr-2" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(profesional.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="w-4 h-4" />
                                            <span className="truncate">{profesional.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="w-4 h-4" />
                                            <span>{profesional.telefono}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                                        <Badge variant={getRolBadge(profesional.rol).variant}>
                                            {getRolBadge(profesional.rol).label}
                                        </Badge>
                                        {profesional.numeroLicencia && (
                                            <Badge variant="outline" className="text-xs">
                                                {profesional.numeroLicencia}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </ConsultorioLayout>
    );
}
