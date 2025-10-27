# 🏥 Sistema Hospy - 3 Niveles de Acceso

## 👑 **Sistema Profesional para Hospitales**

---

## 🎯 **Los 3 Niveles de Acceso**

### **1. 👑 ADMINISTRADOR (TÚ)**
```
🔗 Login: http://localhost:3004/admin/login
🎨 Color: Morado/Púrpura
🔐 Acceso: RESTRINGIDO - Solo tú
```

**TÚ TIENES EL CONTROL TOTAL:**
- ✅ Creas las cuentas de los **médicos** con sus contraseñas
- ✅ Gestionas **TODO** el sistema
- ✅ Ves **TODOS** los pacientes
- ✅ Ves **TODOS** los médicos
- ✅ Ves **TODAS** las citas, consultas, prescripciones
- ✅ Estadísticas globales del hospital
- ✅ Configuración del sistema

**Los médicos NO pueden:**
- ❌ Ver pacientes de otros médicos
- ❌ Crear otros médicos
- ❌ Acceder al panel administrativo

---

### **2. 👨‍⚕️ MÉDICOS (Acceso Limitado)**
```
🔗 Login: http://localhost:3004/doctor/login
🎨 Color: Azul
🔐 Acceso: Credenciales creadas por el ADMIN
```

**LO QUE PUEDEN VER:**
- ✅ **SOLO** sus propias citas
- ✅ **SOLO** sus propios pacientes
- ✅ **SOLO** sus consultas realizadas
- ✅ Crear prescripciones para sus pacientes
- ✅ Ver historias clínicas de sus pacientes

**LO QUE NO PUEDEN VER:**
- ❌ Pacientes de otros médicos
- ❌ Citas de otros médicos
- ❌ Panel administrativo
- ❌ Crear otros usuarios

---

### **3. 🧑‍⚤️ PACIENTES (Auto-Registro Público)**
```
🔗 Login: http://localhost:3004/patient/login
🔗 Registro: http://localhost:3004/patient/register
🎨 Color: Verde
🔐 Acceso: CUALQUIERA puede registrarse
```

**LO QUE PUEDEN VER:**
- ✅ **SOLO** su información personal
- ✅ **SOLO** sus propias citas
- ✅ **SOLO** sus consultas
- ✅ **SOLO** sus recetas médicas
- ✅ **SOLO** sus documentos médicos
- ✅ Agendar nuevas citas

**IMPORTANTE:**
- ✓ Cualquier persona puede crear una cuenta de paciente
- ✓ Registro es **GRATIS** y **PÚBLICO**
- ✓ No necesitan permiso del administrador

---

## 🚀 **CONFIGURACIÓN INICIAL (PRIMERA VEZ)**

### **PASO 1: Crear TU Cuenta de Administrador**

**Solo la primera vez, usa PowerShell:**

```powershell
$body = @{
    username = "admin"
    email = "tu@email.com"
    password = "TuContraseñaSegura123"
    fullName = "Tu Nombre Completo"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3004/api/auth/admin/setup' -Method POST -Body $body -ContentType 'application/json'
```

**IMPORTANTE:** Esta API solo funciona **UNA VEZ**. Después se bloquea automáticamente por seguridad.

**Recomendaciones:**
- Usuario: `admin` o tu nombre
- Contraseña: Mínimo 8 caracteres, con números y símbolos
- Email: Tu email real

---

### **PASO 2: Login como Administrador**

1. Ve a `http://localhost:3004/admin/login`
2. Ingresa:
   - Usuario: `admin` (o el que creaste)
   - Contraseña: La que estableciste
3. ¡Ya tienes acceso completo!

---

### **PASO 3: Crear Médicos**

Ahora TÚ como administrador creas las cuentas de médicos:

1. Desde el panel admin: `http://localhost:3004`
2. Sidebar → **"Médicos"** → **"Nuevo Médico"**
3. Llena el formulario **INCLUYENDO** email y contraseña

**Ejemplo de Médico:**
```
Nombre: María
Apellido: González
Email: maria.gonzalez@hospital.com
Contraseña: medico123 (TÚ decides la contraseña)
Teléfono: 809-555-0001
Licencia: LIC-2024-001
Especialidad: Cardiología
Fecha Nacimiento: 1985-03-15
Género: Femenino
Dirección: Av. Winston Churchill 123
Ciudad: Santo Domingo
Años Experiencia: 10
Duración Consulta: 30
Tarifa: 1500
```

