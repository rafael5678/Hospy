# 🚀 CONFIGURACIÓN COMPLETA - Hospy

## ✅ ESTADO ACTUAL

- ✅ MongoDB está corriendo correctamente
- ✅ Puerto 3004 está libre y disponible
- ⚠️ Necesitas crear el archivo .env.local

---

## 📋 PASO 1: Crear archivo .env.local

### Opción A: Crear manualmente

1. En la carpeta raíz del proyecto `hospy`, crea un archivo nuevo
2. Nómbralo exactamente: `.env.local` (con el punto al inicio)
3. Copia y pega EXACTAMENTE esto:

```env
MONGODB_URI=mongodb://localhost:27017/hospy
NEXT_PUBLIC_APP_URL=http://localhost:3004
```

4. Guarda el archivo

### Opción B: Usar comandos

Ejecuta este comando en tu terminal:

```cmd
(echo MONGODB_URI=mongodb://localhost:27017/hospy && echo NEXT_PUBLIC_APP_URL=http://localhost:3004) > .env.local
```

---

## 🗄️ PASO 2: Configurar MongoDB Compass

### 2.1 Abrir MongoDB Compass

1. Abre MongoDB Compass
2. Verás una pantalla de conexión

### 2.2 Conectar a MongoDB Local

En la pantalla de conexión, deberías ver:

```
mongodb://localhost:27017
```

**Pasos:**
1. Si ya está la URL arriba, solo haz clic en **"Connect"**
2. Si no está, cópiala y pégala en el campo de conexión
3. Haz clic en **"Connect"**

### 2.3 Crear la Base de Datos

Una vez conectado:

1. En el panel izquierdo, haz clic en **"Create Database"** (botón verde)
2. Llena los campos:
   - **Database Name:** `hospy`
   - **Collection Name:** `patients`
3. Haz clic en **"Create Database"**

¡Listo! Ahora deberías ver tu base de datos `hospy` en el panel izquierdo.

---

## 🚀 PASO 3: Iniciar el Proyecto

### 3.1 Asegúrate de tener las dependencias

Si no has ejecutado esto antes:

```bash
npm install
```

### 3.2 Iniciar el servidor en el puerto 3004

```bash
npm run dev -- -p 3004
```

### 3.3 Abrir en el navegador

Abre tu navegador en:

```
http://localhost:3004
```

---

## ✅ VERIFICACIÓN COMPLETA

### Checklist antes de continuar:

- [ ] MongoDB Compass abierto y conectado a `mongodb://localhost:27017`
- [ ] Base de datos `hospy` creada
- [ ] Colección `patients` creada
- [ ] Archivo `.env.local` creado con las dos variables
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor corriendo (`npm run dev -- -p 3004`)
- [ ] Navegador abierto en `http://localhost:3004`

---

## 🎯 PASO 4: Registrar tu Primer Paciente

1. En el navegador, verás el **Dashboard** de Hospy
2. Haz clic en **"Nuevo Paciente"** (botón azul o en el sidebar)
3. Completa el formulario con datos de prueba:

**Ejemplo de paciente:**
```
Nombre: Juan
Apellido: Pérez
Fecha de Nacimiento: 1990-01-15
Género: Masculino
Teléfono: 809-555-1234
Email: juan.perez@example.com
Dirección: Calle Principal 123
Ciudad: Santo Domingo

Contacto de Emergencia:
  Nombre: María Pérez
  Teléfono: 809-555-5678
  Relación: Esposa

Tipo de Sangre: O+
Alergias: Ninguna (o deja en blanco)
Medicamentos: Ninguno (o deja en blanco)
Estado: Activo
```

4. Haz clic en **"Registrar Paciente"**
5. Deberías ver un mensaje de éxito

### Verificar en MongoDB Compass

1. Ve a MongoDB Compass
2. Navega a: `hospy` → `patients`
3. Haz clic en el ícono de "refresh" o presiona F5
4. ¡Deberías ver tu paciente registrado!

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot connect to database"

**Causa:** MongoDB no está corriendo o la URL es incorrecta

**Solución:**
```bash
# Verificar si MongoDB está corriendo
net start | findstr -i "mongo"

# Si no está corriendo, iniciarlo:
net start MongoDB
```

### Error: "Port already in use"

**Causa:** Otro proceso está usando el puerto

