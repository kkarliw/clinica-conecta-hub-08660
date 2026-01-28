# 📋 INTEGRACIÓN BACKEND-FRONTEND: ROL CUIDADOR
## Healix Pro - Sistema de Gestión Médica

**Fecha:** $(date)  
**Backend:** Java (Spark Framework) - Puerto 4567  
**Frontend:** React + TypeScript + Vite  
**Rol:** CUIDADOR

---

## 📌 RESUMEN EJECUTIVO

Este documento detalla todos los endpoints backend que deben implementarse para soportar completamente el módulo CUIDADOR en Healix Pro, incluyendo:

- Relación cuidador-paciente con permisos granulares
- Agendamiento de citas en nombre del paciente
- Sistema de acompañamiento con personal de apoyo
- Reportes diarios de seguimiento
- Autorizaciones y permisos legales
- Notificaciones y recordatorios automáticos

---

## 🔐 AUTENTICACIÓN Y SEGURIDAD

### JWT Token
Todas las rutas bajo `/api/*` requieren autenticación JWT:

```java
before("/api/*", (req, res) -> {
    String authHeader = req.headers("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        halt(401, gson.toJson(Map.of("error", "Token no proporcionado")));
    }
    
    String token = authHeader.substring(7);
    try {
        Claims claims = Jwts.parser()
            .setSigningKey(SECRET_KEY)
            .parseClaimsJws(token)
            .getBody();
        
        req.attribute("userId", claims.get("userId"));
        req.attribute("userRole", claims.get("rol"));
    } catch (Exception e) {
        halt(401, gson.toJson(Map.of("error", "Token inválido o expirado")));
    }
});
```

### Validación de Permisos
Cada operación debe validar:
1. Usuario autenticado con token válido
2. Rol CUIDADOR o ADMIN
3. Permisos específicos del cuidador sobre el paciente
4. Relación activa cuidador-paciente

---

## 📊 MODELOS DE DATOS

### 1. CuidadorPaciente (Tabla de Relación)

```java
public class CuidadorPaciente {
    private int id;
    private int cuidadorId;
    private int pacienteId;
    private TipoPaciente tipoPaciente;
    private Parentesco parentesco;
    private String documentoAutorizacionUrl;
    private Permisos permisos;
    private LocalDateTime fechaVinculacion;
    
    // Enums
    public enum TipoPaciente {
        MENOR, ADULTO_MAYOR, PERSONA_DISCAPACIDAD, RECUPERACION
    }
    
    public enum Parentesco {
        PADRE, MADRE, TUTOR, HIJO, FAMILIAR, 
        ENFERMERA, AUXILIAR, CONTRATADO
    }
    
    public static class Permisos {
        private boolean puedeAgendar;
        private boolean puedeCancelar;
        private boolean puedeAccederHistoria;
        private boolean puedeSubirExamenes;
    }
}
```

**SQL para crear tabla:**
```sql
CREATE TABLE cuidador_paciente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cuidador_id INT NOT NULL,
    paciente_id INT NOT NULL,
    tipo_paciente VARCHAR(50) NOT NULL,
    parentesco VARCHAR(50) NOT NULL,
    documento_autorizacion_url VARCHAR(500),
    puede_agendar BOOLEAN DEFAULT TRUE,
    puede_cancelar BOOLEAN DEFAULT TRUE,
    puede_acceder_historia BOOLEAN DEFAULT FALSE,
    puede_subir_examenes BOOLEAN DEFAULT FALSE,
    fecha_vinculacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (cuidador_id) REFERENCES usuarios(id),
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    UNIQUE KEY unique_cuidador_paciente (cuidador_id, paciente_id)
);
```

### 2. Acompañamiento

```java
public class Acompanamiento {
    private int id;
    private int citaId;
    private int cuidadorId;
    private Integer personalApoyoId; // nullable
    private TipoPersonal tipoPersonal;
    private boolean necesitaTransporte;
    private String detallesTransporte;
    private LocalDateTime horaSalida;
    private String lugarRecogida;
    private EstadoAcompanamiento estado;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    
    public enum TipoPersonal {
        ENFERMERA, FISIOTERAPEUTA, AUXILIAR
    }
    
    public enum EstadoAcompanamiento {
        PENDIENTE, CONFIRMADO, NO_DISPONIBLE, 
        EN_RUTA, LLEGADO, FINALIZADO
    }
}
```

**SQL para crear tabla:**
```sql
CREATE TABLE acompanamiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cita_id INT NOT NULL,
    cuidador_id INT NOT NULL,
    personal_apoyo_id INT,
    tipo_personal VARCHAR(50) NOT NULL,
    necesita_transporte BOOLEAN DEFAULT FALSE,
    detalles_transporte VARCHAR(500),
    hora_salida TIMESTAMP,
    lugar_recogida VARCHAR(500),
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cita_id) REFERENCES citas(id),
    FOREIGN KEY (cuidador_id) REFERENCES usuarios(id),
    FOREIGN KEY (personal_apoyo_id) REFERENCES usuarios(id)
);
```

### 3. ReporteDiario

```java
public class ReporteDiario {
    private int id;
    private int pacienteId;
    private int cuidadorId;
    private LocalDate fecha;
    private String resumenDia;
    private boolean medicamentosTomados;
    private SignosVitales signosVitales;
    private EstadoEmocional estadoEmocional;
    private String observaciones;
    
    public static class SignosVitales {
        private String presionArterial;
        private Integer frecuenciaCardiaca;
        private Double temperatura;
        private Integer saturacionOxigeno;
    }
    
    public enum EstadoEmocional {
        EXCELENTE, BIEN, REGULAR, MAL, CRITICO
    }
}
```

**SQL para crear tabla:**
```sql
CREATE TABLE reporte_diario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    cuidador_id INT NOT NULL,
    fecha DATE NOT NULL,
    resumen_dia TEXT,
    medicamentos_tomados BOOLEAN DEFAULT FALSE,
    presion_arterial VARCHAR(20),
    frecuencia_cardiaca INT,
    temperatura DECIMAL(4,2),
    saturacion_oxigeno INT,
    estado_emocional VARCHAR(50),
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY (cuidador_id) REFERENCES usuarios(id),
    UNIQUE KEY unique_reporte_diario (paciente_id, fecha)
);
```

### 4. Autorizacion

```java
public class Autorizacion {
    private int id;
    private int pacienteId;
    private int cuidadorId;
    private String quien; // Nombre de quien autoriza
    private String tipoPermiso;
    private String documentoUrl;
    private boolean firmado;
    private LocalDateTime fechaCreacion;
}
```

**SQL para crear tabla:**
```sql
CREATE TABLE autorizacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    cuidador_id INT NOT NULL,
    quien VARCHAR(200) NOT NULL,
    tipo_permiso VARCHAR(200) NOT NULL,
    documento_url VARCHAR(500),
    firmado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY (cuidador_id) REFERENCES usuarios(id)
);
```

---

## 🔌 ENDPOINTS A IMPLEMENTAR

### 1. RELACIÓN CUIDADOR-PACIENTE

#### GET `/api/cuidadores/:id/pacientes`
**Descripción:** Obtener lista de pacientes asignados a un cuidador con sus permisos