4. Guardar
5. **Entregar las credenciales al médico:**
   - Email: `maria.gonzalez@hospital.com`
   - Contraseña: `medico123`

---

### **PASO 4: Los Médicos Ingresan**

Los médicos que creaste pueden ahora:

1. Ir a `http://localhost:3004/doctor/login`
2. Usar las credenciales que TÚ les diste
3. Verán su dashboard personalizado

---

### **PASO 5: Pacientes se Registran**

Cualquier persona puede:

1. Ir a `http://localhost:3004/patient/register`
2. Llenar el formulario de registro
3. Crear su cuenta **GRATIS**
4. Login en `http://localhost:3004/patient/login`

**NO NECESITAN PERMISO** del administrador.

---

## 📊 **Comparación de Permisos**

| Función | Administrador | Médico | Paciente |
|---------|--------------|--------|----------|
| Ver TODOS los pacientes | ✅ | ❌ | ❌ |
| Ver sus propios pacientes | ✅ | ✅ | ❌ |
| Ver su propia info | ✅ | ✅ | ✅ |
| Crear médicos | ✅ | ❌ | ❌ |
| Auto-registrarse | ❌ | ❌ | ✅ |
| Ver TODAS las citas | ✅ | ❌ | ❌ |
| Ver sus propias citas | ✅ | ✅ | ✅ |
| Crear consultas | ✅ | ✅ | ❌ |
| Ver recetas propias | ✅ | ✅ | ✅ |
| Estadísticas globales | ✅ | ❌ | ❌ |
| Configurar sistema | ✅ | ❌ | ❌ |

---

## 🔐 **Seguridad del Sistema**

### **Nivel Administrador:**
- 🔒 Credenciales únicas creadas una sola vez
- 🔒 No se puede crear más admins sin eliminar BD
- 🔒 Control total del sistema
- 🔒 Puede resetear contraseñas de médicos

### **Nivel Médico:**
- 🔒 Credenciales creadas por el admin
- 🔒 Solo ven sus propios datos
- 🔒 No pueden ver otros médicos
- 🔒 Acceso limitado por diseño

### **Nivel Paciente:**
- 🔒 Auto-registro con validación
- 🔒 Solo ven su propia información
- 🔒 No pueden ver otros pacientes
- 🔒 Contraseñas hasheadas

---

## 🌐 **URLs Completas del Sistema**

### **Página Principal:**
```
http://localhost:3004/login
```
↓
Selector de 3 opciones:
- Portal Médico
- Portal Paciente
- Administrador

### **Portal Administrador:**
```
Login:     http://localhost:3004/admin/login
Dashboard: http://localhost:3004
```

### **Portal Médico:**
```
Login:     http://localhost:3004/doctor/login
Dashboard: http://localhost:3004/doctor/dashboard
```

### **Portal Paciente:**
```
Login:     http://localhost:3004/patient/login
Registro:  http://localhost:3004/patient/register
Dashboard: http://localhost:3004/patient/dashboard
```

---

## 💡 **Flujo Típico de un Hospital**

### **1. Hospital Contrata Nuevo Médico:**
```
TÚ (Admin) → Panel Admin → Médicos → Nuevo Médico
↓
Creas cuenta con email y contraseña
↓
Entregas credenciales al médico
↓
Médico ingresa a su portal
```

### **2. Paciente Nuevo Llega:**
```
Paciente → http://localhost:3004/patient/register
↓
Llena formulario y crea cuenta
↓
Login en portal paciente
↓
Agenda su primera cita
```

### **3. Médico Ve Paciente:**
```
Médico → Login portal médico
↓
Ve sus citas del día
↓
Realiza consulta
↓
Crea prescripción
```

### **4. Tú Supervisas Todo:**
```
Admin → Panel administrativo
↓
Ves estadísticas globales
↓
Monitoreas todos los médicos
↓
Verificas todas las citas
```

---

## 🎯 **Casos de Uso Reales**

