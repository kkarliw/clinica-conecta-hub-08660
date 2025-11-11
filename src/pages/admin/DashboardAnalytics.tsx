import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCitas, getPacientes, getProfesionales } from "@/lib/api";
import { FiltrosDashboard, FiltrosState } from "@/components/dashboard/FiltrosDashboard";
import { KPICards } from "@/components/dashboard/KPICards";
import { GraficaLinea } from "@/components/dashboard/GraficaLinea";
import { GraficaBarras } from "@/components/dashboard/GraficaBarras";
import { GraficaDona } from "@/components/dashboard/GraficaDona";
import { GraficaArea } from "@/components/dashboard/GraficaArea";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parse, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";
import { es } from "date-fns/locale";

export default function DashboardAnalytics() {
  const [filtros, setFiltros] = useState<FiltrosState>({
    desde: format(subMonths(new Date(), 11), 'yyyy-MM-dd'),
    hasta: format(new Date(), 'yyyy-MM-dd'),
  });

  const { data: citas = [], isLoading: loadingCitas } = useQuery({
    queryKey: ["citas"],
    queryFn: getCitas,
  });

  const { data: pacientes = [], isLoading: loadingPacientes } = useQuery({
    queryKey: ["pacientes"],
    queryFn: getPacientes,
  });

  const { data: profesionales = [], isLoading: loadingProfesionales } = useQuery({
    queryKey: ["profesionales"],
    queryFn: getProfesionales,
  });

  const citasFiltradas = useMemo(() => {
    return citas.filter(cita => {
      const fechaCita = new Date(cita.fecha);
      const desde = new Date(filtros.desde);
      const hasta = new Date(filtros.hasta);
      
      if (fechaCita < desde || fechaCita > hasta) return false;
      if (filtros.medicoId && cita.profesionalId !== filtros.medicoId) return false;
      if (filtros.especialidad) {
        const profesional = profesionales.find(p => p.id === cita.profesionalId);
        if (profesional?.especialidad !== filtros.especialidad) return false;
      }
      
      return true;
    });
  }, [citas, filtros, profesionales]);

  // KPIs
  const totalCitas = citasFiltradas.length;
  const citasCompletadas = citasFiltradas.filter(c => c.estado === 'completada').length;
  const citasCanceladas = citasFiltradas.filter(c => c.estado === 'cancelada').length;
  // Aproximamos pacientes nuevos por los que tienen citas en el período
  const pacientesNuevos = pacientes.filter(p => {
    const primerasCitas = citas.filter(c => c.pacienteId === p.id);
    if (primerasCitas.length === 0) return false;
    const primeraFecha = new Date(primerasCitas.sort((a, b) => 
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    )[0].fecha);
    return primeraFecha >= new Date(filtros.desde) && primeraFecha <= new Date(filtros.hasta);
  }).length;

  // Datos para gráficas
  const datosCitasPorMes = useMemo(() => {
    const meses = eachMonthOfInterval({
      start: subMonths(new Date(), 11),
      end: new Date()
    });

    return meses.map(mes => {
      const citasDelMes = citasFiltradas.filter(c => {
        const fechaCita = new Date(c.fecha);
        return fechaCita >= startOfMonth(mes) && fechaCita <= endOfMonth(mes);
      });

      return {
        mes: format(mes, 'MMM', { locale: es }),
        total: citasDelMes.length,
        completadas: citasDelMes.filter(c => c.estado === 'completada').length,
        canceladas: citasDelMes.filter(c => c.estado === 'cancelada').length,
      };
    });
  }, [citasFiltradas]);

  const datosEspecialidades = useMemo(() => {
    const conteo: Record<string, number> = {};
    
    citasFiltradas.forEach(cita => {
      const profesional = profesionales.find(p => p.id === cita.profesionalId);
      const especialidad = profesional?.especialidad || 'Sin especialidad';
      conteo[especialidad] = (conteo[especialidad] || 0) + 1;
    });

    return Object.entries(conteo)
      .map(([especialidad, cantidad]) => ({ especialidad, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10);
  }, [citasFiltradas, profesionales]);

  const datosEdades = useMemo(() => {
    const rangos = {
      '0-18': 0,
      '19-35': 0,
      '36-50': 0,
      '51-65': 0,
      '65+': 0,
    };

    pacientes.forEach(p => {
      const edad = calcularEdad(p.fechaNacimiento);
      if (edad <= 18) rangos['0-18']++;
      else if (edad <= 35) rangos['19-35']++;
      else if (edad <= 50) rangos['36-50']++;
      else if (edad <= 65) rangos['51-65']++;
      else rangos['65+']++;
    });

    return Object.entries(rangos).map(([rango, cantidad]) => ({ rango, cantidad }));
  }, [pacientes]);

  const datosHorasPico = useMemo(() => {
    const horas = Array.from({ length: 24 }, (_, i) => ({
      hora: i.toString(),
      cantidad: 0,
    }));

    citasFiltradas.forEach(cita => {
      const hora = new Date(cita.fecha).getHours();
      horas[hora].cantidad++;
    });

    return horas;
  }, [citasFiltradas]);

  const topMedicos = useMemo(() => {
    const stats: Record<number, {
      medico: string;
      especialidad: string;
      citas: number;
      completadas: number;
    }> = {};

    citasFiltradas.forEach(cita => {
      if (!stats[cita.profesionalId]) {
        const profesional = profesionales.find(p => p.id === cita.profesionalId);
        stats[cita.profesionalId] = {
          medico: profesional ? `${profesional.nombre} ${profesional.apellido}` : 'Desconocido',
          especialidad: profesional?.especialidad || 'N/A',
          citas: 0,
          completadas: 0,
        };
      }
      stats[cita.profesionalId].citas++;
      if (cita.estado === 'completada') {
        stats[cita.profesionalId].completadas++;
      }
    });

    return Object.values(stats)
      .map(s => ({
        ...s,
        porcentajeAsistencia: s.citas > 0 ? Math.round((s.completadas / s.citas) * 100) : 0,
      }))
      .sort((a, b) => b.citas - a.citas)
      .slice(0, 10);
  }, [citasFiltradas, profesionales]);

  if (loadingCitas || loadingPacientes || loadingProfesionales) {
    return <LoadingState message="Cargando análisis..." />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Dashboard Analítico"
        description="Análisis y estadísticas del consultorio"
      />

      <FiltrosDashboard 
        profesionales={profesionales as any}
        onFiltrar={setFiltros}
      />

      <KPICards
        totalCitas={totalCitas}
        citasCompletadas={citasCompletadas}
        citasCanceladas={citasCanceladas}
        pacientesNuevos={pacientesNuevos}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraficaLinea data={datosCitasPorMes} />
        <GraficaBarras data={datosEspecialidades} />
        <GraficaDona data={datosEdades} />
        <GraficaArea data={datosHorasPico} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 Médicos por Desempeño</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Médico</TableHead>
                  <TableHead className="font-semibold">Especialidad</TableHead>
                  <TableHead className="font-semibold">Citas</TableHead>
                  <TableHead className="font-semibold">Completadas</TableHead>
                  <TableHead className="font-semibold">% Asistencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topMedicos.map((medico, index) => (
                  <TableRow 
                    key={index}
                    className={
                      medico.porcentajeAsistencia >= 85 ? 'bg-green-50 dark:bg-green-950/20' :
                      medico.porcentajeAsistencia >= 70 ? 'bg-yellow-50 dark:bg-yellow-950/20' :
                      'bg-red-50 dark:bg-red-950/20'
                    }
                  >
                    <TableCell className="font-medium">{medico.medico}</TableCell>
                    <TableCell>{medico.especialidad}</TableCell>
                    <TableCell>{medico.citas}</TableCell>
                    <TableCell>{medico.completadas}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          medico.porcentajeAsistencia >= 85 ? 'default' :
                          medico.porcentajeAsistencia >= 70 ? 'outline' :
                          'destructive'
                        }
                      >
                        {medico.porcentajeAsistencia}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}
