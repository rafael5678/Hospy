# 🔐 Sistema de Autenticación - Hospy

## ✅ **Sistema Implementado**

Tu sistema Hospy ahora tiene **tres portales independientes** con autenticación segura:

1. **Portal de Médicos** 👨‍⚕️
2. **Portal de Pacientes** 🧑‍⚤️
3. **Panel Administrativo** 👨‍💼

---

## 🌐 **URLs de Acceso**

### **Página Principal de Login:**
```
http://localhost:3004/login
```
Desde aquí puedes elegir qué portal usar.

### **Portal de Médicos:**
- Login: `http://localhost:3004/doctor/login`
- Dashboard: `http://localhost:3004/doctor/dashboard`

### **Portal de Pacientes:**
- Login: `http://localhost:3004/patient/login`
- Dashboard: `http://localhost:3004/patient/dashboard`

### **Panel Administrativo:**
- Dashboard: `http://localhost:3004`
- (Sin login requerido por ahora)

---

## 👨‍⚕️ **Portal de Médicos**

### **Características:**
- ✅ Login seguro con email y contraseña
- ✅ Dashboard personalizado
- ✅ Ver sus citas programadas
- ✅ Historial de consultas realizadas
- ✅ Lista de pacientes
- ✅ Acciones rápidas (Agenda, Nueva Consulta, Pacientes)
- ✅ Notificaciones
- ✅ Cerrar sesión

### **Cómo Registrar un Médico:**

#### **Opción 1: Desde el Panel Administrativo (Recomendado)**
1. Ve a `http://localhost:3004`
2. Sidebar → **"Médicos"**
3. Clic en **"Nuevo Médico"**
4. Llena el formulario **incluyendo email y contraseña**
5. Guarda

El médico ahora podrá ingresar a su portal con:
- Email: `el-que-registraste@hospital.com`
- Contraseña: `la-que-estableciste`

#### **Ejemplo de Médico:**
```
Nombre: María
Apellido: González
Email: maria.gonzalez@hospy.com
Contraseña: medico123
Teléfono: 809-555-0001
Licencia: LIC-2024-001
Especialidad: Cardiología
Fecha de Nacimiento: 1985-03-15
Género: Femenino
Dirección: Av. Winston Churchill 123
Ciudad: Santo Domingo
Años de Experiencia: 10
Duración de Consulta: 30 minutos
Tarifa: 1500 RD$
```

### **Cómo Ingresar como Médico:**
1. Ve a `http://localhost:3004/doctor/login`
2. Ingresa email y contraseña
3. Clic en **"Iniciar Sesión"**
4. Serás redirigido a tu dashboard personalizado

---

## 🧑‍⚤️ **Portal de Pacientes**

### **Características:**
- ✅ Login seguro con email y contraseña
- ✅ Dashboard personalizado
- ✅ Ver mis citas programadas
- ✅ Historial de consultas
- ✅ Mis recetas médicas activas
- ✅ Mis documentos médicos
- ✅ Acciones rápidas (Agendar Cita, Ver Recetas, Documentos, Perfil)
- ✅ Notificaciones
- ✅ Cerrar sesión

### **Cómo Registrar un Paciente con Acceso:**

**IMPORTANTE:** Los pacientes existentes **NO** tienen contraseña todavía. Necesitas registrar nuevos pacientes o actualizar los existentes.

#### **Registrar Nuevo Paciente con Acceso:**

**Usando API directamente:**
```bash
curl -X POST http://localhost:3004/api/auth/patient/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ana",
    "lastName": "Martínez",
    "email": "ana.martinez@example.com",
    "password": "paciente123",
    "phone": "809-555-1111",
    "dateOfBirth": "1992-07-20",
    "gender": "Femenino",
    "address": "Calle El Sol 456",
    "city": "Santo Domingo",
    "emergencyContact": {
      "name": "Pedro Martínez",
      "phone": "809-555-2222",
      "relationship": "Esposo"
    },
    "bloodType": "A+",
    "status": "Activo"
  }'
```

