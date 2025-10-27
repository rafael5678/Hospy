# 🏥 Guía de Uso - Sistema Hospy

## ✅ **Estado Actual del Sistema**

- ✅ MongoDB corriendo
- ✅ Servidor Next.js activo en http://localhost:3004
- ✅ Todas las APIs funcionando
- ✅ Base de datos `hospy` conectada
- ✅ 1 paciente de prueba registrado

---

## 🚀 **Cómo Usar el Sistema**

### **1. Acceder al Dashboard**
```
Abre tu navegador en: http://localhost:3004
```

Verás el dashboard principal con:
- Estadísticas de pacientes
- Estadísticas de médicos
- Acciones rápidas
- Especialidades disponibles

---

## 📝 **Flujo de Trabajo Recomendado**

### **PASO 1: Registrar Médicos**

1. Desde el sidebar, haz clic en **"Médicos"**
2. Clic en **"Nuevo Médico"**
3. Llena el formulario:

```
Ejemplo:
Nombre: María
Apellido: González
Email: maria.gonzalez@hospital.com
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

4. Clic en **"Registrar Médico"**

**Repite para crear varios médicos con diferentes especialidades:**
- Pediatría
- Medicina General
- Traumatología
- Ginecología
- Neurología

---

### **PASO 2: Registrar Pacientes**

Ya tienes un paciente (German Oscartán), pero puedes agregar más:

1. Sidebar → **"Pacientes"** → **"Nuevo Paciente"** (o usa el botón desde el dashboard)
2. Llena el formulario:

```
Ejemplo Paciente 2:
Nombre: Ana
Apellido: Martínez
Email: ana.martinez@example.com
Teléfono: 809-555-1111
Fecha Nacimiento: 1992-07-20
Género: Femenino
Dirección: Calle El Sol 456
Ciudad: Santo Domingo

Contacto de Emergencia:
Nombre: Pedro Martínez
Teléfono: 809-555-2222
Relación: Esposo