**Solución:**
```bash
# Verificar qué está usando el puerto
netstat -ano | findstr :3004

# Usar otro puerto
npm run dev -- -p 3005
npm run dev -- -p 8000
```

### Error: "Module not found"

**Causa:** Dependencias no instaladas

**Solución:**
```bash
npm install
```

### No veo los estilos (la página se ve sin diseño)

**Solución:**
1. Detén el servidor (Ctrl+C)
2. Borra la carpeta `.next`:
   ```bash
   rmdir /s /q .next
   ```
3. Ejecuta de nuevo:
   ```bash
   npm run dev -- -p 3004
   ```

### La página carga pero dice "Failed to connect to MongoDB"

**Solución:**
1. Verifica que `.env.local` existe y tiene:
   ```
   MONGODB_URI=mongodb://localhost:27017/hospy
   ```
2. Verifica que MongoDB Compass puede conectarse
3. Reinicia el servidor

---

## 📸 CAPTURAS DE PANTALLA GUÍA

### MongoDB Compass - Conexión
```
┌─────────────────────────────────────────┐
│ New Connection                           │
├─────────────────────────────────────────┤
│ URI: mongodb://localhost:27017          │
│                                          │
│ [Connect]                                │
└─────────────────────────────────────────┘
```

### MongoDB Compass - Crear Base de Datos
```
┌─────────────────────────────────────────┐
│ Create Database                          │
├─────────────────────────────────────────┤
│ Database Name: hospy                     │
│ Collection Name: patients                │
│                                          │
│ [Cancel]  [Create Database]              │
└─────────────────────────────────────────┘
```

### Navegador - Dashboard
```
┌─────────────────────────────────────────┐
│  🏥 Hospy                                │
├─────────────────────────────────────────┤
│  Dashboard                               │
│  Bienvenido al sistema...                │
│                                          │
│  [Total: 0] [Activos: 0] [Hosp.: 0]    │
│                                          │
│  [+ Nuevo Paciente]                      │
└─────────────────────────────────────────┘
```

---

## 🎓 COMANDOS ÚTILES

```bash
# Ver si MongoDB está corriendo
net start | findstr -i "mongo"

# Iniciar MongoDB (si no está corriendo)
net start MongoDB

# Detener MongoDB
net stop MongoDB

# Ver puertos en uso
netstat -ano | findstr :3004

# Instalar dependencias
npm install

# Iniciar proyecto en puerto específico
npm run dev -- -p 3004

# Limpiar cache y reiniciar
rmdir /s /q .next
npm run dev -- -p 3004
```

---

## 📞 AYUDA ADICIONAL

### Si MongoDB Compass no conecta:

1. **Verifica el servicio:**
   ```bash
   net start | findstr -i "mongo"
   ```

2. **Si no está en la lista, instálalo como servicio:**
   - Busca "Services" en Windows
   - Busca "MongoDB Server"
   - Clic derecho → Start

3. **Prueba la conexión desde terminal:**
   ```bash
   mongosh
   ```

### Si el proyecto no inicia:

1. **Verifica Node.js:**
   ```bash
   node --version
   npm --version
   ```

2. **Reinstala dependencias:**
   ```bash
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   ```

3. **Limpia el cache:**
   ```bash
   rmdir /s /q .next
   npm run dev -- -p 3004
   ```

---

## ✨ RESUMEN RÁPIDO

```bash
# 1. Crear .env.local con:
MONGODB_URI=mongodb://localhost:27017/hospy
NEXT_PUBLIC_APP_URL=http://localhost:3004

# 2. Abrir MongoDB Compass
# Conectar a: mongodb://localhost:27017
# Crear base de datos: hospy
# Crear colección: patients

# 3. Instalar y ejecutar
npm install
npm run dev -- -p 3004

# 4. Abrir navegador
http://localhost:3004

# 5. Registrar paciente de prueba
# 6. Verificar en MongoDB Compass
```

---

## 🎉 ¡TODO LISTO!

Una vez que completes estos pasos:

✅ MongoDB estará conectado  
✅ El proyecto correrá en el puerto 3004  
✅ Podrás registrar pacientes  
✅ Verás los datos en MongoDB Compass  
✅ Tendrás un sistema hospitalario funcional  

---

**¡Sigue estos pasos y estarás listo en 5 minutos! 🚀**

**Si tienes algún problema, revisa la sección de "Solución de Problemas" arriba.**

