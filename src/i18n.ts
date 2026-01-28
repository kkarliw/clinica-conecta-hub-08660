import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      common: {
        welcome: 'Bienvenido',
        login: 'Iniciar Sesión',
        logout: 'Cerrar Sesión',
        register: 'Registrarse',
        save: 'Guardar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        create: 'Crear',
        search: 'Buscar',
        loading: 'Cargando...',
      },
      patient: {
        dashboard: 'Mi Portal',
        appointments: 'Mis Citas',
        history: 'Historial Médico',
        health: 'Mi Salud',
        profile: 'Mi Perfil',
        nextAppointment: 'Tu Próxima Cita',
        noAppointments: 'No tienes citas programadas',
      },
      doctor: {
        dashboard: 'Panel de Control',
        agenda: 'Mi Agenda',
        patients: 'Mis Pacientes',
        prescriptions: 'Fórmulas Médicas',
        profile: 'Mi Perfil',
        todaysAppointments: 'Citas de Hoy',
        noAppointments: 'No hay citas programadas para hoy',
      },
      caregiver: {
        dashboard: 'Panel de Cuidador',
        patients: 'Mis Pacientes',
        profile: 'Mi Perfil',
        alerts: 'Alertas',
      },
    },
  },
  en: {
    translation: {
      common: {
        welcome: 'Welcome',
        login: 'Login',
        logout: 'Logout',
        register: 'Register',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        search: 'Search',
        loading: 'Loading...',
      },
      patient: {
        dashboard: 'My Portal',
        appointments: 'My Appointments',
        history: 'Medical History',
        health: 'My Health',
        profile: 'My Profile',
        nextAppointment: 'Your Next Appointment',
        noAppointments: 'You have no scheduled appointments',
      },
      doctor: {
        dashboard: 'Dashboard',
        agenda: 'My Schedule',
        patients: 'My Patients',
        prescriptions: 'Prescriptions',
        profile: 'My Profile',
        todaysAppointments: "Today's Appointments",
        noAppointments: 'No appointments scheduled for today',
      },
      caregiver: {
        dashboard: 'Caregiver Dashboard',
        patients: 'My Patients',
        profile: 'My Profile',
        alerts: 'Alerts',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
