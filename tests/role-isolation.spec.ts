import { test, expect } from '@playwright/test';
import { TEST_USERS, ROUTE_PERMISSIONS } from './fixtures/test-users';

/**
 * Tests de aislamiento de roles
 * Verifican que cada rol solo pueda acceder a sus rutas permitidas
 * y sea redirigido apropiadamente cuando intenta acceder a rutas no permitidas
 */

test.describe('Aislamiento de Roles y Seguridad de Rutas', () => {
  
  // Helper para login
  async function login(page: any, userType: keyof typeof TEST_USERS) {
    const user = TEST_USERS[userType];
    await page.goto('/login');
    await page.fill('input[type="email"]', user.email);
    await page.fill('input[type="password"]', user.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(user.expectedDashboard, { timeout: 5000 });
  }

  test('PACIENTE no puede acceder a ninguna ruta de MEDICO', async ({ page }) => {
    await login(page, 'paciente');
    
    for (const route of ROUTE_PERMISSIONS.MEDICO) {
      await page.goto(route);
      // Debe redirigir al dashboard del paciente
      await expect(page).toHaveURL('/paciente/dashboard');
    }
  });

  test('PACIENTE no puede acceder a ninguna ruta de ADMIN', async ({ page }) => {
    await login(page, 'paciente');
    
    for (const route of ROUTE_PERMISSIONS.ADMIN) {
      await page.goto(route);
      await expect(page).toHaveURL('/paciente/dashboard');
    }
  });

  test('MEDICO no puede acceder a ninguna ruta de PACIENTE', async ({ page }) => {
    await login(page, 'medico');
    
    for (const route of ROUTE_PERMISSIONS.PACIENTE) {
      await page.goto(route);
      await expect(page).toHaveURL('/medico/dashboard');
    }
  });

  test('MEDICO no puede acceder a ninguna ruta de ADMIN', async ({ page }) => {
    await login(page, 'medico');
    
    for (const route of ROUTE_PERMISSIONS.ADMIN) {
      await page.goto(route);
      await expect(page).toHaveURL('/medico/dashboard');
    }
  });

  test('RECEPCIONISTA no puede acceder a rutas de MEDICO', async ({ page }) => {
    await login(page, 'recepcionista');
    
    for (const route of ROUTE_PERMISSIONS.MEDICO) {
      await page.goto(route);
      await expect(page).toHaveURL('/recepcion/dashboard');
    }
  });

  test('RECEPCIONISTA no puede acceder a rutas de ADMIN', async ({ page }) => {
    await login(page, 'recepcionista');
    
    for (const route of ROUTE_PERMISSIONS.ADMIN) {
      await page.goto(route);
      await expect(page).toHaveURL('/recepcion/dashboard');
    }
  });

  test('CUIDADOR no puede acceder a rutas de MEDICO', async ({ page }) => {
    await login(page, 'cuidador');
    
    for (const route of ROUTE_PERMISSIONS.MEDICO) {
      await page.goto(route);
      await expect(page).toHaveURL('/cuidador/dashboard');
    }
  });

  test('CUIDADOR no puede acceder a rutas de ADMIN', async ({ page }) => {
    await login(page, 'cuidador');
    
    for (const route of ROUTE_PERMISSIONS.ADMIN) {
      await page.goto(route);
      await expect(page).toHaveURL('/cuidador/dashboard');
    }
  });

  test('ADMIN no puede acceder a rutas de otros roles', async ({ page }) => {
    await login(page, 'admin');
    
    // Admin no debería poder ver dashboards de otros roles
    await page.goto('/paciente/dashboard');
    await expect(page).toHaveURL('/admin/dashboard');
    
    await page.goto('/medico/dashboard');
    await expect(page).toHaveURL('/admin/dashboard');
    
    await page.goto('/recepcion/dashboard');
    await expect(page).toHaveURL('/admin/dashboard');
  });

  test('Acceso directo por URL sin autenticación redirige a login', async ({ page }) => {
    // Sin login, intentar acceder a cualquier ruta protegida
    const protectedRoutes = [
      ...ROUTE_PERMISSIONS.PACIENTE,
      ...ROUTE_PERMISSIONS.MEDICO,
      ...ROUTE_PERMISSIONS.ADMIN,
      ...ROUTE_PERMISSIONS.RECEPCIONISTA,
      ...ROUTE_PERMISSIONS.CUIDADOR,
    ];

    // Probar 5 rutas aleatorias
    const sampled = protectedRoutes.sort(() => 0.5 - Math.random()).slice(0, 5);
    
    for (const route of sampled) {
      await page.goto(route);
      await expect(page).toHaveURL('/login');
    }
  });

  test('Logout limpia sesión y redirige a login', async ({ page }) => {
    await login(page, 'paciente');
    
    // Buscar botón de logout (puede variar el selector)
    const logoutButton = page.locator('button:has-text("Cerrar Sesión"), button:has-text("Logout")').first();
    await logoutButton.click();
    
    // Debe redirigir a login
    await expect(page).toHaveURL('/login', { timeout: 3000 });
    
    // Intentar volver al dashboard debería redirigir a login
    await page.goto('/paciente/dashboard');
    await expect(page).toHaveURL('/login');
  });
});