**Usando PowerShell:**
```powershell
$body = @{
    firstName = "Ana"
    lastName = "Martínez"
    email = "ana.martinez@example.com"
    password = "paciente123"
    phone = "809-555-1111"
    dateOfBirth = "1992-07-20"
    gender = "Femenino"
    address = "Calle El Sol 456"
    city = "Santo Domingo"
    emergencyContact = @{
        name = "Pedro Martínez"
        phone = "809-555-2222"
        relationship = "Esposo"
    }
    bloodType = "A+"
    status = "Activo"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3004/api/auth/patient/register' -Method POST -Body $body -ContentType 'application/json'
```

### **Cómo Ingresar como Paciente:**
1. Ve a `http://localhost:3004/patient/login`
2. Ingresa email y contraseña
3. Clic en **"Iniciar Sesión"**
4. Serás redirigido a tu dashboard personalizado

---

## 👨‍💼 **Panel Administrativo**

### **Características:**
- ✅ Acceso completo a todos los módulos
- ✅ Gestión de todos los pacientes
- ✅ Gestión de todos los médicos
- ✅ Gestión de citas
- ✅ Gestión de consultas
- ✅ Gestión de prescripciones
- ✅ Gestión de historias clínicas
- ✅ Estadísticas generales
- ✅ Configuración del sistema

**Acceso:** `http://localhost:3004`
- Por ahora no requiere login
- Es el panel completo que ya venías usando

---

## 🔑 **Seguridad Implementada**

### **Hashing de Contraseñas:**
- ✅ Todas las contraseñas se hashean con `bcryptjs`
- ✅ Salt de 10 rounds
- ✅ Nunca se almacenan en texto plano

### **Tokens JWT:**
- ✅ JSON Web Tokens para sesiones
- ✅ Expiración de 7 días
- ✅ Incluyen: ID, email, rol (doctor/patient), nombre

### **Protección de Datos:**
- ✅ Campo `password` con `select: false` en los modelos
- ✅ No se envía en las respuestas de API
- ✅ Solo se incluye cuando es necesario (login)

### **Almacenamiento Local:**
- ✅ Token guardado en `localStorage`
- ✅ Datos del usuario guardados en `localStorage`
- ✅ Verificación en cada carga de página
- ✅ Redirección automática si no está autenticado

---

## 📋 **APIs de Autenticación**

### **Login de Médico:**
```http
POST /api/auth/doctor/login
Content-Type: application/json

{
  "email": "doctor@hospital.com",
  "password": "password123"
}

Respuesta:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "doctor": {
    "id": "...",
    "firstName": "María",
    "lastName": "González",
    "email": "maria.gonzalez@hospital.com",
    "specialty": "Cardiología",
    "licenseNumber": "LIC-2024-001",
    "status": "Activo"
  }
}
```

### **Registro de Médico:**
```http
POST /api/auth/doctor/register
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@hospital.com",
  "password": "password123",
  "phone": "809-555-0001",
  "licenseNumber": "LIC-2024-002",
  "specialty": "Pediatría",
  "dateOfBirth": "1980-01-01",
  "gender": "Masculino",
  "address": "Calle Principal 123",
  "city": "Santo Domingo",
  "education": [],
  "yearsOfExperience": 15,
  "consultationDuration": 30,
  "consultationFee": 1200,
  "status": "Activo"
}
```

### **Login de Paciente:**
```http
POST /api/auth/patient/login
Content-Type: application/json

{
  "email": "paciente@example.com",
  "password": "password123"
}

Respuesta:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "patient": {
    "id": "...",
    "firstName": "Ana",
    "lastName": "Martínez",
    "email": "ana.martinez@example.com",
    "phone": "809-555-1111",
    "dateOfBirth": "1992-07-20",
    "bloodType": "A+",
    "status": "Activo"
  }
}
```

### **Registro de Paciente:**
```http
POST /api/auth/patient/register
Content-Type: application/json

{
  "firstName": "Pedro",
  "lastName": "López",
  "email": "pedro.lopez@example.com",
  "password": "password123",
  "phone": "809-555-3333",
  "dateOfBirth": "1990-05-15",
  "gender": "Masculino",
  "address": "Av. 27 de Febrero",
  "city": "Santo Domingo",
  "emergencyContact": {
    "name": "María López",
    "phone": "809-555-4444",
    "relationship": "Hermana"
  },
  "bloodType": "O+",
  "status": "Activo"
}
```

---

## 🚀 **Flujo de Uso Completo**