**Autenticación:** ✅ JWT  
**Rol requerido:** CUIDADOR o ADMIN

**Respuesta:**
```json
[
  {
    "id": 1,
    "cuidadorId": 5,
    "pacienteId": 10,
    "pacienteNombre": "Juan Pérez",
    "pacienteEdad": 75,
    "tipoPaciente": "ADULTO_MAYOR",
    "parentesco": "HIJO",
    "documentoAutorizacionUrl": "https://storage.healix.com/auth/doc123.pdf",
    "permisos": {
      "puedeAgendar": true,
      "puedeCancelar": true,
      "puedeAccederHistoria": false,
      "puedeSubirExamenes": false
    },
    "fechaVinculacion": "2025-01-15T10:00:00"
  }
]
```

**Implementación Java:**
```java
get("/api/cuidadores/:id/pacientes", (req, res) -> {
    int cuidadorId = Integer.parseInt(req.params(":id"));
    
    // Validar que el usuario autenticado sea el cuidador o admin
    int userId = req.attribute("userId");
    String userRole = req.attribute("userRole");
    
    if (userId != cuidadorId && !"ADMIN".equals(userRole)) {
        res.status(403);
        return gson.toJson(Map.of("error", "No autorizado"));
    }
    
    List<CuidadorPaciente> relaciones = cuidadorPacienteDAO.getPorCuidador(cuidadorId);
    
    // Enriquecer con datos del paciente
    List<Map<String, Object>> resultado = relaciones.stream()
        .map(rel -> {
            Paciente paciente = pacienteDAO.buscarPorId(rel.getPacienteId());
            Map<String, Object> item = new HashMap<>();
            item.put("id", rel.getId());
            item.put("cuidadorId", rel.getCuidadorId());
            item.put("pacienteId", rel.getPacienteId());
            item.put("pacienteNombre", paciente.getNombre());
            item.put("pacienteEdad", calcularEdad(paciente.getFechaNacimiento()));
            item.put("tipoPaciente", rel.getTipoPaciente());
            item.put("parentesco", rel.getParentesco());
            item.put("documentoAutorizacionUrl", rel.getDocumentoAutorizacionUrl());
            item.put("permisos", rel.getPermisos());
            item.put("fechaVinculacion", rel.getFechaVinculacion());
            return item;
        })
        .collect(Collectors.toList());
    
    res.type("application/json");
    return gson.toJson(resultado);
});
```

---

#### POST `/api/cuidadores/:id/pacientes`
**Descripción:** Vincular un paciente a un cuidador

**Autenticación:** ✅ JWT  
**Rol requerido:** CUIDADOR o ADMIN

**Body:**
```json
{
  "pacienteId": 10,
  "tipoPaciente": "ADULTO_MAYOR",
  "parentesco": "HIJO",
  "documentoAutorizacionUrl": "https://storage.healix.com/auth/doc123.pdf",
  "permisos": {
    "puedeAgendar": true,
    "puedeCancelar": true,
    "puedeAccederHistoria": false,
    "puedeSubirExamenes": false
  }
}
```

**Respuesta:**
```json
{
  "id": 1,
  "cuidadorId": 5,
  "pacienteId": 10,
  "tipoPaciente": "ADULTO_MAYOR",
  "parentesco": "HIJO",
  "documentoAutorizacionUrl": "https://storage.healix.com/auth/doc123.pdf",
  "permisos": {
    "puedeAgendar": true,
    "puedeCancelar": true,
    "puedeAccederHistoria": false,
    "puedeSubirExamenes": false
  },
  "fechaVinculacion": "2025-11-09T14:30:00"
}
```

**Implementación Java:**
```java
post("/api/cuidadores/:id/pacientes", (req, res) -> {
    int cuidadorId = Integer.parseInt(req.params(":id"));
    
    // Validar autenticación
    int userId = req.attribute("userId");
    String userRole = req.attribute("userRole");
    
    if (userId != cuidadorId && !"ADMIN".equals(userRole)) {
        res.status(403);
        return gson.toJson(Map.of("error", "No autorizado"));
    }
    
    // Parsear body
    CuidadorPaciente vinculo = gson.fromJson(req.body(), CuidadorPaciente.class);
    vinculo.setCuidadorId(cuidadorId);
    vinculo.setFechaVinculacion(LocalDateTime.now());
    
    // Validar que el paciente existe
    Paciente paciente = pacienteDAO.buscarPorId(vinculo.getPacienteId());
    if (paciente == null) {
        res.status(404);
        return gson.toJson(Map.of("error", "Paciente no encontrado"));
    }
    
    // Validar que no exista vinculo duplicado
    if (cuidadorPacienteDAO.existeVinculo(cuidadorId, vinculo.getPacienteId())) {
        res.status(409);
        return gson.toJson(Map.of("error", "Ya existe vínculo con este paciente"));
    }
    
    // Crear vínculo
    CuidadorPaciente creado = cuidadorPacienteDAO.crear(vinculo);
    
    // Crear notificación al paciente
    Notificacion notif = new Notificacion();
    notif.setTitulo("Nuevo cuidador asignado");
    notif.setMensaje("Un cuidador ha sido vinculado a tu cuenta");
    notif.setDestinatario(vinculo.getPacienteId());
    notif.setTipo("SISTEMA");
    notificacionDAO.crear(notif);
    
    res.status(201);
    res.type("application/json");
    return gson.toJson(creado);
});
```

---

#### DELETE `/api/cuidadores/:id/pacientes/:pacienteRelId`
**Descripción:** Desvincular un paciente de un cuidador

**Autenticación:** ✅ JWT  
**Rol requerido:** CUIDADOR o ADMIN

**Respuesta:** `204 No Content`

**Implementación Java:**
```java
delete("/api/cuidadores/:id/pacientes/:pacienteRelId", (req, res) -> {
    int cuidadorId = Integer.parseInt(req.params(":id"));
    int relacionId = Integer.parseInt(req.params(":pacienteRelId"));
    
    // Validar autenticación
    int userId = req.attribute("userId");
    String userRole = req.attribute("userRole");
    
    if (userId != cuidadorId && !"ADMIN".equals(userRole)) {
        res.status(403);
        return gson.toJson(Map.of("error", "No autorizado"));
    }
    
    // Validar que la relación existe y pertenece al cuidador
    CuidadorPaciente relacion = cuidadorPacienteDAO.buscarPorId(relacionId);
    if (relacion == null || relacion.getCuidadorId() != cuidadorId) {
        res.status(404);
        return gson.toJson(Map.of("error", "Relación no encontrada"));
    }
    
    // Eliminar vínculo
    cuidadorPacienteDAO.eliminar(relacionId);
    
    res.status(204);
    return "";
});
```

---

### 2. AGENDAMIENTO DE CITAS

#### POST `/api/citas` (Extendido para cuidadores)
**Descripción:** Crear cita médica - ahora soporta `solicitadoPorCuidadorId`

**Autenticación:** ✅ JWT  
**Rol requerido:** PACIENTE, CUIDADOR, RECEPCIONISTA o ADMIN

**Body:**
```json
{
  "pacienteId": 10,
  "profesionalId": 3,
  "especialidad": "Geriatría",
  "fechaHora": "2025-11-20T15:00:00",
  "motivo": "Control mensual",
  "solicitadoPorCuidadorId": 5
}
```