### **Caso 1: Hospital Pequeño**
```
👑 1 Administrador (tú)
👨‍⚕️ 5 Médicos (diferentes especialidades)
🧑‍⚤️ 100+ Pacientes (auto-registrados)
```

**Flujo:**
- Tú creas las 5 cuentas de médicos
- Los médicos ingresan y empiezan a trabajar
- Los pacientes se registran libremente
- Tú supervisas todo desde el panel admin

---

### **Caso 2: Hospital Grande**
```
👑 1 Administrador principal (tú)
👨‍⚕️ 50 Médicos (múltiples especialidades)
🧑‍⚤️ 5000+ Pacientes (auto-registrados)
```

**Flujo:**
- Tú creas cuentas de médicos conforme los contratan
- Cada médico solo ve sus propios pacientes
- Sistema escalable para miles de pacientes
- Tú tienes visión global de todo

---

## 📱 **Ejemplo Práctico Completo**

### **DÍA 1 - Setup Inicial:**

**8:00 AM** - Creas tu cuenta de admin
```powershell
# PowerShell
$body = @{
    username = "admin"
    email = "director@hospital.com"
    password = "Hospital2024!"
    fullName = "Director Hospital"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3004/api/auth/admin/setup' -Method POST -Body $body -ContentType 'application/json'
```

**8:05 AM** - Login como admin
```
http://localhost:3004/admin/login
Usuario: admin
Contraseña: Hospital2024!
```

**8:10 AM** - Creas primer médico
```
Panel Admin → Médicos → Nuevo
Email: dr.martinez@hospital.com
Password: Doctor123
Especialidad: Cardiología
```

**8:15 AM** - Entregas credenciales
```
Le dices al Dr. Martínez:
"Tu acceso es: dr.martinez@hospital.com / Doctor123"
```

---

### **DÍA 1 - Médico Empieza:**

**9:00 AM** - Dr. Martínez ingresa
```
http://localhost:3004/doctor/login
Email: dr.martinez@hospital.com
Password: Doctor123
```

**9:05 AM** - Ve su dashboard
```
- 0 citas (aún no tiene)
- 0 consultas (primer día)
- Sistema listo
```

---

### **DÍA 1 - Primer Paciente:**

**10:00 AM** - Paciente se registra
```
http://localhost:3004/patient/register
Nombre: Ana López
Email: ana.lopez@email.com
Password: Paciente123
(Llena todos los datos)
```

**10:05 AM** - Admin crea cita
```
Panel Admin → Citas → Nueva
Paciente: Ana López
Médico: Dr. Martínez
Fecha: Hoy 11:00 AM
```

**11:00 AM** - Consulta
```
Dr. Martínez ve la cita en su dashboard
Realiza la consulta
Crea prescripción
Todo registrado en el sistema
```

**11:30 AM** - Paciente ve resultados
```
Ana ingresa a su portal
Ve su consulta registrada
Ve su receta médica
Puede imprimir o descargar
```

---

## 🎊 **¡Sistema Listo para Producción!**

Tu sistema ahora es **completamente profesional** con:

✅ **3 niveles de acceso claramente definidos**
✅ **Tú como administrador tienes control total**
✅ **Médicos tienen acceso limitado a sus datos**
✅ **Pacientes pueden auto-registrarse**
✅ **Seguridad con contraseñas hasheadas**
✅ **Tokens JWT para sesiones**
✅ **Dashboards personalizados por rol**
✅ **Escalable para cualquier tamaño de hospital**

---

## 📞 **Resumen de URLs**

```
🏠 Selector Principal:
   http://localhost:3004/login

👑 ADMIN (TÚ):
   http://localhost:3004/admin/login

👨‍⚕️ MÉDICOS (Creados por ti):
   http://localhost:3004/doctor/login

🧑‍⚤️ PACIENTES (Auto-registro):
   http://localhost:3004/patient/register
   http://localhost:3004/patient/login
```

---

## 🔥 **IMPORTANTE - Primeros Pasos:**

1. **CREAR TU CUENTA DE ADMIN** (usar PowerShell)
2. **LOGIN como admin**
3. **CREAR médicos** desde panel admin
4. **ENTREGARLES credenciales** a los médicos
5. **LOS PACIENTES** se registran solos

**¡Tu hospital está listo para operar! 🏥**

