import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Plus, Save, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ConsultorioLayout from "@/components/layouts/ConsultorioLayout";

const diasSemana = [
    { id: "lunes", nombre: "Lunes" },
    { id: "martes", nombre: "Martes" },
    { id: "miercoles", nombre: "Miércoles" },
    { id: "jueves", nombre: "Jueves" },
    { id: "viernes", nombre: "Viernes" },
    { id: "sabado", nombre: "Sábado" },
    { id: "domingo", nombre: "Domingo" }
];

const horasDisponibles = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
];

interface HorarioDia {
    activo: boolean;
    bloques: { inicio: string; fin: string }[];
}

type HorariosSemana = {
    [key: string]: HorarioDia;
};

const horarioInicial: HorariosSemana = {
    lunes: { activo: true, bloques: [{ inicio: "08:00", fin: "12:00" }, { inicio: "14:00", fin: "18:00" }] },
    martes: { activo: true, bloques: [{ inicio: "08:00", fin: "12:00" }, { inicio: "14:00", fin: "18:00" }] },
    miercoles: { activo: true, bloques: [{ inicio: "08:00", fin: "12:00" }, { inicio: "14:00", fin: "18:00" }] },
    jueves: { activo: true, bloques: [{ inicio: "08:00", fin: "12:00" }, { inicio: "14:00", fin: "18:00" }] },
    viernes: { activo: true, bloques: [{ inicio: "08:00", fin: "12:00" }, { inicio: "14:00", fin: "18:00" }] },
    sabado: { activo: true, bloques: [{ inicio: "09:00", fin: "14:00" }] },
    domingo: { activo: false, bloques: [] }
};

export default function ConsultorioHorarios() {
    const [horarios, setHorarios] = useState<HorariosSemana>(horarioInicial);
    const [hasChanges, setHasChanges] = useState(false);

    const toggleDia = (diaId: string) => {
        setHorarios(prev => ({
            ...prev,
            [diaId]: {
                ...prev[diaId],
                activo: !prev[diaId].activo,
                bloques: prev[diaId].activo ? [] : [{ inicio: "08:00", fin: "18:00" }]
            }
        }));
        setHasChanges(true);
    };

    const updateBloque = (diaId: string, bloqueIndex: number, field: "inicio" | "fin", value: string) => {
        setHorarios(prev => ({
            ...prev,
            [diaId]: {
                ...prev[diaId],
                bloques: prev[diaId].bloques.map((bloque, i) =>
                    i === bloqueIndex ? { ...bloque, [field]: value } : bloque
                )
            }
        }));
        setHasChanges(true);
    };

    const addBloque = (diaId: string) => {
        setHorarios(prev => ({
            ...prev,
            [diaId]: {
                ...prev[diaId],
                bloques: [...prev[diaId].bloques, { inicio: "14:00", fin: "18:00" }]
            }
        }));
        setHasChanges(true);
    };

    const removeBloque = (diaId: string, bloqueIndex: number) => {
        setHorarios(prev => ({
            ...prev,
            [diaId]: {
                ...prev[diaId],
                bloques: prev[diaId].bloques.filter((_, i) => i !== bloqueIndex)
            }
        }));
        setHasChanges(true);
    };

    const copyToAll = (diaId: string) => {
        const horarioBase = horarios[diaId];
        setHorarios(prev => {
            const newHorarios = { ...prev };
            diasSemana.forEach(dia => {
                if (dia.id !== diaId && dia.id !== "domingo") {
                    newHorarios[dia.id] = { ...horarioBase };
                }
            });
            return newHorarios;
        });
        setHasChanges(true);
        toast.success("Horario copiado a los demás días laborables");
    };

    const handleSave = () => {
        // Simulate API call
        toast.success("Horarios guardados correctamente");
        setHasChanges(false);
    };

    return (
        <ConsultorioLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Horarios de Atención</h1>
                        <p className="text-muted-foreground">Configura los horarios en que tu consultorio está disponible</p>
                    </div>
                    <Button onClick={handleSave} disabled={!hasChanges} className="gap-2">
                        <Save className="w-4 h-4" /> Guardar Cambios
                    </Button>
                </div>

                {/* Schedule Grid */}
                <div className="space-y-4">
                    {diasSemana.map((dia) => {
                        const horarioDia = horarios[dia.id];
                        return (
                            <motion.div
                                key={dia.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className={!horarioDia.activo ? "opacity-60" : ""}>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                            {/* Day toggle */}
                                            <div className="flex items-center gap-4 min-w-[180px]">
                                                <Switch
                                                    checked={horarioDia.activo}
                                                    onCheckedChange={() => toggleDia(dia.id)}
                                                />
                                                <div>
                                                    <p className="font-semibold">{dia.nombre}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {horarioDia.activo ? "Abierto" : "Cerrado"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Time blocks */}
                                            {horarioDia.activo && (
                                                <div className="flex-1 space-y-3">
                                                    {horarioDia.bloques.map((bloque, index) => (
                                                        <div key={index} className="flex flex-wrap items-center gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                                <Select
                                                                    value={bloque.inicio}
                                                                    onValueChange={(value) => updateBloque(dia.id, index, "inicio", value)}
                                                                >
                                                                    <SelectTrigger className="w-24">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {horasDisponibles.map(hora => (
                                                                            <SelectItem key={hora} value={hora}>{hora}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <span className="text-muted-foreground">a</span>
                                                                <Select
                                                                    value={bloque.fin}
                                                                    onValueChange={(value) => updateBloque(dia.id, index, "fin", value)}
                                                                >
                                                                    <SelectTrigger className="w-24">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {horasDisponibles.map(hora => (
                                                                            <SelectItem key={hora} value={hora}>{hora}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            {horarioDia.bloques.length > 1 && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => removeBloque(dia.id, index)}
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                                </Button>
                                                            )}

                                                            {index === horarioDia.bloques.length - 1 && horarioDia.bloques.length < 3 && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => addBloque(dia.id)}
                                                                    className="gap-1"
                                                                >
                                                                    <Plus className="w-4 h-4" /> Agregar bloque
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Copy button */}
                                            {horarioDia.activo && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToAll(dia.id)}
                                                    className="gap-1 shrink-0"
                                                >
                                                    <Copy className="w-4 h-4" /> Copiar a todos
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Tips Card */}
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-lg">💡 Consejos para tus horarios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Configura múltiples bloques para días con horario partido (mañana y tarde)</li>
                            <li>• Los pacientes solo podrán agendar citas dentro de estos horarios</li>
                            <li>• Usa "Copiar a todos" para aplicar el mismo horario a días similares</li>
                            <li>• Los cambios se reflejan inmediatamente en tu perfil público</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </ConsultorioLayout>
    );
}