**Validaciones adicionales:**
1. Si `solicitadoPorCuidadorId` está presente:
   - Verificar que existe relación activa cuidador-paciente
   - Verificar permiso `puedeAgendar = true`
   - Validar que el cuidador autenticado coincide con `solicitadoPorCuidadorId`

**Implementación Java (fragmento):**
```java
post("/api/citas", (req, res) -> {
    Cita cita = gson.fromJson(req.body(), Cita.class);
    int userId = req.attribute("userId");
    String userRole = req.attribute("userRole");
    
    // Si es solicitada por cuidador
    if (cita.getSolicitadoPorCuidadorId() != null) {
        int cuidadorId = cita.getSolicitadoPorCuidadorId();
        
        // Validar que el usuario autenticado es el cuidador
        if (userId != cuidadorId && !"ADMIN".equals(userRole)) {
            res.status(403);
            return gson.toJson(Map.of("error", "No autorizado para agendar en nombre de este cuidador"));
        }
        
        // Verificar relación y permisos
        CuidadorPaciente relacion = cuidadorPacienteDAO.buscarPorCuidadorYPaciente(
            cuidadorId, cita.getPacienteId()
        );
        
        if (relacion == null) {
            res.status(403);
            return gson.toJson(Map.of("error", "No existe relación con este paciente"));
        }
        
        if (!relacion.getPermisos().isPuedeAgendar()) {
            res.status(403);
            return gson.toJson(Map.of("error", "No tienes permiso para agendar citas"));
        }
    }
    
    // Continuar con creación normal de cita...
    Cita creada = citaDAO.crear(cita);
    
    // Notificar al paciente
    Notificacion notif = new Notificacion();
    notif.setTitulo("Nueva cita agendada");
    notif.setMensaje("Tu cuidador ha agendado una cita para el " + cita.getFechaHora());
    notif.setDestinatario(cita.getPacienteId());
    notif.setTipo("CITA");
    notif.setCitaId(creada.getId());
    notificacionDAO.crear(notif);
    
    res.status(201);
    return gson.toJson(creada);
});
```

---

#### GET `/api/profesionales/:id/disponibilidad?fecha=YYYY-MM-DD`
**Descripción:** Obtener horarios disponibles de un profesional

**Autenticación:** ✅ JWT  
**Rol requerido:** Cualquiera autenticado

**Query Params:**
- `fecha` (requerido): Fecha en formato ISO (YYYY-MM-DD)

**Respuesta:**
```json
{
  "profesionalId": 3,
  "profesionalNombre": "Dr. García",
  "especialidad": "Geriatría",
  "fecha": "2025-11-20",
  "horariosDisponibles": [
    "09:00",
    "09:30",
    "10:00",
    "14:00",
    "14:30",
    "15:00"
  ],
  "horariosOcupados": [
    "10:30",
    "11:00",
    "15:30"
  ]
}
```

**Implementación Java:**
```java
get("/api/profesionales/:id/disponibilidad", (req, res) -> {
    int profesionalId = Integer.parseInt(req.params(":id"));
    String fechaStr = req.queryParams("fecha");
    
    if (fechaStr == null) {
        res.status(400);
        return gson.toJson(Map.of("error", "Parámetro 'fecha' requerido"));
    }
    
    LocalDate fecha = LocalDate.parse(fechaStr);
    
    // Obtener profesional
    ProfesionalSalud profesional = profesionalDAO.buscarPorId(profesionalId);
    if (profesional == null) {
        res.status(404);
        return gson.toJson(Map.of("error", "Profesional no encontrado"));
    }
    
    // Obtener citas del día
    List<Cita> citasDelDia = citaDAO.buscarPorProfesionalYFecha(profesionalId, fecha);
    
    // Generar horarios disponibles (ejemplo: 9:00 a 17:00, intervalos de 30 min)
    List<String> todosHorarios = generarHorarios(LocalTime.of(9, 0), LocalTime.of(17, 0), 30);
    
    // Marcar ocupados
    Set<String> ocupados = citasDelDia.stream()
        .map(c -> c.getFechaHora().toLocalTime().toString().substring(0, 5))
        .collect(Collectors.toSet());
    
    List<String> disponibles = todosHorarios.stream()
        .filter(h -> !ocupados.contains(h))
        .collect(Collectors.toList());
    
    Map<String, Object> resultado = new HashMap<>();
    resultado.put("profesionalId", profesionalId);
    resultado.put("profesionalNombre", profesional.getNombre());
    resultado.put("especialidad", profesional.getEspecialidad());
    resultado.put("fecha", fechaStr);
    resultado.put("horariosDisponibles", disponibles);
    resultado.put("horariosOcupados", new ArrayList<>(ocupados));
    
    res.type("application/json");
    return gson.toJson(resultado);
});

// Método auxiliar
private List<String> generarHorarios(LocalTime inicio, LocalTime fin, int intervaloMinutos) {
    List<String> horarios = new ArrayList<>();
    LocalTime actual = inicio;
    while (actual.isBefore(fin) || actual.equals(fin)) {
        horarios.add(actual.toString().substring(0, 5)); // HH:mm
        actual = actual.plusMinutes(intervaloMinutos);
    }
    return horarios;
}
```

---

### 3. ACOMPAÑAMIENTO Y PERSONAL DE APOYO

#### POST `/api/citas/:id/solicitar-acompanamiento`
**Descripción:** Solicitar personal de apoyo para acompañar a un paciente

**Autenticación:** ✅ JWT  
**Rol requerido:** CUIDADOR o ADMIN

**Body:**
```json
{
  "solicitanteCuidadorId": 5,
  "tipoPersonal": "ENFERMERA",
  "horaSalida": "2025-11-20T13:00:00",
  "lugarRecogida": "Calle 123, Apt 4, Bogotá",
  "transporte": "Necesita transporte adaptado con silla de ruedas"
}
```

**Respuesta:**
```json
{
  "id": 1,
  "citaId": 42,
  "cuidadorId": 5,
  "personalApoyoId": null,
  "tipoPersonal": "ENFERMERA",
  "transporte": "Necesita transporte adaptado con silla de ruedas",
  "horaSalida": "2025-11-20T13:00:00",
  "lugarRecogida": "Calle 123, Apt 4, Bogotá",
  "estado": "PENDIENTE",
  "fechaCreacion": "2025-11-09T14:45:00"
}
```