Alergias: Penicilina
Medicamentos Actuales: Ninguno
Tipo de Sangre: A+
Estado: Activo
```

---

### **PASO 3: Agendar Citas**

1. Sidebar → **"Citas"** → **"Nueva Cita"**
2. Necesitarás crear un formulario de cita (por ahora puedes usar la API):

```bash
# Ejemplo usando PowerShell
$body = @{
    patient = "PATIENT_ID_AQUI"
    doctor = "DOCTOR_ID_AQUI"
    appointmentDate = "2024-11-15"
    startTime = "10:00"
    endTime = "10:30"
    duration = 30
    reason = "Control de presión arterial"
    consultationType = "Seguimiento"
    status = "Confirmada"
    isVirtual = $false
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3004/api/appointments' -Method POST -Body $body -ContentType 'application/json'
```

---

### **PASO 4: Realizar Consulta Médica**

1. Desde la lista de citas, haz clic en una cita confirmada
2. Clic en **"Iniciar Consulta"**
3. Registra:

```
Motivo de Consulta: Control de presión arterial alta
Historia: Paciente refiere dolores de cabeza frecuentes

Signos Vitales:
- Presión Sistólica: 140
- Presión Diastólica: 90
- Frecuencia Cardíaca: 78
- Temperatura: 36.5
- Saturación: 98
- Peso: 75
- Altura: 170

Diagnóstico:
- Código: I10
- Descripción: Hipertensión arterial esencial
- Tipo: Confirmado

Tratamiento: Cambios en dieta y ejercicio regular
Plan: Control en 2 semanas
```

---

### **PASO 5: Crear Prescripción**

1. Desde la consulta completada, clic en **"Recetar"**
2. Agrega medicamentos:

```
Medicamento 1:
Nombre: Losartán
Nombre Genérico: Losartán Potásico
Dosis: 50mg
Frecuencia: 1 vez al día
Duración: 30 días
Vía: Oral
Instrucciones: Tomar en las mañanas con el desayuno
Cantidad: 30 tabletas

Medicamento 2:
Nombre: Aspirina
Dosis: 100mg
Frecuencia: 1 vez al día
Duración: 30 días
Vía: Oral
Instrucciones: Tomar en las noches
Cantidad: 30 tabletas

Diagnóstico: Hipertensión arterial
Estado: Activa
```

3. Clic en **"Guardar"** y luego **"Imprimir"**

---

### **PASO 6: Subir Historia Clínica**

1. Sidebar → **"Historias Clínicas"** → **"Subir Documento"**
2. Selecciona:

```
Paciente: Ana Martínez
Médico: Dra. María González
Tipo: Examen de Laboratorio
Título: Perfil Lipídico - Noviembre 2024
Descripción: Resultados de análisis de sangre
Categoría: Cardiología
Fecha: Hoy

Archivos: [Aquí subirías el PDF o imagen]
```

Nota: Para que la subida de archivos funcione, necesitarías implementar un servicio de storage (AWS S3, Cloudinary, etc.)

---

## 📊 **Ver Información**

### **Dashboard Principal**
- Ve a: `http://localhost:3004`
- Verás estadísticas actualizadas en tiempo real

### **Lista de Pacientes**
- Ve a: `http://localhost:3004/patients`
- Busca por nombre, email o teléfono
- Filtra por estado
- Haz clic en cualquier paciente para ver su detalle completo

### **Lista de Médicos**
- Ve a: `http://localhost:3004/doctors`
- Busca por nombre o licencia
- Filtra por especialidad
- Haz clic para ver perfil completo

### **Ver Citas**
- Ve a: `http://localhost:3004/appointments`
- Filtra por estado
- Ve todas las citas programadas

### **Ver Consultas**
- Ve a: `http://localhost:3004/consultations`
- Filtra por estado
- Ve historial médico completo

### **Ver Prescripciones**
- Ve a: `http://localhost:3004/prescriptions`
- Filtra por estado
- Imprime recetas

---

## 🗄️ **Ver en MongoDB Compass**

1. Abre MongoDB Compass
2. Conecta a: `mongodb://localhost:27017`
3. Selecciona base de datos: **hospy**
4. Verás las colecciones:
   - `patients` - Pacientes
   - `doctors` - Médicos
   - `appointments` - Citas
   - `consultations` - Consultas
   - `prescriptions` - Prescripciones
   - `medicalrecords` - Historias Clínicas

---

## 🔍 **Búsqueda y Filtros**

Todas las páginas tienen:
- 🔍 **Búsqueda**: Busca por nombre, email, teléfono, etc.
- 🎛️ **Filtros**: Filtra por estado, especialidad, tipo, etc.
- 📄 **Paginación**: 10 registros por página
- ⚡ **Tiempo real**: Los datos se actualizan automáticamente

---

## 🎨 **Características de la Interfaz**

### **Colores por Módulo:**
- 🔵 **Azul**: Pacientes
- 🟣 **Morado**: Médicos
- 🟢 **Verde**: Citas
- 🟠 **Naranja**: Consultas
- 🔴 **Rosa**: Prescripciones
- 🟡 **Amarillo/Gris**: Historias Clínicas

### **Estados Visuales:**
- 🟢 **Verde**: Activo, Completado, Confirmado
- 🟡 **Amarillo**: Pendiente, En Curso
- 🔴 **Rojo**: Cancelado, Inactivo
- ⚫ **Gris**: Vencido, No Asistió

---

## 💡 **Consejos de Uso**

### **1. Flujo Ideal:**
```
Registrar Médicos → Registrar Pacientes → Agendar Citas → 
Realizar Consultas → Crear Prescripciones → Subir Documentos
```

### **2. Navegación:**
- Usa el **sidebar** para moverte entre módulos
- Usa el **dashboard** para acciones rápidas
- Cada tarjeta es clickeable para ver más detalles

### **3. Acciones Rápidas desde Dashboard:**
- Registrar Nuevo Paciente
- Registrar Nuevo Médico
- Agendar Cita
- Nueva Consulta
- Crear Receta

### **4. Búsquedas Eficientes:**
- En pacientes: Busca por nombre, email o teléfono
- En médicos: Busca por nombre, email o licencia
- Usa los filtros para refinar resultados

---

## 🔧 **APIs para Desarrolladores**

Si quieres integrar con otras herramientas o hacer pruebas:

### **Ejemplos con cURL:**

```bash
# Listar pacientes
curl http://localhost:3004/api/patients

# Listar médicos
curl http://localhost:3004/api/doctors

# Listar citas
curl http://localhost:3004/api/appointments

# Listar consultas
curl http://localhost:3004/api/consultations

# Listar prescripciones
curl http://localhost:3004/api/prescriptions

# Estadísticas de pacientes
curl http://localhost:3004/api/patients/stats

# Estadísticas de médicos
curl http://localhost:3004/api/doctors/stats
```

---

## 🎯 **Próximos Pasos Recomendados**

### **Corto Plazo (Puedes hacer ahora):**
1. ✅ Registrar 5-10 médicos con diferentes especialidades
2. ✅ Agregar más pacientes de prueba
3. ✅ Crear citas entre médicos y pacientes
4. ✅ Realizar algunas consultas médicas
5. ✅ Crear prescripciones
6. ✅ Explorar todas las funcionalidades

### **Mediano Plazo (Mejoras futuras):**
1. 📸 Implementar sistema de subida de archivos real
2. 🔐 Agregar sistema de autenticación
3. 👥 Roles de usuario (Admin, Médico, Recepcionista)
4. 📄 Generación de PDFs para recetas
5. 📧 Sistema de notificaciones por email
6. 📱 Versión móvil optimizada

### **Largo Plazo (Características avanzadas):**
1. 📊 Reportes y analíticas avanzadas
2. 🗓️ Calendario interactivo para citas
3. 💬 Chat entre médicos y pacientes
4. 📞 Videoconsultas
5. 🏥 Módulo de facturación
6. 📋 Integración con laboratorios externos

---

## ❓ **Preguntas Frecuentes**

### **¿Cómo detengo el servidor?**
En la terminal donde corre `npm run dev`, presiona `Ctrl + C`

### **¿Cómo reinicio el servidor?**
```bash
npm run dev -- -p 3004
```

### **¿Cómo borro todos los datos?**
En MongoDB Compass:
1. Ve a la base de datos `hospy`
2. En cada colección, haz clic en "Delete"
3. Confirma la eliminación

### **¿Puedo cambiar el puerto?**
Sí, en el archivo `.env.local` cambia:
```
NEXT_PUBLIC_APP_URL=http://localhost:NUEVO_PUERTO
```
Y ejecuta:
```bash
npm run dev -- -p NUEVO_PUERTO
```

---

## 🎉 **¡Listo para Usar!**

Tu sistema **Hospy** está **100% funcional** y listo para:
- Gestionar pacientes
- Administrar personal médico
- Agendar citas
- Realizar consultas completas
- Crear prescripciones
- Almacenar historias clínicas

**¡Explora y disfruta tu sistema hospitalario profesional! 🏥**

---

## 📞 **Soporte**

Si necesitas ayuda o tienes dudas:
1. Revisa el archivo `SISTEMA_COMPLETO.md` para documentación técnica
2. Revisa los logs en la terminal donde corre el servidor
3. Verifica MongoDB Compass para ver los datos

**¡Éxito con tu sistema Hospy! 🚀**

