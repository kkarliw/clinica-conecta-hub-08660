import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireRole from "@/components/RequireRole";
import Layout from "@/components/Layout";
import AdminLayout from "@/components/layouts/AdminLayout";
import DoctorLayout from "@/components/layouts/DoctorLayout";
import PatientLayout from "@/components/layouts/PatientLayout";
import CaregiverLayout from "@/components/layouts/CaregiverLayout";
import RecepcionistaLayout from "@/components/layouts/RecepcionistaLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Registro from "@/pages/Registro";
import Verificacion from "@/pages/Verificacion";
import RecuperarPassword from "@/pages/RecuperarPassword";
import Dashboard from "@/pages/Dashboard";
import Pacientes from "@/pages/Pacientes";
import Profesionales from "@/pages/Profesionales";
import Consultorios from "@/pages/Consultorios";
import Citas from "@/pages/Citas";
import HistoriasClinicas from "@/pages/HistoriasClinicas";
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import DoctorAgenda from "@/pages/doctor/DoctorAgenda";
import DoctorPatients from "@/pages/doctor/DoctorPatients";
import ViewPatientHistory from "@/pages/doctor/ViewPatientHistory";
import NewHistoriaClinica from "@/pages/doctor/NewHistoriaClinica";
import CompletarCita from "@/pages/doctor/CompletarCita";
import DoctorPrescriptions from "@/pages/doctor/DoctorPrescriptions";
import DoctorProfile from "@/pages/doctor/DoctorProfile";
import PatientDashboard from "@/pages/patient/PatientDashboard";
import PatientAppointments from "@/pages/patient/PatientAppointments";
import NewAppointment from "@/pages/patient/NewAppointment";
import PatientHistory from "@/pages/patient/PatientHistory";
import PatientHealth from "@/pages/patient/PatientHealth";
import PatientProfile from "@/pages/patient/PatientProfile";
import CuidadorDashboard from "@/pages/cuidador/CuidadorDashboard";
import CuidadorPatients from "@/pages/cuidador/CuidadorPacientes";
import CuidadorCitas from "@/pages/cuidador/CuidadorCitas";
import CuidadorReportes from "@/pages/cuidador/CuidadorReportes";
import CuidadorNotificaciones from "@/pages/cuidador/CuidadorNotificaciones";
import CaregiverProfile from "@/pages/caregiver/CaregiverProfile";
import RecepcionistaDashboard from "@/pages/recepcionista/RecepcionistaDashboard";
import RecepcionistaCitas from "@/pages/recepcionista/RecepcionistaCitas";
import RecepcionistaPacientes from "@/pages/recepcionista/RecepcionistaPacientes";
import RecepcionistaProfile from "@/pages/recepcionista/RecepcionistaProfile";
import DashboardPaciente from "@/pages/dashboard/DashboardPaciente";
import DashboardMedico from "@/pages/dashboard/DashboardMedico";
import DashboardAdmin from "@/pages/dashboard/DashboardAdmin";
import DashboardEstadisticas from "@/pages/dashboard/DashboardEstadisticas";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/verificacion" element={<Verificacion />} />
            <Route path="/recuperar-password" element={<RecuperarPassword />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <RequireRole role="ADMIN">
                <AdminLayout><AdminDashboard /></AdminLayout>
              </RequireRole>
            } />
            <Route path="/admin/pacientes" element={
              <RequireRole role="ADMIN">
                <AdminLayout><Pacientes /></AdminLayout>
              </RequireRole>
            } />
            <Route path="/admin/profesionales" element={
              <RequireRole role="ADMIN">
                <AdminLayout><Profesionales /></AdminLayout>
              </RequireRole>
            } />
            <Route path="/admin/citas" element={
              <RequireRole role="ADMIN">
                <AdminLayout><Citas /></AdminLayout>
              </RequireRole>
            } />
            <Route path="/admin/consultorios" element={
              <RequireRole role="ADMIN">
                <AdminLayout><Consultorios /></AdminLayout>
              </RequireRole>
            } />
            <Route path="/admin/historias" element={
              <RequireRole role="ADMIN">
                <AdminLayout><HistoriasClinicas /></AdminLayout>
              </RequireRole>
            } />
            <Route path="/admin/estadisticas" element={
              <RequireRole role="ADMIN">
                <AdminLayout><DashboardEstadisticas /></AdminLayout>
              </RequireRole>
            } />

            {/* Recepcionista Routes */}
            <Route path="/recepcion/dashboard" element={
              <RequireRole role="RECEPCIONISTA">
                <RecepcionistaLayout><RecepcionistaDashboard /></RecepcionistaLayout>
              </RequireRole>
            } />
            <Route path="/recepcion/citas" element={
              <RequireRole role="RECEPCIONISTA">
                <RecepcionistaLayout><RecepcionistaCitas /></RecepcionistaLayout>
              </RequireRole>
            } />
            <Route path="/recepcion/pacientes" element={
              <RequireRole role="RECEPCIONISTA">
                <RecepcionistaLayout><RecepcionistaPacientes /></RecepcionistaLayout>
              </RequireRole>
            } />
            <Route path="/recepcion/consultorios" element={
              <RequireRole role="RECEPCIONISTA">
                <RecepcionistaLayout><Consultorios /></RecepcionistaLayout>
              </RequireRole>
            } />
            <Route path="/recepcion/perfil" element={
              <RequireRole role="RECEPCIONISTA">
                <RecepcionistaLayout><RecepcionistaProfile /></RecepcionistaLayout>
              </RequireRole>
            } />

            {/* Doctor Routes */}
            <Route path="/medico/dashboard" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><DoctorDashboard /></DoctorLayout>
              </RequireRole>
            } />
            <Route path="/medico/agenda" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><DoctorAgenda /></DoctorLayout>
              </RequireRole>
            } />
            <Route path="/medico/pacientes" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><DoctorPatients /></DoctorLayout>
              </RequireRole>
            } />
            <Route path="/medico/historias/:id" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><ViewPatientHistory /></DoctorLayout>
              </RequireRole>
            } />
            <Route path="/medico/historias/nueva" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><NewHistoriaClinica /></DoctorLayout>
              </RequireRole>
            } />
            <Route path="/medico/completar-cita" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><CompletarCita /></DoctorLayout>
              </RequireRole>
            } />
            <Route path="/medico/formulas" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><DoctorPrescriptions /></DoctorLayout>
              </RequireRole>
            } />
            <Route path="/medico/perfil" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><DoctorProfile /></DoctorLayout>
              </RequireRole>
            } />

            {/* Patient Routes */}
            <Route path="/paciente/dashboard" element={
              <RequireRole role="PACIENTE">
                <PatientLayout><PatientDashboard /></PatientLayout>
              </RequireRole>
            } />
            <Route path="/paciente/citas" element={
              <RequireRole role="PACIENTE">
                <PatientLayout><PatientAppointments /></PatientLayout>
              </RequireRole>
            } />
            <Route path="/paciente/citas/nueva" element={
              <RequireRole role="PACIENTE">
                <PatientLayout><NewAppointment /></PatientLayout>
              </RequireRole>
            } />
            <Route path="/paciente/historial" element={
              <RequireRole role="PACIENTE">
                <PatientLayout><PatientHistory /></PatientLayout>
              </RequireRole>
            } />
            <Route path="/paciente/salud" element={
              <RequireRole role="PACIENTE">
                <PatientLayout><PatientHealth /></PatientLayout>
              </RequireRole>
            } />
            <Route path="/paciente/perfil" element={
              <RequireRole role="PACIENTE">
                <PatientLayout><PatientProfile /></PatientLayout>
              </RequireRole>
            } />

            {/* Caregiver Routes */}
            <Route path="/dashboard/cuidador" element={
              <RequireRole role="CUIDADOR">
                <CaregiverLayout><CuidadorDashboard /></CaregiverLayout>
              </RequireRole>
            } />
            <Route path="/cuidador/dashboard" element={
              <RequireRole role="CUIDADOR">
                <CaregiverLayout><CuidadorDashboard /></CaregiverLayout>
              </RequireRole>
            } />
            <Route path="/cuidador/pacientes" element={
              <RequireRole role="CUIDADOR">
                <CaregiverLayout><CuidadorPatients /></CaregiverLayout>
              </RequireRole>
            } />
            <Route path="/cuidador/citas" element={
              <RequireRole role="CUIDADOR">
                <CaregiverLayout><CuidadorCitas /></CaregiverLayout>
              </RequireRole>
            } />
            <Route path="/cuidador/reportes" element={
              <RequireRole role="CUIDADOR">
                <CaregiverLayout><CuidadorReportes /></CaregiverLayout>
              </RequireRole>
            } />
            <Route path="/cuidador/notificaciones" element={
              <RequireRole role="CUIDADOR">
                <CaregiverLayout><CuidadorNotificaciones /></CaregiverLayout>
              </RequireRole>
            } />
            <Route path="/cuidador/perfil" element={
              <RequireRole role="CUIDADOR">
                <CaregiverLayout><CaregiverProfile /></CaregiverLayout>
              </RequireRole>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