**Implementación Java:**
```java
post("/api/citas/:id/solicitar-acompanamiento", (req, res) -> {
    int citaId = Integer.parseInt(req.params(":id"));
    
    // Validar que la cita existe
    Cita cita = citaDAO.buscarPorId(citaId);
    if (cita == null) {
        res.status(404);
        return gson.toJson(Map.of("error", "Cita no encontrada"));
    }
    
    // Parsear solicitud
    Acompanamiento acomp = gson.fromJson(req.body(), Acompanamiento.class);
    acomp.setCitaId(citaId);
    acomp.setEstado(EstadoAcompanamiento.PENDIENTE);
    acomp.setFechaCreacion(LocalDateTime.now());
    
    // Validar que el cuidador tiene relación con el paciente
    int cuidadorId = acomp.getCuidadorId();
    CuidadorPaciente relacion = cuidadorPacienteDAO.buscarPorCuidadorYPaciente(
        cuidadorId, cita.getPacienteId()
    );
    
    if (relacion == null) {
        res.status(403);
        return gson.toJson(Map.of("error", "No tienes relación con este paciente"));
    }
    
    // Crear solicitud
    Acompanamiento creado = acompanamientoDAO.crear(acomp);
    
    // Notificar al personal de apoyo disponible (simulado - en producción buscar enfermeras disponibles)
    Notificacion notif = new Notificacion();
    notif.setTitulo("Solicitud de acompañamiento");
    notif.setMensaje("Nueva solicitud para " + acomp.getTipoPersonal() + " el " + cita.getFecha());
    notif.setTipo("ACOMPANAMIENTO_CONFIRMADO");
    // notif.setDestinatario(buscarPersonalDisponible(acomp.getTipoPersonal()));
    // notificacionDAO.crear(notif);
    
    res.status(201);
    return gson.toJson(creado);
});
```

---

#### GET `/api/citas/:id/acompaniamientos`
**Descripción:** Obtener solicitudes de acompañamiento de una cita

**Autenticación:** ✅ JWT  
**Rol requerido:** CUIDADOR, MEDICO, PACIENTE o ADMIN

**Respuesta:**
```json
[
  {
    "id": 1,
    "citaId": 42,
    "cuidadorId": 5,
    "personalApoyoId": 8,
    "personalNombre": "Enf. María López",
    "tipoPersonal": "ENFERMERA",
    "transporte": "Necesita transporte adaptado",
    "horaSalida": "2025-11-20T13:00:00",
    "lugarRecogida": "Calle 123, Apt 4",
    "estado": "CONFIRMADO",
    "cita": {
      "id": 42,
      "fecha": "2025-11-20T15:00:00",
      "motivo": "Control geriátrico"
    }
  }
]
```

**Implementación Java:**
```java
get("/api/citas/:id/acompaniamientos", (req, res) -> {
    int citaId = Integer.parseInt(req.params(":id"));
    
    // Validar que la cita existe
    Cita cita = citaDAO.buscarPorId(citaId);
    if (cita == null) {
        res.status(404);
        return gson.toJson(Map.of("error", "Cita no encontrada"));
    }
    
    // Obtener acompañamientos
    List<Acompanamiento> acomps = acompanamientoDAO.buscarPorCita(citaId);
    
    // Enriquecer con datos relacionados
    List<Map<String, Object>> resultado = acomps.stream()
        .map(a -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", a.getId());
            item.put("citaId", a.getCitaId());
            item.put("cuidadorId", a.getCuidadorId());
            item.put("personalApoyoId", a.getPersonalApoyoId());
            
            if (a.getPersonalApoyoId() != null) {
                Usuario personal = usuarioDAO.buscarPorId(a.getPersonalApoyoId());
                item.put("personalNombre", personal.getNombre());
            }
            
            item.put("tipoPersonal", a.getTipoPersonal());
            item.put("transporte", a.getDetallesTransporte());
            item.put("horaSalida", a.getHoraSalida());
            item.put("lugarRecogida", a.getLugarRecogida());
            item.put("estado", a.getEstado());
            
            Map<String, Object> citaSimple = new HashMap<>();
            citaSimple.put("id", cita.getId());
            citaSimple.put("fecha", cita.getFechaHora());
            citaSimple.put("motivo", cita.getMotivo());
            item.put("cita", citaSimple);
            
            return item;
        })
        .collect(Collectors.toList());
    
    res.type("application/json");
    return gson.toJson(resultado);
});
```

---

#### PUT `/api/citas/:id/acompaniamientos/:acomId/estado`
**Descripción:** Actualizar estado de acompañamiento

**Autenticación:** ✅ JWT  
**Rol requerido:** CUIDADOR, Personal de Apoyo o ADMIN

**Body:**
```json
{
  "estado": "CONFIRMADO"
}
```

**Estados permitidos:**
- `PENDIENTE` → `CONFIRMADO` (por personal de apoyo)
- `PENDIENTE` → `NO_DISPONIBLE` (por personal de apoyo)
- `CONFIRMADO` → `EN_RUTA` (por personal de apoyo)
- `EN_RUTA` → `LLEGADO` (por personal de apoyo o cuidador)
- `LLEGADO` → `FINALIZADO` (por personal de apoyo o cuidador)

**Respuesta:** Objeto `Acompanamiento` actualizado

**Implementación Java:**
```java
put("/api/citas/:id/acompaniamientos/:acomId/estado", (req, res) -> {
    int citaId = Integer.parseInt(req.params(":id"));
    int acomId = Integer.parseInt(req.params(":acomId"));
    
    // Parsear nuevo estado
    Map<String, String> body = gson.fromJson(req.body(), Map.class);
    String nuevoEstado = body.get("estado");
    
    if (nuevoEstado == null) {
        res.status(400);
        return gson.toJson(Map.of("error", "Estado requerido"));
    }
    
    // Buscar acompañamiento
    Acompanamiento acomp = acompanamientoDAO.buscarPorId(acomId);
    if (acomp == null || acomp.getCitaId() != citaId) {
        res.status(404);
        return gson.toJson(Map.of("error", "Acompañamiento no encontrado"));
    }
    
    // Validar transición de estado
    if (!esTransicionValida(acomp.getEstado(), nuevoEstado)) {
        res.status(400);
        return gson.toJson(Map.of("error", "Transición de estado inválida"));
    }
    
    // Actualizar
    acomp.setEstado(EstadoAcompanamiento.valueOf(nuevoEstado));
    acomp.setFechaActualizacion(LocalDateTime.now());
    Acompanamiento actualizado = acompanamientoDAO.actualizar(acomp);
    
    // Notificar cambio de estado
    if ("CONFIRMADO".equals(nuevoEstado)) {
        Notificacion notif = new Notificacion();
        notif.setTitulo("Acompañamiento confirmado");
        notif.setMensaje("Tu solicitud de acompañamiento ha sido confirmada");
        notif.setDestinatario(acomp.getCuidadorId());
        notif.setTipo("ACOMPANAMIENTO_CONFIRMADO");
        notificacionDAO.crear(notif);
    }
    
    res.type("application/json");
    return gson.toJson(actualizado);
});

// Método auxiliar
private boolean esTransicionValida(EstadoAcompanamiento actual, String nuevo) {
    switch (actual) {
        case PENDIENTE:
            return "CONFIRMADO".equals(nuevo) || "NO_DISPONIBLE".equals(nuevo);
        case CONFIRMADO:
            return "EN_RUTA".equals(nuevo);
        case EN_RUTA:
            return "LLEGADO".equals(nuevo);
        case LLEGADO:
            return "FINALIZADO".equals(nuevo);
        default:
            return false;
    }
}
```

---

#### PUT `/api/acompaniamientos/:id/llegada`
**Descripción:** Marcar llegada rápida (atajo para cambiar estado a LLEGADO)

**Autenticación:** ✅ JWT  
**Rol requerido:** CUIDADOR o Personal de Apoyo

