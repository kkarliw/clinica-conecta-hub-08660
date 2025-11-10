/**
 * Usuarios de prueba para tests E2E
 * 
 * NOTA: Estos usuarios deben existir en tu base de datos de desarrollo/testing
 * Puedes crearlos manualmente o con un script de seed
 */

export const TEST_USERS = {
  paciente: {
    email: 'paciente@test.com',
    password: 'test123',
    rol: 'PACIENTE',
    nombre: 'Juan Test',
    expectedDashboard: '/paciente/dashboard',
  },
  medico: {
    email: 'medico@test.com',
    password: 'test123',
    rol: 'MEDICO',
    nombre: 'Dr. Test',
    expectedDashboard: '/medico/dashboard',
  },
  recepcionista: {
    email: 'recepcion@test.com',
    password: 'test123',
    rol: 'RECEPCIONISTA',
    nombre: 'Maria Test',
    expectedDashboard: '/recepcion/dashboard',
  },
  cuidador: {
    email: 'cuidador@test.com',
    password: 'test123',
    rol: 'CUIDADOR',
    nombre: 'Carlos Test',
    expectedDashboard: '/cuidador/dashboard',
  },
  admin: {
    email: 'admin@test.com',
    password: 'test123',
    rol: 'ADMIN',
    nombre: 'Admin Test',
    expectedDashboard: '/admin/dashboard',
  },
};

export const ROUTE_PERMISSIONS = {
  PACIENTE: [
    '/paciente/dashboard',
    '/paciente/citas',
    '/paciente/citas/nueva',
    '/paciente/historial',
    '/paciente/salud',
    '/paciente/perfil',
  ],
  MEDICO: [
    '/medico/dashboard',
    '/medico/agenda',
    '/medico/pacientes',
    '/medico/formulas',
    '/medico/perfil',
    '/medico/completar-cita',
  ],
  RECEPCIONISTA: [
    '/recepcion/dashboard',
    '/recepcion/citas',
    '/recepcion/pacientes',
    '/recepcion/perfil',
  ],
  CUIDADOR: [
    '/cuidador/dashboard',
    '/cuidador/pacientes',
    '/cuidador/citas',
    '/cuidador/reportes',
    '/cuidador/notificaciones',
    '/cuidador/perfil',
  ],
  ADMIN: [
    '/admin/dashboard',
    '/admin/pacientes',
    '/admin/profesionales',
    '/admin/citas',
    '/admin/historias',
    '/admin/estadisticas',
  ],
};
