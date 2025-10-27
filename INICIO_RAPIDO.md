# 🚀 Inicio Rápido - Sistema Hospy

## ⚡ **3 Pasos para Empezar**

---

## 📋 **Requisitos Previos**

✅ MongoDB corriendo
✅ Servidor Next.js en puerto 3004
✅ Navegador web

---

## 🎯 **PASO 1: Crear TU Cuenta de Administrador**

### **Opción A: Usar Script (MÁS FÁCIL)**

1. Abre una terminal en la carpeta del proyecto
2. Ejecuta:
```cmd
crear-admin.bat
```
3. Sigue las instrucciones:
   - Usuario: `admin` (o el que quieras)
   - Email: Tu email
   - Nombre completo: Tu nombre
   - Contraseña: Una contraseña segura

4. ¡Listo! Verás un mensaje de éxito.

---

### **Opción B: Usar PowerShell (Manual)**

```powershell
$body = @{
    username = "admin"
    email = "tu@email.com"
    password = "TuContraseña123"
    fullName = "Tu Nombre"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3004/api/auth/admin/setup' -Method POST -Body $body -ContentType 'application/json'
```

---

## 🔐 **PASO 2: Ingresar como Administrador**

1. Abre tu navegador
2. Ve a: **http://localhost:3004/admin/login**
3. Ingresa tus credenciales:
   - Usuario: El que creaste
   - Contraseña: La que estableciste
4. ¡Ya tienes acceso completo al sistema!

---

## 👨‍⚕️ **PASO 3: Crear Tu Primer Médico**

1. Desde el panel admin, ve al sidebar
2. Haz clic en **"Médicos"**
3. Clic en **"Nuevo Médico"**
4. Llena el formulario:

```
Ejemplo:
Nombre: María
Apellido: González
Email: maria.gonzalez@hospital.com
Contraseña: medico123
Teléfono: 809-555-0001
Licencia: LIC-2024-001
Especialidad: Cardiología
Fecha Nacimiento: 1985-03-15
Género: Femenino
Dirección: Av. Principal 123
Ciudad: Santo Domingo
Años Experiencia: 10
Duración Consulta: 30 minutos
Tarifa: 1500 RD$
```

5. Clic en **"Registrar Médico"**

---

## ✅ **¡Ya Está!**

Ahora tienes:
- ✅ **TU cuenta de administrador** con control total
- ✅ **Un médico registrado** listo para usar
- ✅ **El sistema funcionando** completamente

---

## 🎯 **Próximos Pasos**

### **Para el Médico que creaste:**
1. Entrégale las credenciales:
   - Email: `maria.gonzalez@hospital.com`
   - Contraseña: `medico123`
2. Dile que ingrese en: **http://localhost:3004/doctor/login**

### **Para Pacientes:**
1. Cualquier persona puede registrarse en: **http://localhost:3004/patient/register**
2. Es gratis y no necesitan aprobación

---

## 🌐 **URLs Importantes**

```
Página Principal:
http://localhost:3004/login

Tu Panel Admin:
http://localhost:3004/admin/login

Portal Médico:
http://localhost:3004/doctor/login

Registro Paciente:
http://localhost:3004/patient/register
```

---

## 🆘 **¿Problemas?**

### **"Ya existe un administrador"**
✅ **NORMAL** - Ya creaste tu cuenta antes.
👉 Solo puedes crear UN admin. Si necesitas cambiar credenciales, necesitas eliminar la BD.

### **"Error de conexión"**
❌ El servidor no está corriendo
👉 Ejecuta: `npm run dev -- -p 3004`

### **"No puedo ingresar"**
❌ Credenciales incorrectas
👉 Verifica que el usuario y contraseña sean correctos

---

## 📚 **Documentación Completa**

Para más detalles, lee:
- `SISTEMA_3_NIVELES.md` - Explicación completa del sistema
- `AUTENTICACION.md` - Detalles técnicos de autenticación
- `SISTEMA_COMPLETO.md` - Funcionalidades del sistema

---

## 🎊 **¡Listo para Usar!**

Tu sistema hospitalario está **100% funcional** con:
- 👑 Control total como administrador
- 👨‍⚕️ Portal médico profesional
- 🧑‍⚤️ Auto-registro de pacientes
- 🔐 Seguridad completa

**¡Empieza a gestionar tu hospital ahora! 🏥**