**Respuesta:** Objeto `Acompanamiento` actualizado con estado `LLEGADO`

**Implementación Java:**
```java
put("/api/acompaniamientos/:id/llegada", (req, res) -> {
    int acomId = Integer.parseInt(req.params(":id"));
    
    Acompanamiento acomp = acompanamientoDAO.buscarPorId(acomId);
    if (acomp == null) {
        res.status(404);
        return gson.toJson(Map.of("error", "Acompañamiento no encontrado"));
    }
    
    if (acomp.getEstado() != EstadoAcompanamiento.EN_RUTA) {
        res.status(400);
        return gson.toJson(Map.of("error", "Solo se puede marcar llegada si está EN_RUTA"));
    }
    
    acomp.setEstado(EstadoAcompanamiento.LLEGADO);
    acomp.setFechaActualizacion(LocalDateTime.now());
    Acompanamiento actualizado = acompanamientoDAO.actualizar(acomp);
    
    // Notificar al cuidador y al médico
    Cita cita = citaDAO.buscarPorId(acomp.getCitaId());
    
    Notificacion notifCuidador = new Notificacion();
    notifCuidador.setTitulo("Llegada confirmada");
    notifCuidador.setMensaje("El paciente ha llegado a la clínica");
    notifCuidador.setDestinatario(acomp.getCuidadorId());
    notifCuidador.setTipo("PACIENTE_LLEGO");
    notificacionDAO.crear(notifCuidador);
    
    Notificacion notifMedico = new Notificacion();
    notifMedico.setTitulo("Paciente ha llegado");
    notifMedico.setMensaje("El paciente de la cita de " + cita.getFechaHora() + " ha llegado");
    notifMedico.setDestinatario(cita.getProfesionalId());
    notifMedico.setTipo("PACIENTE_LLEGO");
    notificacionDAO.crear(notifMedico);
    
    res.type("application/json");
    return gson.toJson(actualizado);
});
```

---

#### PUT `/api/acompaniamientos/:id/finalizar`
**Descripción:** Finalizar acompañamiento (atajo para cambiar estado a FINALIZADO)

**Autenticación:** ✅ JWT  
**Rol requerido:** CUIDADOR o Personal de Apoyo

**Respuesta:** Objeto `Acompanamiento` actualizado con estado `FINALIZADO`

**Implementación:** Similar a `/llegada` pero validando estado `LLEGADO` → `FINALIZADO`

---

### 4. REPORTES DIARIOS

#### POST `/api/pacientes/:id/reportes`
**Descripción:** Registrar reporte diario de un paciente

**Autenticación:** ✅ JWT  
**Rol requerido:** CUIDADOR o ADMIN

**Body:**
```json
{
  "cuidadorId": 5,
  "fecha": "2025-11-09",
  "resumenDia": "Día tranquilo, paciente de buen ánimo",
  "medicamentosTomados": true,
  "signosVitales": {
    "presionArterial": "120/80",
    "frecuenciaCardiaca": 72,
    "temperatura": 36.5,
    "saturacionOxigeno": 98
  },
  "estadoEmocional": "BIEN",
  "observaciones": "Durmió bien toda la noche, apetito normal"
}
```

**Respuesta:**
```json
{
  "id": 1,
  "pacienteId": 10,
  "cuidadorId": 5,
  "fecha": "2025-11-09",
  "resumenDia": "Día tranquilo, paciente de buen ánimo",
  "medicamentosTomados": true,
  "signosVitales": {
    "presionArterial": "120/80",
    "frecuenciaCardiaca": 72,
    "temperatura": 36.5,
    "saturacionOxigeno": 98
  },
  "estadoEmocional": "BIEN",
  "observaciones": "Durmió bien toda la noche, apetito normal",
  "fechaRegistro": "2025-11-09T22:30:00"
}
```

**Implementación Java:**
```java
post("/api/pacientes/:id/reportes", (req, res) -> {
    int pacienteId = Integer.parseInt(req.params(":id"));
    
    // Parsear reporte
    ReporteDiario reporte = gson.fromJson(req.body(), ReporteDiario.class);
    reporte.setPacienteId(pacienteId);
    
    // Validar que el cuidador tiene relación con el paciente
    CuidadorPaciente relacion = cuidadorPacienteDAO.buscarPorCuidadorYPaciente(
        reporte.getCuidadorId(), pacienteId
    );
    
    if (relacion == null) {
        res.status(403);
        return gson.toJson(Map.of("error", "No tienes relación con este paciente"));
    }
    
    // Validar que no exista reporte para esta fecha
    if (reporteDiarioDAO.existeReporte(pacienteId, reporte.getFecha())) {
        res.status(409);
        return gson.toJson(Map.of("error", "Ya existe un reporte para esta fecha"));
    }
    
    // Crear reporte
    ReporteDiario creado = reporteDiarioDAO.crear(reporte);
    
    // Notificar al médico si hay alertas
    if ("CRITICO".equals(reporte.getEstadoEmocional()) || !reporte.isMedicamentosTomados()) {
        // Buscar médico del paciente (última cita o médico asignado)
        List<Cita> citas = citaDAO.buscarPorPaciente(pacienteId);
        if (!citas.isEmpty()) {
            int medicoId = citas.get(0).getProfesionalId();
            
            Notificacion notif = new Notificacion();
            notif.setTitulo("Alerta de paciente");
            notif.setMensaje("Revisar reporte diario de paciente con estado " + reporte.getEstadoEmocional());
            notif.setDestinatario(medicoId);
            notif.setTipo("SISTEMA");
            notificacionDAO.crear(notif);
        }
    }
    
    res.status(201);
    return gson.toJson(creado);
});
```

---

#### GET `/api/pacientes/:id/reportes`
**Descripción:** Obtener historial de reportes diarios de un paciente

**Autenticación:** ✅ JWT  
**Rol requerido:** CUIDADOR, MEDICO o ADMIN

**Query Params (opcionales):**
- `desde`: Fecha inicio (YYYY-MM-DD)
- `hasta`: Fecha fin (YYYY-MM-DD)
- `limit`: Número máximo de resultados (default: 30)

**Respuesta:**
```json
[
  {
    "id": 1,
    "pacienteId": 10,
    "pacienteNombre": "Juan Pérez",
    "cuidadorId": 5,
    "fecha": "2025-11-09",
    "resumenDia": "Día tranquilo, paciente de buen ánimo",
    "medicamentosTomados": true,
    "signosVitales": {
      "presionArterial": "120/80",
      "frecuenciaCardiaca": 72,
      "temperatura": 36.5,
      "saturacionOxigeno": 98
    },
    "estadoEmocional": "BIEN",
    "observaciones": "Durmió bien toda la noche",
    "fechaRegistro": "2025-11-09T22:30:00"
  }
]
```

