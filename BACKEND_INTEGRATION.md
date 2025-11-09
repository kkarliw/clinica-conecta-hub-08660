# 📋 RESUMEN DE INTEGRACIÓN FRONTEND-BACKEND
## Healix Pro - Sistema de Gestión Médica

**Última actualización:** $(date)  
**Backend:** Java (Spark Framework) - Puerto 4567  
**Frontend:** React + TypeScript + Vite

---

## ✅ ENDPOINTS CONECTADOS CORRECTAMENTE

### 🔐 Autenticación
| Método | Ruta | Estado | Implementado en |
|--------|------|--------|-----------------|
| POST | `/api/auth/login` | ✅ Conectado | `AuthContext.tsx` |
| POST | `/api/auth/register` | ✅ Conectado | `AuthContext.tsx` |

**Funcionalidad:**
- Login retorna: `{token, rol, nombre, id, email}`
- Token JWT se guarda en `localStorage` como `healix_token`
- Se agrega automáticamente en header: `Authorization: Bearer {token}`

---

### 👥 Pacientes
| Método | Ruta | Estado | Función |
|--------|------|--------|---------|
| GET | `/api/pacientes` | ✅ Conectado | `getPacientes()` |
| GET | `/api/pacientes/:id` | ✅ Conectado | `getPacienteById()` |
| POST | `/api/pacientes` | ✅ Conectado | `createPaciente()` |
| PUT | `/api/pacientes/:id` | ✅ Conectado | `updatePaciente()` |
| DELETE | `/api/pacientes/:id` | ✅ Conectado | `deletePaciente()` |

---

### 📅 Citas
| Método | Ruta | Estado | Función |
|--------|------|--------|---------|
| GET | `/api/citas` | ✅ Conectado | `getCitas()` |
| GET | `/api/citas/:id` | ✅ Conectado | `getCitaById()` |
| GET | `/api/citas/paciente/:id` | ✅ Conectado | `getCitasPaciente()` |
| GET | `/api/citas/medico/:id` | ✅ Conectado | `getCitasMedico()` |
| POST | `/api/citas` | ✅ Conectado | `createCita()` |
| PUT | `/api/citas/:id` | ✅ Conectado | `updateCita()` |
| DELETE | `/api/citas/:id` | ✅ Conectado | `deleteCita()` |

---

### 👨‍⚕️ Profesionales de Salud
| Método | Ruta | Estado | Función |
|--------|------|--------|---------|
| GET | `/api/profesionales` | ✅ Conectado | `getProfesionales()` |
| GET | `/api/profesionales/:id` | ✅ Conectado | (en `api.ts`) |
| POST | `/api/profesionales` | ✅ Conectado | `createProfesional()` |
| PUT | `/api/profesionales/:id` | ✅ Conectado | `updateProfesional()` |

---

### 🔔 Notificaciones
| Método | Ruta | Estado | Función |
|--------|------|--------|---------|
| GET | `/api/notificaciones/:usuarioId` | ✅ Conectado | `getNotificaciones()` |
| POST | `/api/notificaciones` | ✅ Conectado | `enviarNotificacion()` |
| PUT | `/api/notificaciones/:id/leer` | ✅ Conectado | `marcarComoLeida()` |

**Payload de notificación:**
```json
{
  "titulo": "string",
  "mensaje": "string",
  "remitente": number,
  "destinatario": number,
  "tipo": "CITA" | "PACIENTE_LLEGO" | "MENSAJE" | "SISTEMA",
  "cita": number (opcional)
}
```

---

### 📊 Estadísticas
| Método | Ruta | Estado | Función |
|--------|------|--------|---------|
| GET | `/api/estadisticas` | ✅ Conectado | `getEstadisticas()` |
| GET | `/api/estadisticas/medico/:id` | ✅ Conectado | `getEstadisticasMedico()` |

---

### 📄 Historias Clínicas
| Método | Ruta | Estado | Función |
|--------|------|--------|---------|
| GET | `/api/historias` | ✅ Conectado | `getHistoriasClinicas()` |
| GET | `/api/historias/:id` | ✅ Conectado | (en `api.ts`) |
| GET | `/api/historias/paciente/:id` | ✅ Conectado | `getHistoriasClinicasPaciente()` |
| POST | `/api/historias` | ✅ Conectado | `createHistoriaClinica()` |
| GET | `/api/historias/:id/pdf` | ✅ Conectado | (en `api.ts`) |

