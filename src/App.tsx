import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireRole from "@/components/RequireRole";
import Layout from "@/components/Layout";
import DoctorLayout from "@/components/layouts/DoctorLayout";
import PatientLayout from "@/components/layouts/PatientLayout";
import CaregiverLayout from "@/components/layouts/CaregiverLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Registro from "@/pages/Registro";
import Verificacion from "@/pages/Verificacion";
import RecuperarPassword from "@/pages/RecuperarPassword";
import Dashboard from "@/pages/Dashboard";
import Pacientes from "@/pages/Pacientes";
import Profesionales from "@/pages/Profesionales";
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
import CaregiverDashboard from "@/pages/caregiver/CaregiverDashboard";
import CaregiverPatients from "@/pages/caregiver/CaregiverPatients";
import CaregiverProfile from "@/pages/caregiver/CaregiverProfile";
import DashboardPaciente from "@/pages/dashboard/DashboardPaciente";
import DashboardMedico from "@/pages/dashboard/DashboardMedico";
import DashboardAdmin from "@/pages/dashboard/DashboardAdmin";
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
            
            {/* New Role-Based Dashboard Routes */}
            <Route path="/dashboard/paciente" element={
              <RequireRole role="PACIENTE">
                <DashboardPaciente />
              </RequireRole>
            } />
            <Route path="/dashboard/medico" element={
              <RequireRole role="MEDICO">
                <DashboardMedico />
              </RequireRole>
            } />
            <Route path="/dashboard/admin" element={
              <RequireRole role="ADMIN">
                <DashboardAdmin />
              </RequireRole>
            } />

            {/* Admin Management Routes */}
            <Route path="/dashboard" element={
              <RequireRole role="ADMIN">
                <Layout><Dashboard /></Layout>
              </RequireRole>
            } />
            <Route path="/pacientes" element={
              <RequireRole role="ADMIN">
                <Layout><Pacientes /></Layout>
              </RequireRole>
            } />
            <Route path="/profesionales" element={
              <RequireRole role="ADMIN">
                <Layout><Profesionales /></Layout>
              </RequireRole>
            } />
            <Route path="/citas" element={
              <RequireRole role="ADMIN">
                <Layout><Citas /></Layout>
              </RequireRole>
            } />
            <Route path="/historias-clinicas" element={
              <RequireRole role="ADMIN">
                <Layout><HistoriasClinicas /></Layout>
              </RequireRole>
            } />

            {/* Doctor/Specialist Routes (shared) */}
            <Route path="/doctor/dashboard" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><DoctorDashboard /></DoctorLayout>
              </RequireRole>
            } />
            <Route path="/doctor/agenda" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><DoctorAgenda /></DoctorLayout>
              </RequireRole>
            } />
            <Route path="/doctor/patients" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><DoctorPatients /></DoctorLayout>
              </RequireRole>
            } />
            <Route path="/doctor/history/:id" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><ViewPatientHistory /></DoctorLayout>
              </RequireRole>
            } />
            <Route path="/doctor/history/new" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><NewHistoriaClinica /></DoctorLayout>
              </RequireRole>
            } />
            <Route path="/doctor/completar-cita" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><CompletarCita /></DoctorLayout>
              </RequireRole>
            } />
            <Route path="/doctor/prescriptions" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><DoctorPrescriptions /></DoctorLayout>
              </RequireRole>
            } />
            <Route path="/doctor/profile" element={
              <RequireRole role="MEDICO">
                <DoctorLayout><DoctorProfile /></DoctorLayout>
              </RequireRole>
            } />

            {/* Patient Routes */}
            <Route path="/patient/dashboard" element={
              <RequireRole role="PACIENTE">
                <PatientLayout><PatientDashboard /></PatientLayout>
              </RequireRole>
            } />
            <Route path="/patient/appointments" element={
              <RequireRole role="PACIENTE">
                <PatientLayout><PatientAppointments /></PatientLayout>
              </RequireRole>
            } />
            <Route path="/patient/appointments/new" element={
              <RequireRole role="PACIENTE">
                <PatientLayout><NewAppointment /></PatientLayout>
              </RequireRole>
            } />
            <Route path="/patient/history" element={
              <RequireRole role="PACIENTE">
                <PatientLayout><PatientHistory /></PatientLayout>
              </RequireRole>
            } />
            <Route path="/patient/health" element={
              <RequireRole role="PACIENTE">
                <PatientLayout><PatientHealth /></PatientLayout>
              </RequireRole>
            } />
            <Route path="/patient/profile" element={
              <RequireRole role="PACIENTE">
                <PatientLayout><PatientProfile /></PatientLayout>
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