**Implementación Java:**
```java
get("/api/pacientes/:id/reportes", (req, res) -> {
    int pacienteId = Integer.parseInt(req.params(":id"));
    
    // Validar acceso
    int userId = req.attribute("userId");
    String userRole = req.attribute("userRole");
    
    // Verificar permisos
    if (!"ADMIN".equals(userRole) && !"MEDICO".equals(userRole)) {
        // Si es cuidador, verificar relación
        CuidadorPaciente relacion = cuidadorPacienteDAO.buscarPorCuidadorYPaciente(userId, pacienteId);
        if (relacion == null) {
            res.status(403);
            return gson.toJson(Map.of("error", "No autorizado"));
        }
    }
    
    // Parsear filtros
    String desde = req.queryParams("desde");
    String hasta = req.queryParams("hasta");
    int limit = req.queryParams("limit") != null ? Integer.parseInt(req.queryParams("limit")) : 30;
    
    // Obtener reportes
    List<ReporteDiario> reportes = reporteDiarioDAO.buscarPorPaciente(
        pacienteId, 
        desde != null ? LocalDate.parse(desde) : null,
        hasta != null ? LocalDate.parse(hasta) : null,
        limit
    );
    
    // Enriquecer con nombre del paciente
    Paciente paciente = pacienteDAO.buscarPorId(pacienteId);
    List<Map<String, Object>> resultado = reportes.stream()
        .map(r -> {
            Map<String, Object> item = gson.fromJson(gson.toJson(r), Map.class);
            item.put("pacienteNombre", paciente.getNombre());
            return item;
        })
        .collect(Collectors.toList());
    
    res.type("application/json");
    return gson.toJson(resultado);
});
```

---

### 5. AUTORIZACIONES Y PERMISOS

#### GET `/api/pacientes/:id/autorizaciones`
**Descripción:** Obtener autorizaciones legales de un paciente

**Autenticación:** ✅ JWT  
**Rol requerido:** CUIDADOR, MEDICO o ADMIN

**Respuesta:**
```json
[
  {
    "id": 1,
    "pacienteId": 10,
    "cuidadorId": 5,
    "quien": "María Pérez (Hija)",
    "tipoPermiso": "Autorización para tratamientos médicos",
    "documentoUrl": "https://storage.healix.com/auth/autorizacion_123.pdf",
    "firmado": true,
    "fechaCreacion": "2025-01-15T10:00:00"
  }
]
```

**Implementación Java:**
```java
get("/api/pacientes/:id/autorizaciones", (req, res) -> {
    int pacienteId = Integer.parseInt(req.params(":id"));
    
    // Validar acceso similar a reportes
    int userId = req.attribute("userId");
    String userRole = req.attribute("userRole");
    
    if (!"ADMIN".equals(userRole) && !"MEDICO".equals(userRole)) {
        CuidadorPaciente relacion = cuidadorPacienteDAO.buscarPorCuidadorYPaciente(userId, pacienteId);
        if (relacion == null) {
            res.status(403);
            return gson.toJson(Map.of("error", "No autorizado"));
        }
    }
    
    List<Autorizacion> autorizaciones = autorizacionDAO.buscarPorPaciente(pacienteId);
    
    res.type("application/json");
    return gson.toJson(autorizaciones);
});
```

---

#### POST `/api/pacientes/:id/autorizaciones`
**Descripción:** Crear nueva autorización legal

**Autenticación:** ✅ JWT  
**Rol requerido:** CUIDADOR o ADMIN

**Body:**
```json
{
  "cuidadorId": 5,
  "quien": "María Pérez (Hija)",
  "tipoPermiso": "Autorización para tratamientos médicos de emergencia",
  "documentoUrl": "https://storage.healix.com/auth/autorizacion_456.pdf",
  "firmado": true
}
```

**Respuesta:** Objeto `Autorizacion` creado

**Implementación:** Similar a creación de reportes, validando relación cuidador-paciente

---

#### POST `/api/pacientes/:id/vincular-enfermera`
**Descripción:** Vincular enfermera fija a un paciente

**Autenticación:** ✅ JWT  
**Rol requerido:** CUIDADOR o ADMIN

**Body:**
```json
{
  "enfermeraId": 15,
  "rol": "ENFERMERA_FIJA"
}
```

**Respuesta:**
```json
{
  "pacienteId": 10,
  "enfermeraId": 15,
  "enfermera": {
    "id": 15,
    "nombre": "Enf. Ana Martínez",
    "telefono": "3001234567"
  },
  "rol": "ENFERMERA_FIJA",
  "fechaAsignacion": "2025-11-09T15:00:00"
}
```

**Implementación Java:**
```java
post("/api/pacientes/:id/vincular-enfermera", (req, res) -> {
    int pacienteId = Integer.parseInt(req.params(":id"));
    
    Map<String, Object> body = gson.fromJson(req.body(), Map.class);
    int enfermeraId = ((Double) body.get("enfermeraId")).intValue();
    String rol = (String) body.get("rol");
    
    // Validar que el cuidador tiene relación con el paciente
    int userId = req.attribute("userId");
    CuidadorPaciente relacion = cuidadorPacienteDAO.buscarPorCuidadorYPaciente(userId, pacienteId);
    
    if (relacion == null) {
        res.status(403);
        return gson.toJson(Map.of("error", "No autorizado"));
    }
    
    // Validar que la enfermera existe
    Usuario enfermera = usuarioDAO.buscarPorId(enfermeraId);
    if (enfermera == null || !"ENFERMERA".equals(enfermera.getRol())) {
        res.status(400);
        return gson.toJson(Map.of("error", "ID de enfermera inválido"));
    }
    
    // Crear relación en tabla (ej: paciente_enfermera)
    // PacienteEnfermera vinculo = pacienteEnfermeraDAO.crear(pacienteId, enfermeraId, rol);
    
    Map<String, Object> resultado = new HashMap<>();
    resultado.put("pacienteId", pacienteId);
    resultado.put("enfermeraId", enfermeraId);
    resultado.put("enfermera", Map.of(
        "id", enfermera.getId(),
        "nombre", enfermera.getNombre(),
        "telefono", enfermera.getTelefono()
    ));
    resultado.put("rol", rol);
    resultado.put("fechaAsignacion", LocalDateTime.now());
    
    res.status(201);
    return gson.toJson(resultado);
});
```

---

### 6. NOTIFICACIONES

#### GET `/api/notificaciones/:usuarioId/no-leidas`
**Descripción:** Obtener notificaciones no leídas de un usuario (ya existe, revisar)

**Autenticación:** ✅ JWT  
**Rol requerido:** Cualquiera (propio usuario)

**Respuesta:**
```json
[
  {
    "id": 1,
    "titulo": "Recordatorio de medicamento",
    "mensaje": "Es hora de tomar la medicación de las 8:00 AM",
    "fecha": "2025-11-09T08:00:00",
    "leida": false,
    "tipo": "MEDICAMENTO_RECORDATORIO"
  },
  {
    "id": 2,
    "titulo": "Acompañamiento confirmado",
    "mensaje": "Tu solicitud de acompañamiento ha sido aceptada",
    "fecha": "2025-11-09T10:30:00",
    "leida": false,
    "tipo": "ACOMPANAMIENTO_CONFIRMADO"
  }
]
```

**Nota:** Este endpoint ya existe en el backend. Solo asegurarse de incluir los nuevos tipos de notificación:
- `MEDICAMENTO_RECORDATORIO`
- `ACOMPANAMIENTO_CONFIRMADO`
- `AUTORIZACION_REQUERIDA`

---

## 🔔 SISTEMA DE RECORDATORIOS AUTOMÁTICOS