---

## ⚠️ ENDPOINTS CON SOLUCIONES TEMPORALES

Estos endpoints **NO EXISTEN** en el backend, pero el frontend los simula filtrando datos localmente.

### 🔍 Búsquedas
| Endpoint Necesario | Estado | Solución Temporal |
|--------------------|--------|-------------------|
| `GET /api/pacientes/buscar?nombre=X` | ❌ **FALTA** | Filtra `getPacientes()` en frontend |
| `GET /api/pacientes/buscar?documento=X` | ❌ **FALTA** | Filtra `getPacientes()` en frontend |

**Implementación en:** `src/lib/api.ts` → `buscarPacientesPorNombre()`, `buscarPacientePorDocumento()`

---

### 📅 Citas - Filtros avanzados
| Endpoint Necesario | Estado | Solución Temporal |
|--------------------|--------|-------------------|
| `GET /api/citas/hoy` | ❌ **FALTA** | Filtra `getCitas()` por fecha actual |
| `GET /api/citas/proximas?dias=N` | ❌ **FALTA** | Filtra `getCitas()` por rango de fechas |
| `PUT /api/citas/:id/marcar-llegada` | ❌ **FALTA** | Usa `updateCita()` con estado "confirmada" |

**Implementación en:** `src/lib/api.ts` → `getCitasHoy()`, `getCitasProximas()`, `marcarLlegadaPaciente()`

---

### 🔔 Notificaciones - Filtro
| Endpoint Necesario | Estado | Solución Temporal |
|--------------------|--------|-------------------|
| `GET /api/notificaciones/:id/no-leidas` | ❌ **FALTA** | Filtra `getNotificaciones()` en frontend |

**Implementación en:** `src/lib/notifications.ts` → `getNotificacionesNoLeidas()`

---

## ❌ ENDPOINTS COMPLETAMENTE FALTANTES

Estos **NO existen** y **NO tienen solución temporal**.

| Endpoint | Uso | Prioridad |
|----------|-----|-----------|
| `GET /api/usuarios/:id` | Obtener perfil de usuario | 🔴 Alta |
| `PUT /api/usuarios/:id` | Actualizar perfil de usuario | 🔴 Alta |

**Impacto:**
- La página de perfil del recepcionista lanzará error al intentar cargar/actualizar datos.
- Se necesita crear estos endpoints en el backend.

---

## 🔧 CONFIGURACIÓN DEL FRONTEND

### Archivo principal: `src/lib/api.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4567/api';
```

**Variables de entorno (.env):**
```env
VITE_API_URL=http://localhost:4567/api
```

### Interceptor de JWT

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('healix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Manejo de errores 401 (Token expirado)

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('healix_token');
      localStorage.removeItem('healix_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📦 SERVICIO ESPECÍFICO PARA RECEPCIONISTA

**Archivo:** `src/services/recepcionista.service.ts`

### Funciones principales:

| Función | Descripción |
|---------|-------------|
| `getDashboardRecepcionista(userId)` | Carga estadísticas, citas del día y notificaciones |
| `buscarPacienteRapido(termino)` | Busca por documento o nombre |
| `registrarLlegadaPaciente(citaId, medicoId, nombre)` | Marca llegada y notifica al médico |
| `getCitasDelDia()` | Retorna citas del día agrupadas por estado |
| `getEstadisticasRecepcionista()` | Estadísticas específicas del rol |

---

## 🎯 FLUJO COMPLETO: RECEPCIONISTA REGISTRA LLEGADA

```typescript
// 1. Usuario busca paciente
const pacientes = await buscarPacienteRapido("Juan");

// 2. Ve sus citas
const citas = await getCitasHoy();

// 3. Marca que llegó
await registrarLlegadaPaciente(citaId, medicoId, "Juan Pérez");
// Esto ejecuta:
//   - PUT /api/citas/:id (cambiar estado)
//   - POST /api/notificaciones (notificar médico)

