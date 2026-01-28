import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Calendar, Users, DollarSign, TrendingUp, Clock, Star,
    ArrowUpRight, ArrowDownRight, MoreHorizontal, Bell, Settings,
    Stethoscope, Plus, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ConsultorioLayout from "@/components/layouts/ConsultorioLayout";

// Mock data
const stats = [
    {
        title: "Citas Hoy",
        value: "12",
        change: "+3",
        trend: "up",
        icon: Calendar,
        color: "bg-blue-500"
    },
    {
        title: "Pacientes Nuevos",
        value: "28",
        change: "+12%",
        trend: "up",
        icon: Users,
        color: "bg-green-500"
    },
    {
        title: "Ingresos del Mes",
        value: "$4.2M",
        change: "+8%",
        trend: "up",
        icon: DollarSign,
        color: "bg-purple-500"
    },
    {
        title: "Tasa de Ocupación",
        value: "78%",
        change: "-2%",
        trend: "down",
        icon: TrendingUp,
        color: "bg-orange-500"
    }
];

const upcomingAppointments = [
    { id: 1, patient: "María García", time: "09:00 AM", service: "Limpieza Dental", doctor: "Dr. González", status: "confirmed" },
    { id: 2, patient: "Juan Pérez", time: "10:30 AM", service: "Consulta General", doctor: "Dr. González", status: "pending" },
    { id: 3, patient: "Ana Rodríguez", time: "11:30 AM", service: "Ortodoncia", doctor: "Dr. Martínez", status: "confirmed" },
    { id: 4, patient: "Carlos López", time: "02:00 PM", service: "Blanqueamiento", doctor: "Dra. Torres", status: "confirmed" }
];

const topServices = [
    { name: "Limpieza Dental", count: 45, revenue: 3600000, percentage: 35 },
    { name: "Consulta General", count: 38, revenue: 1900000, percentage: 30 },
    { name: "Ortodoncia", count: 22, revenue: 2200000, percentage: 20 },
    { name: "Blanqueamiento", count: 15, revenue: 5250000, percentage: 15 }
];

const recentReviews = [
    { id: 1, patient: "Laura M.", rating: 5, comment: "Excelente atención", date: "Hace 2 horas" },
    { id: 2, patient: "Pedro S.", rating: 4, comment: "Muy profesionales", date: "Hace 1 día" }
];

export default function ConsultorioDashboard() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <ConsultorioLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">Bienvenido de vuelta. Aquí está el resumen de hoy.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/consultorio/servicios">
                            <Button variant="outline" className="gap-2">
                                <Plus className="w-4 h-4" /> Nuevo Servicio
                            </Button>
                        </Link>
                        <Button className="gap-2">
                            <Calendar className="w-4 h-4" /> Nueva Cita
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    {stats.map((stat, index) => (
                        <motion.div key={index} variants={fadeInUp}>
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                                            <stat.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {stat.trend === 'up' ? (
                                                <ArrowUpRight className="w-4 h-4" />
                                            ) : (
                                                <ArrowDownRight className="w-4 h-4" />
                                            )}
                                            {stat.change}
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold mb-1">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Upcoming Appointments */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Citas de Hoy</CardTitle>
                                    <CardDescription>Tienes {upcomingAppointments.length} citas programadas</CardDescription>
                                </div>
                                <Link to="/consultorio/citas">
                                    <Button variant="ghost" size="sm" className="gap-1">
                                        Ver todas <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {upcomingAppointments.map((apt) => (
                                        <div
                                            key={apt.id}
                                            className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="text-center min-w-[60px]">
                                                    <p className="font-bold text-primary">{apt.time}</p>
                                                </div>
                                                <Avatar>
                                                    <AvatarFallback>{apt.patient.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{apt.patient}</p>
                                                    <p className="text-sm text-muted-foreground">{apt.service} • {apt.doctor}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'}>
                                                    {apt.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                                                </Badge>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {/* Top Services */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Servicios Populares</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {topServices.map((service, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{service.name}</span>
                                            <span className="font-medium">{service.count} citas</span>
                                        </div>
                                        <Progress value={service.percentage} className="h-2" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Recent Reviews */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Reseñas Recientes</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentReviews.map((review) => (
                                    <div key={review.id} className="flex gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback className="text-xs">{review.patient[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium text-sm">{review.patient}</p>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <Star key={i} className={`w-3 h-3 ${i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                                        </div>
                                    </div>
                                ))}
                                <Link to="/consultorio/resenas">
                                    <Button variant="outline" size="sm" className="w-full">
                                        Ver todas las reseñas
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Acciones Rápidas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { icon: Calendar, label: "Gestionar Citas", href: "/consultorio/citas" },
                                    { icon: Stethoscope, label: "Servicios", href: "/consultorio/servicios" },
                                    { icon: Users, label: "Profesionales", href: "/consultorio/profesionales" },
                                    { icon: Settings, label: "Configuración", href: "/consultorio/perfil" }
                                ].map((action, index) => (
                                    <Link key={index} to={action.href}>
                                        <div className="p-4 rounded-xl border hover:border-primary hover:bg-primary/5 transition-colors text-center cursor-pointer">
                                            <action.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                                            <p className="text-sm font-medium">{action.label}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </ConsultorioLayout>
    );
}
