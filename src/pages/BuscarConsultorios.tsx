import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Search, MapPin, Star, Stethoscope, Filter, Grid, List,
    ArrowRight, CheckCircle2, ChevronDown, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import kenkoLogo from "@/assets/kenko-logo.png";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import ChatbotFloating from "@/components/ChatbotFloating";
import { Consultorio } from "@/types";

// Mock data
const mockConsultorios: Consultorio[] = [
    {
        id: 1,
        nombre: "Clínica Dental Sonrisa",
        slug: "clinica-dental-sonrisa",
        descripcion: "Especialistas en odontología estética y general con más de 15 años de experiencia.",
        direccion: "Calle 100 #15-20, Usaquén",
        ciudad: "Bogotá",
        telefono: "+57 1 234 5678",
        email: "contacto@sonrisa.com",
        especialidades: ["Odontología General", "Ortodoncia", "Implantes", "Blanqueamiento"],
        activo: true,
        verificado: true,
        rating: 4.9,
        totalReviews: 128
    },
    {
        id: 2,
        nombre: "Centro Médico Salud Integral",
        slug: "salud-integral",
        descripcion: "Atención médica completa para toda la familia con profesionales altamente calificados.",
        direccion: "Carrera 7 #45-10, Chapinero",
        ciudad: "Bogotá",
        telefono: "+57 1 987 6543",
        email: "info@saludintegral.com",
        especialidades: ["Medicina General", "Pediatría", "Ginecología", "Cardiología"],
        activo: true,
        verificado: true,
        rating: 4.8,
        totalReviews: 256
    },
    {
        id: 3,
        nombre: "Fisioterapia & Bienestar",
        slug: "fisio-bienestar",
        descripcion: "Centro especializado en recuperación física y rehabilitación deportiva.",
        direccion: "Av. 19 #120-45, Santa Bárbara",
        ciudad: "Bogotá",
        telefono: "+57 1 555 1234",
        email: "citas@fisiobienestar.com",
        especialidades: ["Fisioterapia", "Rehabilitación", "Terapia Deportiva", "Masoterapia"],
        activo: true,
        verificado: true,
        rating: 4.7,
        totalReviews: 89
    },
    {
        id: 4,
        nombre: "Psicología Mente Clara",
        slug: "mente-clara",
        descripcion: "Terapia psicológica individual, de pareja y familiar con enfoque humanista.",
        direccion: "Calle 85 #11-53, Zona G",
        ciudad: "Bogotá",
        telefono: "+57 1 444 5678",
        email: "contacto@menteclara.com",
        especialidades: ["Psicología Clínica", "Terapia de Pareja", "Ansiedad", "Depresión"],
        activo: true,
        verificado: true,
        rating: 4.9,
        totalReviews: 167
    },
    {
        id: 5,
        nombre: "Centro Oftalmológico Vista",
        slug: "centro-vista",
        descripcion: "Especialistas en salud visual con tecnología de última generación.",
        direccion: "Carrera 15 #93-75, Chicó",
        ciudad: "Bogotá",
        telefono: "+57 1 333 4567",
        email: "citas@centrovista.com",
        especialidades: ["Oftalmología", "Optometría", "Cirugía Láser", "Lentes de Contacto"],
        activo: true,
        verificado: false,
        rating: 4.6,
        totalReviews: 92
    },
    {
        id: 6,
        nombre: "Nutrición Balance",
        slug: "nutricion-balance",
        descripcion: "Planes de alimentación personalizados para lograr tus objetivos de salud.",
        direccion: "Calle 116 #18-10, Usaquén",
        ciudad: "Bogotá",
        telefono: "+57 1 222 3456",
        email: "info@nutricionbalance.com",
        especialidades: ["Nutrición Clínica", "Nutrición Deportiva", "Control de Peso", "Dietas Especiales"],
        activo: true,
        verificado: true,
        rating: 4.8,
        totalReviews: 134
    }
];

const especialidades = [
    "Todas", "Medicina General", "Odontología", "Pediatría", "Ginecología",
    "Cardiología", "Psicología", "Fisioterapia", "Nutrición", "Oftalmología"
];

const ciudades = ["Todas", "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"];

