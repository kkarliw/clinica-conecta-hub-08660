import { test, expect } from '@playwright/test';

// Helper para hacer login
async function loginAs(page: any, role: string) {
  const credentials: Record<string, { email: string; password: string; expectedRoute: string }> = {
    PACIENTE: { 
      email: 'paciente@test.com', 
      password: 'test123', 
      expectedRoute: '/paciente/dashboard' 
    },
    MEDICO: { 
      email: 'medico@test.com', 
      password: 'test123', 
      expectedRoute: '/medico/dashboard' 
    },
    RECEPCIONISTA: { 
      email: 'recepcion@test.com', 
      password: 'test123', 
      expectedRoute: '/recepcion/dashboard' 
    },
    CUIDADOR: { 
      email: 'cuidador@test.com', 
      password: 'test123', 
      expectedRoute: '/cuidador/dashboard' 
    },
    ADMIN: { 
      email: 'admin@test.com', 
      password: 'test123', 
      expectedRoute: '/admin/dashboard' 
    },
  };

  const creds = credentials[role];
  await page.goto('/login');
  await page.fill('input[type="email"]', creds.email);
  await page.fill('input[type="password"]', creds.password);
  await page.click('button[type="submit"]');
  
  // Esperar redirección
  await page.waitForURL(creds.expectedRoute, { timeout: 5000 });
  
  return creds;
}

test.describe('Autenticación y Rutas por Rol', () => {
  
  test('PACIENTE - Redirige correctamente al dashboard', async ({ page }) => {
    await loginAs(page, 'PACIENTE');
    await expect(page).toHaveURL('/paciente/dashboard');
    await expect(page.locator('h1')).toContainText(/Dashboard|Panel|Paciente/i);
  });

  test('PACIENTE - Puede acceder a sus rutas permitidas', async ({ page }) => {
    await loginAs(page, 'PACIENTE');
    
    const allowedRoutes = [
      '/paciente/dashboard',
      '/paciente/citas',
      '/paciente/citas/nueva',
      '/paciente/historial',
      '/paciente/salud',
      '/paciente/perfil',
    ];

    for (const route of allowedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(route);
    }
  });

  test('PACIENTE - No puede acceder a rutas de médico', async ({ page }) => {
    await loginAs(page, 'PACIENTE');
    
    await page.goto('/medico/dashboard');
    await expect(page).toHaveURL('/paciente/dashboard');
  });

  test('MEDICO - Redirige correctamente al dashboard', async ({ page }) => {
    await loginAs(page, 'MEDICO');
    await expect(page).toHaveURL('/medico/dashboard');
    await expect(page.locator('h1, h2')).toContainText(/Médico|Dashboard|Bienvenido/i);
  });

  test('MEDICO - Puede acceder a sus rutas permitidas', async ({ page }) => {
    await loginAs(page, 'MEDICO');
    
    const allowedRoutes = [
      '/medico/dashboard',
      '/medico/agenda',
      '/medico/pacientes',
      '/medico/formulas',
      '/medico/perfil',
    ];

    for (const route of allowedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(route);
    }
  });

  test('MEDICO - No puede acceder a rutas de paciente', async ({ page }) => {
    await loginAs(page, 'MEDICO');
    
    await page.goto('/paciente/dashboard');
    await expect(page).toHaveURL('/medico/dashboard');
  });

  test('RECEPCIONISTA - Redirige correctamente al dashboard', async ({ page }) => {
    await loginAs(page, 'RECEPCIONISTA');
    await expect(page).toHaveURL('/recepcion/dashboard');
    await expect(page.locator('h1, h2')).toContainText(/Recepción|Dashboard/i);
  });

  test('RECEPCIONISTA - Puede acceder a sus rutas permitidas', async ({ page }) => {
    await loginAs(page, 'RECEPCIONISTA');
    
    const allowedRoutes = [
      '/recepcion/dashboard',
      '/recepcion/citas',
      '/recepcion/pacientes',
      '/recepcion/perfil',
    ];

    for (const route of allowedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(route);
    }
  });

  test('RECEPCIONISTA - No puede acceder a rutas de admin', async ({ page }) => {
    await loginAs(page, 'RECEPCIONISTA');
    
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL('/recepcion/dashboard');
  });

  test('CUIDADOR - Redirige correctamente al dashboard', async ({ page }) => {
    await loginAs(page, 'CUIDADOR');
    await expect(page).toHaveURL('/cuidador/dashboard');
    await expect(page.locator('h1, h2')).toContainText(/Cuidador|Dashboard/i);
  });

  test('CUIDADOR - Puede acceder a sus rutas permitidas', async ({ page }) => {
    await loginAs(page, 'CUIDADOR');
    
    const allowedRoutes = [
      '/cuidador/dashboard',
      '/cuidador/pacientes',
      '/cuidador/citas',
      '/cuidador/reportes',
      '/cuidador/notificaciones',
      '/cuidador/perfil',
    ];

    for (const route of allowedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(route);
    }
  });

  test('CUIDADOR - No puede acceder a rutas de médico', async ({ page }) => {
    await loginAs(page, 'CUIDADOR');
    
    await page.goto('/medico/dashboard');
    await expect(page).toHaveURL('/cuidador/dashboard');
  });

  test('ADMIN - Redirige correctamente al dashboard', async ({ page }) => {
    await loginAs(page, 'ADMIN');
    await expect(page).toHaveURL('/admin/dashboard');
    await expect(page.locator('h1, h2')).toContainText(/Admin|Dashboard/i);
  });

  test('ADMIN - Puede acceder a sus rutas permitidas', async ({ page }) => {
    await loginAs(page, 'ADMIN');
    
    const allowedRoutes = [
      '/admin/dashboard',
      '/admin/pacientes',
      '/admin/profesionales',
      '/admin/citas',
      '/admin/historias',
      '/admin/estadisticas',
    ];

    for (const route of allowedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(route);
    }
  });

  test('ADMIN - No puede acceder a rutas de paciente', async ({ page }) => {
    await loginAs(page, 'ADMIN');
    
    await page.goto('/paciente/dashboard');
    await expect(page).toHaveURL('/admin/dashboard');
  });

  test('Usuario no autenticado redirige a /login', async ({ page }) => {
    await page.goto('/paciente/dashboard');
    await expect(page).toHaveURL('/login');
    
    await page.goto('/medico/dashboard');
    await expect(page).toHaveURL('/login');
    
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL('/login');
  });
});
