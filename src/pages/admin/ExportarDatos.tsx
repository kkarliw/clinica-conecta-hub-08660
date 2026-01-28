import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPacientes, getCitas, getHistoriasClinicas, getProfesionales } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Calendar, FileText, Activity, Download, FileSpreadsheet } from "lucide-react";
import { exportToExcel, formatPacientesForExcel, formatCitasForExcel, formatHistoriasForExcel } from "@/utils/exportToExcel";
import { exportToCSV } from "@/utils/exportToCSV";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ExportarDatos() {
  const [filtrosPacientes, setFiltrosPacientes] = useState({
    desde: '',
    hasta: '',
  });

  const [filtrosCitas, setFiltrosCitas] = useState({
    desde: '',
    hasta: '',
    estado: 'all',
    medicoId: 'all',
  });

  const [filtrosHistorias, setFiltrosHistorias] = useState({
    desde: '',
    hasta: '',
    medicoId: 'all',
  });

  const { data: pacientes = [] } = useQuery({
    queryKey: ["pacientes"],
    queryFn: getPacientes,
  });

  const { data: citas = [] } = useQuery({
    queryKey: ["citas"],
    queryFn: getCitas,
  });

  const { data: historias = [] } = useQuery({
    queryKey: ["historias"],
    queryFn: getHistoriasClinicas,
  });

  const { data: profesionales = [] } = useQuery({
    queryKey: ["profesionales"],
    queryFn: getProfesionales,
  });

  const handleExportarPacientes = (formato: 'excel' | 'csv') => {
    try {
      toast.info("Generando archivo...");
      
      // Filtrar pacientes (sin fecha de creación, usamos todos por ahora)
      let pacientesFiltrados = pacientes;

      if (pacientesFiltrados.length === 0) {
        toast.error("No hay datos para exportar");
        return;
      }

      const dataFormateada = formatPacientesForExcel(pacientesFiltrados);

      if (formato === 'excel') {
        exportToExcel({
          data: dataFormateada,
          fileName: 'consultorios_pacientes',
          sheetName: 'Pacientes',
          userName: localStorage.getItem('healix_user') ? JSON.parse(localStorage.getItem('healix_user')!).nombre : undefined,
          dateRange: filtrosPacientes.desde ? {
            desde: filtrosPacientes.desde,
            hasta: filtrosPacientes.hasta || format(new Date(), 'yyyy-MM-dd')
          } : undefined,
        });
      } else {
        exportToCSV({
          data: dataFormateada,
          fileName: 'consultorios_pacientes',
        });
      }

      toast.success("Archivo descargado exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al descargar, intente de nuevo");
    }
  };

  const handleExportarCitas = (formato: 'excel' | 'csv') => {
    try {
      toast.info("Generando archivo...");
      
      let citasFiltradas = citas;
      if (filtrosCitas.desde) {
        citasFiltradas = citasFiltradas.filter(c => 
          new Date(c.fecha) >= new Date(filtrosCitas.desde)
        );
      }
      if (filtrosCitas.hasta) {
        citasFiltradas = citasFiltradas.filter(c => 
          new Date(c.fecha) <= new Date(filtrosCitas.hasta)
        );
      }
      if (filtrosCitas.estado !== 'all') {
        citasFiltradas = citasFiltradas.filter(c => c.estado === filtrosCitas.estado);
      }
      if (filtrosCitas.medicoId !== 'all') {
        citasFiltradas = citasFiltradas.filter(c => 
          c.profesionalId === parseInt(filtrosCitas.medicoId)
        );
      }

      if (citasFiltradas.length === 0) {
        toast.error("No hay datos para exportar");
        return;
      }

      const dataFormateada = formatCitasForExcel(citasFiltradas);

      if (formato === 'excel') {
        exportToExcel({
          data: dataFormateada,
          fileName: 'consultorios_citas',
          sheetName: 'Citas',
          userName: localStorage.getItem('healix_user') ? JSON.parse(localStorage.getItem('healix_user')!).nombre : undefined,
          dateRange: filtrosCitas.desde ? {
            desde: filtrosCitas.desde,
            hasta: filtrosCitas.hasta || format(new Date(), 'yyyy-MM-dd')
          } : undefined,
        });
      } else {
        exportToCSV({
          data: dataFormateada,
          fileName: 'consultorios_citas',
        });
      }

      toast.success("Archivo descargado exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al descargar, intente de nuevo");
    }
  };

  const handleExportarHistorias = (formato: 'excel' | 'csv') => {
    try {
      toast.info("Generando archivo...");
      
      let historiasFiltradas = historias;
      if (filtrosHistorias.desde) {
        historiasFiltradas = historiasFiltradas.filter(h => 
          new Date(h.fecha) >= new Date(filtrosHistorias.desde)
        );
      }
      if (filtrosHistorias.hasta) {
        historiasFiltradas = historiasFiltradas.filter(h => 
          new Date(h.fecha) <= new Date(filtrosHistorias.hasta)
        );
      }
      if (filtrosHistorias.medicoId !== 'all') {
        historiasFiltradas = historiasFiltradas.filter(h => 
          h.profesionalId === parseInt(filtrosHistorias.medicoId)
        );
      }

      if (historiasFiltradas.length === 0) {
        toast.error("No hay datos para exportar");
        return;
      }

      const dataFormateada = formatHistoriasForExcel(historiasFiltradas);

      if (formato === 'excel') {
        exportToExcel({
          data: dataFormateada,
          fileName: 'consultorios_historias',
          sheetName: 'Historias Clínicas',
          userName: localStorage.getItem('healix_user') ? JSON.parse(localStorage.getItem('healix_user')!).nombre : undefined,
          dateRange: filtrosHistorias.desde ? {
            desde: filtrosHistorias.desde,
            hasta: filtrosHistorias.hasta || format(new Date(), 'yyyy-MM-dd')
          } : undefined,
        });
      } else {
        exportToCSV({
          data: dataFormateada,
          fileName: 'consultorios_historias',
        });
      }

      toast.success("Archivo descargado exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al descargar, intente de nuevo");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Exportar Datos del Sistema"
        description="Descarga reportes en Excel o CSV"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pacientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Pacientes
            </CardTitle>
            <CardDescription>Exportar información de pacientes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pac-desde">Desde</Label>
                <Input
                  id="pac-desde"
                  type="date"
                  value={filtrosPacientes.desde}
                  onChange={(e) => setFiltrosPacientes({ ...filtrosPacientes, desde: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pac-hasta">Hasta</Label>
                <Input
                  id="pac-hasta"
                  type="date"
                  value={filtrosPacientes.hasta}
                  onChange={(e) => setFiltrosPacientes({ ...filtrosPacientes, hasta: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleExportarPacientes('excel')} 
                className="flex-1 gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </Button>
              <Button 
                onClick={() => handleExportarPacientes('csv')} 
                variant="outline"
                className="flex-1 gap-2"
              >
                <Download className="w-4 h-4" />
                CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Citas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Citas Médicas
            </CardTitle>
            <CardDescription>Exportar citas agendadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cit-desde">Desde</Label>
                <Input
                  id="cit-desde"
                  type="date"
                  value={filtrosCitas.desde}
                  onChange={(e) => setFiltrosCitas({ ...filtrosCitas, desde: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cit-hasta">Hasta</Label>
                <Input
                  id="cit-hasta"
                  type="date"
                  value={filtrosCitas.hasta}
                  onChange={(e) => setFiltrosCitas({ ...filtrosCitas, hasta: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={filtrosCitas.estado} onValueChange={(v) => setFiltrosCitas({ ...filtrosCitas, estado: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Médico</Label>
                <Select value={filtrosCitas.medicoId} onValueChange={(v) => setFiltrosCitas({ ...filtrosCitas, medicoId: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {profesionales.map(p => (
                      <SelectItem key={p.id} value={p.id!.toString()}>
                        {p.nombre} {p.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleExportarCitas('excel')} 
                className="flex-1 gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </Button>
              <Button 
                onClick={() => handleExportarCitas('csv')} 
                variant="outline"
                className="flex-1 gap-2"
              >
                <Download className="w-4 h-4" />
                CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Historias Clínicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Historias Clínicas
            </CardTitle>
            <CardDescription>Exportar historias médicas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hist-desde">Desde</Label>
                <Input
                  id="hist-desde"
                  type="date"
                  value={filtrosHistorias.desde}
                  onChange={(e) => setFiltrosHistorias({ ...filtrosHistorias, desde: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hist-hasta">Hasta</Label>
                <Input
                  id="hist-hasta"
                  type="date"
                  value={filtrosHistorias.hasta}
                  onChange={(e) => setFiltrosHistorias({ ...filtrosHistorias, hasta: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Médico</Label>
              <Select value={filtrosHistorias.medicoId} onValueChange={(v) => setFiltrosHistorias({ ...filtrosHistorias, medicoId: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {profesionales.map(p => (
                    <SelectItem key={p.id} value={p.id!.toString()}>
                      {p.nombre} {p.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleExportarHistorias('excel')} 
                className="flex-1 gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </Button>
              <Button 
                onClick={() => handleExportarHistorias('csv')} 
                variant="outline"
                className="flex-1 gap-2"
              >
                <Download className="w-4 h-4" />
                CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