### Scheduler para Recordatorios

**Funcionalidad:** Ejecutar tarea programada cada hora para crear notificaciones de recordatorio

**Tipos de recordatorios:**
1. **Recordatorio de cita** (48h, 24h, 2h antes)
2. **Recordatorio de medicamento** (según plan de medicación)
3. **Recordatorio de reporte diario** (8:00 PM si no se ha registrado)

**Implementación Java (con ScheduledExecutorService):**

```java
import java.util.concurrent.*;

public class RecordatorioScheduler {
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    
    public void iniciar() {
        // Ejecutar cada hora
        scheduler.scheduleAtFixedRate(
            this::enviarRecordatorios,
            0,
            1,
            TimeUnit.HOURS
        );
    }
    
    private void enviarRecordatorios() {
        try {
            recordatoriosCitas();
            recordatoriosMedicamentos();
            recordatoriosReportes();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private void recordatoriosCitas() {
        LocalDateTime ahora = LocalDateTime.now();
        
        // Citas en 48 horas
        LocalDateTime en48h = ahora.plusHours(48);
        List<Cita> citas48h = citaDAO.buscarEnRango(en48h.minusMinutes(30), en48h.plusMinutes(30));
        
        for (Cita cita : citas48h) {
            // Notificar al paciente
            Notificacion notif = new Notificacion();
            notif.setTitulo("Recordatorio de cita");
            notif.setMensaje("Tienes una cita en 48 horas: " + cita.getFechaHora());
            notif.setDestinatario(cita.getPacienteId());
            notif.setTipo("CITA");
            notif.setCitaId(cita.getId());
            notificacionDAO.crear(notif);
            
            // Notificar al cuidador si existe
            List<CuidadorPaciente> cuidadores = cuidadorPacienteDAO.buscarPorPaciente(cita.getPacienteId());
            for (CuidadorPaciente cp : cuidadores) {
                Notificacion notifCuidador = new Notificacion();
                notifCuidador.setTitulo("Recordatorio de cita de paciente");
                notifCuidador.setMensaje("Cita de paciente en 48h: " + cita.getFechaHora());
                notifCuidador.setDestinatario(cp.getCuidadorId());
                notifCuidador.setTipo("CITA");
                notificacionDAO.crear(notifCuidador);
            }
        }
        
        // Similar para 24h y 2h antes...
    }
    
    private void recordatoriosMedicamentos() {
        // Implementar lógica de recordatorios de medicamentos
        // Requiere tabla de plan_medicacion con horarios
    }
    
    private void recordatoriosReportes() {
        LocalDateTime ahora = LocalDateTime.now();
        
        // Si son las 8:00 PM
        if (ahora.getHour() == 20 && ahora.getMinute() < 30) {
            LocalDate hoy = LocalDate.now();
            
            // Buscar cuidadores sin reporte del día
            List<CuidadorPaciente> relaciones = cuidadorPacienteDAO.buscarTodos();
            
            for (CuidadorPaciente rel : relaciones) {
                boolean tieneReporte = reporteDiarioDAO.existeReporte(rel.getPacienteId(), hoy);
                
                if (!tieneReporte) {
                    Notificacion notif = new Notificacion();
                    notif.setTitulo("Recordatorio: Registro diario");
                    notif.setMensaje("Recuerda registrar el reporte diario de tu paciente");
                    notif.setDestinatario(rel.getCuidadorId());
                    notif.setTipo("SISTEMA");
                    notificacionDAO.crear(notif);
                }
            }
        }
    }
}
```

