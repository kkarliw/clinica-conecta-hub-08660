# Tests E2E con Playwright

Este directorio contiene pruebas end-to-end para verificar la autenticación y el sistema de rutas por roles.

## Configuración

### 1. Instalar dependencias de Playwright

```bash
npx playwright install
```

### 2. Crear usuarios de prueba

Antes de ejecutar los tests, necesitas crear usuarios de prueba en tu base de datos. Puedes usar estos datos:

```sql
-- Paciente
email: paciente@test.com
password: test123
rol: PACIENTE

-- Médico
email: medico@test.com
password: test123
rol: MEDICO

-- Recepcionista
email: recepcion@test.com
password: test123
rol: RECEPCIONISTA

-- Cuidador
email: cuidador@test.com
password: test123
rol: CUIDADOR

-- Admin
email: admin@test.com
password: test123
rol: ADMIN
```

## Ejecutar Tests

### Ejecutar todos los tests

```bash
npm run test:e2e
```

### Ejecutar tests en modo UI (recomendado para desarrollo)

```bash
npm run test:e2e:ui
```

### Ejecutar tests en modo debug

```bash
npm run test:e2e:debug
```

### Ejecutar un test específico

```bash
npx playwright test auth-routes.spec.ts
```

### Ver reporte de tests

```bash
npx playwright show-report
```

## Estructura de Tests

### `auth-routes.spec.ts`
Pruebas básicas de autenticación y navegación:
- Login correcto para cada rol
- Redirección al dashboard correcto
- Acceso a rutas permitidas
- Bloqueo de rutas no permitidas

### `role-isolation.spec.ts`
Pruebas de aislamiento de seguridad:
- Verificación de que cada rol NO puede acceder a rutas de otros roles
- Pruebas de logout
- Acceso sin autenticación

### `fixtures/test-users.ts`
Configuración centralizada de usuarios y permisos de rutas para reutilizar en todos los tests.

## Scripts de npm

Agrega estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

## CI/CD

Los tests están configurados para ejecutarse en CI con:
- 2 reintentos automáticos en caso de fallo
- Screenshots en fallos
- Trazas en primer reintento
- Reporte HTML

## Troubleshooting

### Error: "usuarios no encontrados"
Asegúrate de haber creado los usuarios de prueba en tu base de datos.

### Error: "timeout waiting for URL"
Verifica que el servidor de desarrollo esté corriendo en `http://localhost:5173`.

### Tests fallan aleatoriamente
Esto puede indicar problemas de race conditions en tu código. Revisa que los componentes esperen correctamente a que los datos se carguen.

## Mejoras Futuras

- [ ] Agregar tests de formularios
- [ ] Agregar tests de API mocking
- [ ] Agregar tests de accesibilidad con axe
- [ ] Agregar tests visuales con Percy/Chromatic
- [ ] Agregar tests de performance con Lighthouse