### **Para Administradores:**
1. Ir a `http://localhost:3004`
2. Registrar médicos (incluir email y contraseña)
3. Registrar pacientes (si necesitan acceso al portal)
4. Gestionar citas, consultas, etc.

### **Para Médicos:**
1. Ir a `http://localhost:3004/doctor/login`
2. Iniciar sesión con email y contraseña
3. Ver dashboard con:
   - Citas pendientes
   - Consultas realizadas
   - Lista de pacientes
4. Realizar consultas, prescribir medicamentos, etc.
5. Cerrar sesión cuando termine

### **Para Pacientes:**
1. Ir a `http://localhost:3004/patient/login`
2. Iniciar sesión con email y contraseña
3. Ver dashboard con:
   - Próximas citas
   - Historial de consultas
   - Recetas médicas
   - Documentos médicos
4. Agendar citas, ver recetas, etc.
5. Cerrar sesión cuando termine

---

## 🎨 **Diferencias Visuales**

### **Portal de Médicos:**
- 🔵 Color: Azul
- 🩺 Icono: Estetoscopio
- Enfoque: Herramientas profesionales médicas

### **Portal de Pacientes:**
- 🟢 Color: Verde
- ❤️ Icono: Corazón
- Enfoque: Salud personal y citas

### **Panel Administrativo:**
- 🟣 Color: Morado/Azul
- 🛡️ Icono: Escudo
- Enfoque: Gestión completa

---

## 🔒 **Variables de Entorno**

El sistema usa estas variables en `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/hospy
NEXT_PUBLIC_APP_URL=http://localhost:3004
JWT_SECRET=hospy-jwt-secret-key-change-in-production-2024
```

**IMPORTANTE para Producción:**
- Cambiar `JWT_SECRET` por uno aleatorio y seguro
- Usar HTTPS
- Configurar variables de entorno en el servidor

---

## 📝 **Ejemplos de Prueba**

### **Crear Médico de Prueba:**
1. Panel Admin → Médicos → Nuevo Médico
2. Datos:
   - Email: `doctor@test.com`
   - Password: `test123`
   - Nombre: Test
   - Apellido: Doctor
   - Licencia: TEST-001
   - Especialidad: Medicina General

3. Login en: `http://localhost:3004/doctor/login`
   - Email: `doctor@test.com`
   - Password: `test123`

### **Crear Paciente de Prueba:**
PowerShell:
```powershell
$body = @{
    firstName = "Test"
    lastName = "Patient"
    email = "patient@test.com"
    password = "test123"
    phone = "809-000-0000"
    dateOfBirth = "1990-01-01"
    gender = "Masculino"
    address = "Test Address"
    city = "Test City"
    emergencyContact = @{
        name = "Emergency Contact"
        phone = "809-000-0001"
        relationship = "Familiar"
    }
    bloodType = "O+"
    status = "Activo"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3004/api/auth/patient/register' -Method POST -Body $body -ContentType 'application/json'
```

Login en: `http://localhost:3004/patient/login`
- Email: `patient@test.com`
- Password: `test123`

---

## ✨ **Características Adicionales**

### **En el Dashboard de Médicos:**
- Ver citas del día
- Acceso rápido a pacientes
- Historial de consultas propias
- Botones de acción rápida

### **En el Dashboard de Pacientes:**
- Ver próximas citas
- Ver recetas activas
- Historial médico personal
- Agendar nuevas citas

---

## 🎯 **Próximos Pasos Recomendados**

### **Mejoras de Seguridad:**
1. Implementar recuperación de contraseña
2. Verificación de email
3. Autenticación de dos factores (2FA)
4. Logs de acceso

### **Mejoras de Funcionalidad:**
1. Permitir a médicos ver solo sus pacientes
2. Permitir a pacientes agendar citas online
3. Sistema de mensajería médico-paciente
4. Notificaciones por email

---

## 🎊 **¡Sistema Completo!**

Ahora tienes:
- ✅ Tres portales independientes
- ✅ Autenticación segura
- ✅ Dashboards personalizados
- ✅ Protección de contraseñas con bcrypt
- ✅ Sesiones con JWT
- ✅ Interfaces diferenciadas

**¡Tu sistema Hospy es ahora un sistema hospitalario completo con autenticación multi-portal!** 🏥🔐

