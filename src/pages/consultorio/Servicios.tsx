import { useState } from "react";
import { motion } from "framer-motion";
import {
    Plus, Search, MoreHorizontal, Edit2, Trash2, Clock,
    DollarSign, Eye, EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import ConsultorioLayout from "@/components/layouts/ConsultorioLayout";
import { Servicio } from "@/types";

const especialidades = [
    "Odontología General", "Ortodoncia", "Endodoncia", "Cirugía Oral",
    "Estética Dental", "Periodoncia", "Implantes"
];

// Mock data
const mockServicios: Servicio[] = [
    { id: 1, consultorioId: 1, nombre: "Consulta General", descripcion: "Evaluación dental completa con diagnóstico", precio: 50000, duracionMinutos: 30, especialidad: "Odontología General", activo: true },
    { id: 2, consultorioId: 1, nombre: "Limpieza Dental", descripcion: "Profilaxis y eliminación de sarro", precio: 80000, duracionMinutos: 45, especialidad: "Odontología General", activo: true },
    { id: 3, consultorioId: 1, nombre: "Blanqueamiento", descripcion: "Blanqueamiento dental profesional con láser", precio: 350000, duracionMinutos: 60, especialidad: "Estética Dental", activo: true },
    { id: 4, consultorioId: 1, nombre: "Ortodoncia Consulta", descripcion: "Evaluación inicial para brackets o alineadores", precio: 100000, duracionMinutos: 45, especialidad: "Ortodoncia", activo: true },
    { id: 5, consultorioId: 1, nombre: "Extracción Simple", descripcion: "Extracción de diente sin complicaciones", precio: 120000, duracionMinutos: 30, especialidad: "Cirugía Oral", activo: false }
];

export default function ConsultorioServicios() {
    const [servicios, setServicios] = useState(mockServicios);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Servicio | null>(null);
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        duracionMinutos: "",
        especialidad: ""
    });

    const filteredServicios = servicios.filter(s =>
        s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.especialidad?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenDialog = (service?: Servicio) => {
        if (service) {
            setEditingService(service);
            setFormData({
                nombre: service.nombre,
                descripcion: service.descripcion || "",
                precio: service.precio.toString(),
                duracionMinutos: service.duracionMinutos.toString(),
                especialidad: service.especialidad || ""
            });
        } else {
            setEditingService(null);
            setFormData({ nombre: "", descripcion: "", precio: "", duracionMinutos: "", especialidad: "" });
        }
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.nombre || !formData.precio || !formData.duracionMinutos) {
            toast.error("Completa los campos requeridos");
            return;
        }

        if (editingService) {
            setServicios(prev => prev.map(s =>
                s.id === editingService.id
                    ? { ...s, ...formData, precio: Number(formData.precio), duracionMinutos: Number(formData.duracionMinutos) }
                    : s
            ));
            toast.success("Servicio actualizado");
        } else {
            const newService: Servicio = {
                id: Date.now(),
                consultorioId: 1,
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                precio: Number(formData.precio),
                duracionMinutos: Number(formData.duracionMinutos),
                especialidad: formData.especialidad,
                activo: true
            };
            setServicios(prev => [...prev, newService]);
            toast.success("Servicio creado");
        }
        setIsDialogOpen(false);
    };

    const handleToggleActive = (id: number) => {
        setServicios(prev => prev.map(s =>
            s.id === id ? { ...s, activo: !s.activo } : s
        ));
        toast.success("Estado actualizado");
    };

    const handleDelete = (id: number) => {
        setServicios(prev => prev.filter(s => s.id !== id));
        toast.success("Servicio eliminado");
    };

    return (
        <ConsultorioLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Servicios</h1>
                        <p className="text-muted-foreground">Gestiona los servicios que ofreces a tus pacientes</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2" onClick={() => handleOpenDialog()}>
                                <Plus className="w-4 h-4" /> Nuevo Servicio
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingService ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
                                <DialogDescription>
                                    {editingService ? "Modifica los datos del servicio" : "Agrega un nuevo servicio a tu catálogo"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <Label htmlFor="nombre">Nombre del servicio *</Label>
                                    <Input
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        placeholder="Ej: Limpieza Dental"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="descripcion">Descripción</Label>
                                    <Textarea
                                        id="descripcion"
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                        placeholder="Describe el servicio..."
                                        className="mt-1"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="precio">Precio (COP) *</Label>
                                        <Input
                                            id="precio"
                                            type="number"
                                            value={formData.precio}
                                            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                            placeholder="50000"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="duracion">Duración (min) *</Label>
                                        <Input
                                            id="duracion"
                                            type="number"
                                            value={formData.duracionMinutos}
                                            onChange={(e) => setFormData({ ...formData, duracionMinutos: e.target.value })}
                                            placeholder="30"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
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
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                <Button onClick={handleSave}>
                                    {editingService ? "Guardar Cambios" : "Crear Servicio"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Servicios Activos</p>
                                    <p className="text-2xl font-bold">{servicios.filter(s => s.activo).length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Precio Promedio</p>
                                    <p className="text-2xl font-bold">
                                        ${Math.round(servicios.reduce((acc, s) => acc + s.precio, 0) / servicios.length).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Duración Promedio</p>
                                    <p className="text-2xl font-bold">
                                        {Math.round(servicios.reduce((acc, s) => acc + s.duracionMinutos, 0) / servicios.length)} min
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar servicio..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Servicio</TableHead>
                                    <TableHead>Especialidad</TableHead>
                                    <TableHead>Duración</TableHead>
                                    <TableHead>Precio</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredServicios.map((servicio) => (
                                    <TableRow key={servicio.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{servicio.nombre}</p>
                                                <p className="text-sm text-muted-foreground line-clamp-1">{servicio.descripcion}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{servicio.especialidad}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                {servicio.duracionMinutos} min
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            ${servicio.precio.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={servicio.activo ? "default" : "secondary"}>
                                                {servicio.activo ? "Activo" : "Inactivo"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleOpenDialog(servicio)}>
                                                        <Edit2 className="w-4 h-4 mr-2" /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleActive(servicio.id)}>
                                                        {servicio.activo ? (
                                                            <><EyeOff className="w-4 h-4 mr-2" /> Desactivar</>
                                                        ) : (
                                                            <><Eye className="w-4 h-4 mr-2" /> Activar</>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleDelete(servicio.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </ConsultorioLayout>
    );
}