export default function BuscarConsultorios() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("nombre") || "");
    const [especialidad, setEspecialidad] = useState(searchParams.get("especialidad") || "Todas");
    const [ciudad, setCiudad] = useState(searchParams.get("ciudad") || "Todas");
    const [priceRange, setPriceRange] = useState([0, 500000]);
    const [sortBy, setSortBy] = useState("rating");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showFilters, setShowFilters] = useState(false);

    // Filter consultorios
    const filteredConsultorios = mockConsultorios.filter(c => {
        const matchesSearch = c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.descripcion?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesEspecialidad = especialidad === "Todas" ||
            c.especialidades?.some(e => e.toLowerCase().includes(especialidad.toLowerCase()));
        const matchesCiudad = ciudad === "Todas" || c.ciudad === ciudad;
        return matchesSearch && matchesEspecialidad && matchesCiudad;
    });

    // Sort consultorios
    const sortedConsultorios = [...filteredConsultorios].sort((a, b) => {
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "reviews") return (b.totalReviews || 0) - (a.totalReviews || 0);
        if (sortBy === "name") return a.nombre.localeCompare(b.nombre);
        return 0;
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.set("nombre", searchQuery);
        if (especialidad !== "Todas") params.set("especialidad", especialidad);
        if (ciudad !== "Todas") params.set("ciudad", ciudad);
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setEspecialidad("Todas");
        setCiudad("Todas");
        setPriceRange([0, 500000]);
        setSearchParams({});
    };

    const activeFiltersCount = [
        searchQuery,
        especialidad !== "Todas" ? especialidad : "",
        ciudad !== "Todas" ? ciudad : ""
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3">
                            <img src={kenkoLogo} alt="Kenkō" className="h-10 w-auto" />
                        </Link>

                        {/* Search bar in header */}
                        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-xl mx-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Buscar consultorios..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button type="submit" size="sm">Buscar</Button>
                        </form>

                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <Button variant="ghost" size="sm">Iniciar sesión</Button>
                            </Link>
                            <Link to="/registro">
                                <Button size="sm">Registrarme</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-12">
                <div className="container mx-auto px-6">
                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Buscar Consultorios</h1>
                        <p className="text-muted-foreground">
                            {sortedConsultorios.length} consultorio{sortedConsultorios.length !== 1 ? 's' : ''} encontrado{sortedConsultorios.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <aside className={`lg:w-72 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                            <Card className="sticky top-24">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-semibold flex items-center gap-2">
                                            <Filter className="w-4 h-4" /> Filtros
                                        </h2>
                                        {activeFiltersCount > 0 && (
                                            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                                                Limpiar ({activeFiltersCount})
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        {/* Especialidad */}
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Especialidad</label>
                                            <Select value={especialidad} onValueChange={setEspecialidad}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {especialidades.map(esp => (
                                                        <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Ciudad */}
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Ciudad</label>
                                            <Select value={ciudad} onValueChange={setCiudad}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ciudades.map(c => (
                                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Price Range */}
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Rango de precio
                                            </label>
                                            <Slider
                                                value={priceRange}
                                                onValueChange={setPriceRange}
                                                max={500000}
                                                step={10000}
                                                className="mt-2"
                                            />
                                            <div className="flex justify-between text-sm text-muted-foreground mt-2">
                                                <span>${priceRange[0].toLocaleString()}</span>
                                                <span>${priceRange[1].toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Only verified */}
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="verified" className="rounded" />
                                            <label htmlFor="verified" className="text-sm">Solo verificados</label>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>

                        {/* Results */}
                        <div className="flex-1">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between mb-6 gap-4">
                                <Button
                                    variant="outline"
                                    className="lg:hidden gap-2"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter className="w-4 h-4" />
                                    Filtros
                                    {activeFiltersCount > 0 && (
                                        <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>
                                    )}
                                </Button>

                                <div className="flex items-center gap-4 ml-auto">
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Ordenar por..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="rating">Mejor valorados</SelectItem>
                                            <SelectItem value="reviews">Más reseñas</SelectItem>
                                            <SelectItem value="name">Nombre A-Z</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <div className="hidden sm:flex border rounded-lg">
                                        <Button
                                            variant={viewMode === "grid" ? "secondary" : "ghost"}
                                            size="icon"
                                            onClick={() => setViewMode("grid")}
                                        >
                                            <Grid className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant={viewMode === "list" ? "secondary" : "ghost"}
                                            size="icon"
                                            onClick={() => setViewMode("list")}
                                        >
                                            <List className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Active filters tags */}
                            {activeFiltersCount > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {searchQuery && (
                                        <Badge variant="secondary" className="gap-1">
                                            Búsqueda: {searchQuery}
                                            <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                                        </Badge>
                                    )}
                                    {especialidad !== "Todas" && (
                                        <Badge variant="secondary" className="gap-1">
                                            {especialidad}
                                            <X className="w-3 h-3 cursor-pointer" onClick={() => setEspecialidad("Todas")} />
                                        </Badge>
                                    )}
                                    {ciudad !== "Todas" && (
                                        <Badge variant="secondary" className="gap-1">
                                            {ciudad}
                                            <X className="w-3 h-3 cursor-pointer" onClick={() => setCiudad("Todas")} />
                                        </Badge>
                                    )}
                                </div>
                            )}

                            {/* Results Grid */}
                            {sortedConsultorios.length > 0 ? (
                                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
                                    {sortedConsultorios.map((consultorio) => (
                                        <motion.div
                                            key={consultorio.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Link to={`/consultorio/${consultorio.slug}`}>
                                                <Card className={`overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 group h-full ${viewMode === "list" ? "flex" : ""}`}>
                                                    {/* Banner */}
                                                    <div className={`bg-gradient-to-br from-primary/20 to-primary/5 relative ${viewMode === "list" ? "w-48 shrink-0" : "h-32"}`}>
                                                        <div className={`absolute ${viewMode === "list" ? "bottom-4 left-4" : "-bottom-8 left-6"}`}>
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

                                                    <CardContent className={`${viewMode === "list" ? "flex-1 py-4" : "pt-12 pb-6"} px-6`}>
                                                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                                                            {consultorio.nombre}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {consultorio.direccion}
                                                        </p>

                                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                            {consultorio.descripcion}
                                                        </p>

                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {consultorio.especialidades?.slice(0, 3).map((esp, i) => (
                                                                <Badge key={i} variant="secondary" className="text-xs">
                                                                    {esp}
                                                                </Badge>
                                                            ))}
                                                            {(consultorio.especialidades?.length || 0) > 3 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{(consultorio.especialidades?.length || 0) - 3}
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between pt-4 border-t">
                                                            <div className="flex items-center gap-1">
                                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                <span className="font-semibold">{consultorio.rating}</span>
                                                                <span className="text-sm text-muted-foreground">
                                                                    ({consultorio.totalReviews})
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
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="py-16 text-center">
                                        <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Intenta modificar los filtros o buscar con otros términos
                                        </p>
                                        <Button variant="outline" onClick={clearFilters}>
                                            Limpiar filtros
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Accessibility & Chatbot */}
            <AccessibilityToolbar />
            <ChatbotFloating />
        </div>
    );
}