**Iniciar scheduler en ApiServer:**
```java
public static void main(String[] args) {
    // ... configuración existente ...
    
    // Iniciar scheduler de recordatorios
    RecordatorioScheduler scheduler = new RecordatorioScheduler();
    scheduler.iniciar();
    
    System.out.println("Sistema de recordatorios iniciado");
}
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### ✅ Modelos y Tablas de BD
- [ ] Crear tabla `cuidador_paciente`
- [ ] Crear tabla `acompanamiento`
- [ ] Crear tabla `reporte_diario`
- [ ] Crear tabla `autorizacion`
- [ ] Agregar campo `numero_documento` en `pacientes` (si no existe)
- [ ] Crear DAOs correspondientes:
  - [ ] `CuidadorPacienteDAO`
  - [ ] `AcompanamientoDAO`
  - [ ] `ReporteDiarioDAO`
  - [ ] `AutorizacionDAO`

### ✅ Endpoints - Relación Cuidador-Paciente
- [ ] `GET /api/cuidadores/:id/pacientes`
- [ ] `POST /api/cuidadores/:id/pacientes`
- [ ] `DELETE /api/cuidadores/:id/pacientes/:pacienteRelId`

### ✅ Endpoints - Agendamiento
- [ ] Extender `POST /api/citas` para soportar `solicitadoPorCuidadorId`
- [ ] `GET /api/profesionales/:id/disponibilidad?fecha=YYYY-MM-DD`
- [ ] `GET /api/profesionales?especialidad=XXX` (puede ya existir)

### ✅ Endpoints - Acompañamiento
- [ ] `POST /api/citas/:id/solicitar-acompanamiento`
- [ ] `GET /api/citas/:id/acompaniamientos`
- [ ] `PUT /api/citas/:id/acompaniamientos/:acomId/estado`
- [ ] `PUT /api/acompaniamientos/:id/llegada`
- [ ] `PUT /api/acompaniamientos/:id/finalizar`

### ✅ Endpoints - Reportes Diarios
- [ ] `POST /api/pacientes/:id/reportes`
- [ ] `GET /api/pacientes/:id/reportes`

### ✅ Endpoints - Autorizaciones
- [ ] `GET /api/pacientes/:id/autorizaciones`
- [ ] `POST /api/pacientes/:id/autorizaciones`
- [ ] `POST /api/pacientes/:id/vincular-enfermera`

### ✅ Notificaciones
- [ ] Verificar `GET /api/notificaciones/:usuarioId/no-leidas` existe
- [ ] Agregar tipos de notificación:
  - [ ] `MEDICAMENTO_RECORDATORIO`
  - [ ] `ACOMPANAMIENTO_CONFIRMADO`
  - [ ] `AUTORIZACION_REQUERIDA`

### ✅ Scheduler de Recordatorios
- [ ] Implementar `RecordatorioScheduler`
- [ ] Recordatorios de citas (48h, 24h, 2h)
- [ ] Recordatorios de medicamentos (opcional - requiere plan de medicación)
- [ ] Recordatorios de reportes diarios (8:00 PM)
- [ ] Iniciar scheduler en `main()` de `ApiServer`

### ✅ Validaciones y Seguridad
- [ ] Validar JWT en todas las rutas `/api/*`
- [ ] Validar permisos granulares (`puedeAgendar`, `puedeCancelar`, etc.)
- [ ] Validar relación activa cuidador-paciente en operaciones sensibles
- [ ] Logs de auditoría para acciones críticas
- [ ] Rate limiting para prevenir abuso (opcional)

### ✅ Tests
- [ ] Tests unitarios para DAOs
- [ ] Tests de integración para endpoints críticos
- [ ] Tests de validación de permisos
- [ ] Tests de scheduler (simular tiempo)

---

## 📊 FRONTEND - ESTRUCTURA DE ARCHIVOS

### Servicios
```
src/services/
  └── cuidador.service.ts       ✅ CREADO
```

### Páginas
```
src/pages/cuidador/
  ├── CuidadorDashboard.tsx     ✅ CREADO
  ├── CuidadorPacientes.tsx     ✅ CREADO
  ├── CuidadorCitas.tsx         ⏳ PENDIENTE
  ├── CuidadorReportes.tsx      ⏳ PENDIENTE
  ├── CuidadorNotificaciones.tsx ⏳ PENDIENTE
  └── CuidadorPerfil.tsx        ✅ CREADO
```

### Componentes
```
src/components/cuidador/
  ├── VincularPacienteDialog.tsx    (incluido en CuidadorPacientes)
  ├── AgendarCitaDialog.tsx         ⏳ PENDIENTE
  ├── SolicitarAcompanamientoDialog.tsx ⏳ PENDIENTE
  ├── ReporteDiarioForm.tsx         ⏳ PENDIENTE
  └── PacienteCard.tsx              (incluido en dashboard)
```

### Layouts
```
src/components/layouts/
  ├── CaregiverLayout.tsx           ✅ ACTUALIZADO
  └── CaregiverSidebar.tsx          ✅ CREADO
```

---

## 🧪 CASOS DE PRUEBA (QA)

### Test 1: Vincular Paciente
1. Login como CUIDADOR
2. POST `/api/cuidadores/5/pacientes` con payload completo
3. Verificar respuesta 201 con objeto creado
4. GET `/api/cuidadores/5/pacientes` → debe incluir el nuevo paciente
5. Verificar notificación al paciente

### Test 2: Agendar Cita como Cuidador
1. Login como CUIDADOR
2. GET `/api/profesionales/3/disponibilidad?fecha=2025-11-20` → obtener horarios
3. POST `/api/citas` con `solicitadoPorCuidadorId`
4. Verificar validación de permisos (`puedeAgendar = true`)
5. Verificar cita creada en BD
6. Verificar notificación al paciente

### Test 3: Flujo Completo de Acompañamiento
1. Login como CUIDADOR
2. POST `/api/citas/42/solicitar-acompanamiento` → estado PENDIENTE
3. Login como ENFERMERA
4. PUT `/api/citas/42/acompaniamientos/1/estado` → CONFIRMADO
5. Verificar notificación al cuidador
6. PUT `/api/acompaniamientos/1/llegada` → estado LLEGADO
7. Verificar notificación al médico
8. PUT `/api/acompaniamientos/1/finalizar` → estado FINALIZADO

### Test 4: Reporte Diario
1. Login como CUIDADOR
2. POST `/api/pacientes/10/reportes` con datos completos
3. Verificar respuesta 201
4. GET `/api/pacientes/10/reportes` → debe incluir el nuevo reporte
5. Si `estadoEmocional = CRITICO`, verificar notificación al médico

### Test 5: Validación de Permisos
1. Login como CUIDADOR sin permiso `puedeAgendar`
2. POST `/api/citas` con `solicitadoPorCuidadorId`
3. Verificar respuesta 403 "No tienes permiso para agendar citas"

### Test 6: Scheduler de Recordatorios
1. Crear cita para dentro de 48 horas
2. Esperar ejecución del scheduler (o simular)
3. Verificar creación de notificación de recordatorio
4. Repetir para 24h y 2h antes

---

## 🔗 MAPEO FRONTEND → BACKEND

| Función Frontend | Endpoint Backend | Método | Estado |
|------------------|------------------|--------|--------|
| `getPacientesCuidador(id)` | `/api/cuidadores/:id/pacientes` | GET | ⏳ Pendiente |
| `vincularPaciente(id, payload)` | `/api/cuidadores/:id/pacientes` | POST | ⏳ Pendiente |
| `desvincularPaciente(id, relId)` | `/api/cuidadores/:id/pacientes/:relId` | DELETE | ⏳ Pendiente |
| `agendarCitaComoCuidador(payload)` | `/api/citas` | POST | ⚠️ Requiere extensión |
| `getProfesionalesPorEspecialidad(esp)` | `/api/profesionales?especialidad=X` | GET | ✅ Existe |
| `getDisponibilidadProfesional(id, fecha)` | `/api/profesionales/:id/disponibilidad` | GET | ⏳ Pendiente |
| `solicitarAcompanamiento(citaId, payload)` | `/api/citas/:id/solicitar-acompanamiento` | POST | ⏳ Pendiente |
| `getAcompanamientos(citaId)` | `/api/citas/:id/acompaniamientos` | GET | ⏳ Pendiente |
| `actualizarEstadoAcompanamiento(...)` | `/api/citas/:id/acompaniamientos/:acomId/estado` | PUT | ⏳ Pendiente |
| `marcarLlegadaAcompanamiento(id)` | `/api/acompaniamientos/:id/llegada` | PUT | ⏳ Pendiente |
| `finalizarAcompanamiento(id)` | `/api/acompaniamientos/:id/finalizar` | PUT | ⏳ Pendiente |
| `registrarReporteDiario(pacId, payload)` | `/api/pacientes/:id/reportes` | POST | ⏳ Pendiente |
| `getReportesDiarios(pacId)` | `/api/pacientes/:id/reportes` | GET | ⏳ Pendiente |
| `getAutorizaciones(pacId)` | `/api/pacientes/:id/autorizaciones` | GET | ⏳ Pendiente |
| `crearAutorizacion(pacId, payload)` | `/api/pacientes/:id/autorizaciones` | POST | ⏳ Pendiente |
| `vincularEnfermeraFija(pacId, enfId)` | `/api/pacientes/:id/vincular-enfermera` | POST | ⏳ Pendiente |

---

## 💡 CONSIDERACIONES DE ACCESIBILIDAD

El frontend de Cuidador incluye características de accesibilidad avanzadas:

1. **Vista Simplificada**
   - Botones grandes (h-20, text-lg)
   - Alto contraste (border-4)
   - Texto aumentado

2. **Lectura en Voz Alta**
   - Web Speech API
   - Botones con aria-label
   - Síntesis de resúmenes

3. **Navegación por Teclado**
   - Todos los elementos interactivos focusables
   - Tab order lógico

4. **ARIA Labels**
   - Todos los botones y links con `aria-label` descriptivo
   - Roles ARIA correctos

5. **Contraste y Color**
   - Uso de tokens semánticos del design system
   - No depender solo del color para información crítica

---

## 📞 PRÓXIMOS PASOS

1. **Implementar endpoints backend** según especificación
2. **Crear tablas de BD** con los SQL proporcionados
3. **Implementar DAOs** para nuevas entidades
4. **Configurar scheduler** de recordatorios
5. **Completar páginas frontend** pendientes (Citas, Reportes, Notificaciones)
6. **Pruebas exhaustivas** con checklist de QA
7. **Documentar flujos** para usuarios finales
8. **Optimizar rendimiento** (índices en BD, caching)
9. **Configurar monitoreo** de scheduler y notificaciones

---

**Última actualización:** 2025-11-09  
**Versión:** 1.0  
**Contacto:** Equipo Healix Pro