// 4. Médico recibe notificación
const notificaciones = await getNotificaciones(medicoId);
```

---

## 🚀 MODO DESARROLLO

En `Login.tsx` se agregó un botón para acceder como **RECEPCIONISTA** sin backend:

```typescript
devLogin('RECEPCIONISTA');
```

Esto crea un usuario falso:
```json
{
  "id": 999,
  "nombre": "Usuario Dev",
  "correo": "dev@healix.com",
  "rol": "RECEPCIONISTA",
  "verificado": true
}
```

---

## 📝 ENDPOINTS QUE DEBEN CREARSE EN BACKEND

### 🔴 Prioridad Alta

1. **Citas del día**
```java
get("/api/citas/hoy", (req, res) -> {
  LocalDate hoy = LocalDate.now();
  List<Cita> citasHoy = citaDAO.buscarPorFecha(hoy);
  return gson.toJson(citasHoy);
});
```

2. **Marcar llegada de paciente**
```java
put("/api/citas/:id/marcar-llegada", (req, res) -> {
  int id = Integer.parseInt(req.params(":id"));
  Cita cita = citaDAO.buscarPorId(id);
  cita.setEstado("CONFIRMADA");
  citaDAO.actualizar(cita);
  return gson.toJson(cita);
});
```

3. **Buscar paciente por nombre**
```java
get("/api/pacientes/buscar", (req, res) -> {
  String nombre = req.queryParams("nombre");
  String documento = req.queryParams("documento");
  
  if (nombre != null) {
    return gson.toJson(pacienteDAO.buscarPorNombre(nombre));
  }
  if (documento != null) {
    return gson.toJson(pacienteDAO.buscarPorDocumento(documento));
  }
  
  res.status(400);
  return "Debe enviar 'nombre' o 'documento'";
});
```

4. **Obtener y actualizar perfil de usuario**
```java
get("/api/usuarios/:id", (req, res) -> {
  int id = Integer.parseInt(req.params(":id"));
  Usuario usuario = usuarioDAO.buscarPorId(id);
  return gson.toJson(usuario);
});

put("/api/usuarios/:id", (req, res) -> {
  int id = Integer.parseInt(req.params(":id"));
  Usuario datosActualizados = gson.fromJson(req.body(), Usuario.class);
  Usuario actualizado = usuarioDAO.actualizar(id, datosActualizados);
  return gson.toJson(actualizado);
});
```

### 🟡 Prioridad Media

5. **Notificaciones no leídas**
```java
get("/api/notificaciones/:usuarioId/no-leidas", (req, res) -> {
  int usuarioId = Integer.parseInt(req.params(":usuarioId"));
  List<Notificacion> noLeidas = notificacionDAO.buscarNoLeidas(usuarioId);
  return gson.toJson(noLeidas);
});
```

6. **Citas próximas**
```java
get("/api/citas/proximas", (req, res) -> {
  int dias = Integer.parseInt(req.queryParams("dias"));
  LocalDate inicio = LocalDate.now();
  LocalDate fin = inicio.plusDays(dias);
  List<Cita> proximas = citaDAO.buscarEnRango(inicio, fin);
  return gson.toJson(proximas);
});
```

---

## ✅ RESUMEN FINAL

### ✅ Funcionando correctamente:
- Login/Registro con JWT
- CRUD completo de Pacientes, Citas, Profesionales
- Sistema de notificaciones
- Estadísticas generales y por médico
- Modo desarrollo para todos los roles (incluido RECEPCIONISTA)

### ⚠️ Con soluciones temporales (funcionan pero lentas):
- Búsqueda de pacientes por nombre/documento
- Citas del día
- Marcar llegada de paciente
- Filtro de notificaciones no leídas

### ❌ No funcionan (requieren backend):
- Perfil de usuario (GET/PUT `/api/usuarios/:id`)

---

## 🔗 Archivos clave modificados:

1. `src/lib/api.ts` - Cliente API principal
2. `src/lib/notifications.ts` - Manejo de notificaciones
3. `src/services/recepcionista.service.ts` - Lógica específica del rol
4. `src/contexts/AuthContext.tsx` - Autenticación
5. `src/pages/Login.tsx` - Modo desarrollo
6. `src/pages/recepcionista/*` - Dashboards y vistas

---

## 📞 Próximos Pasos

1. ✅ **Implementar endpoints faltantes en backend** (ver sección Prioridad Alta)
2. Eliminar soluciones temporales y usar endpoints reales
3. Agregar validación de permisos por rol en backend
4. Implementar logs de auditoría
5. Configurar CORS correctamente en producción

---

**Contacto Técnico:** Lovable AI Assistant  
**Documentación Backend:** Ver `ANÁLISIS DE ENDPOINTS - HEALIX PRO`
