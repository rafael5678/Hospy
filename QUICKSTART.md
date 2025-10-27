# 🚀 Inicio Rápido - Hospy

Comienza a usar Hospy en 5 minutos.

## ⚡ Instalación Rápida

```bash
# 1. Clonar el proyecto
git clone <tu-repositorio>
cd hospy

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear archivo .env.local con:
MONGODB_URI=mongodb://localhost:27017/hospy
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 4. Iniciar MongoDB (si usas local)
# Windows: net start MongoDB
# Mac/Linux: mongod

# 5. Ejecutar la aplicación
npm run dev

# 6. Abrir en navegador
# http://localhost:3000
```

## 📋 Checklist de Configuración

- [ ] Node.js 18+ instalado
- [ ] MongoDB instalado o cuenta en MongoDB Atlas
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env.local` creado con las variables correctas
- [ ] MongoDB corriendo
- [ ] Aplicación corriendo en http://localhost:3000

## 🎯 Primeros Pasos

### 1. Explorar el Dashboard
- Abre http://localhost:3000
- Verás el dashboard principal con estadísticas (inicialmente en 0)

### 2. Registrar tu Primer Paciente
- Haz clic en "Nuevo Paciente" en el sidebar
- Completa el formulario
- Haz clic en "Registrar Paciente"

### 3. Ver Lista de Pacientes
- Ve a "Pacientes" en el sidebar
- Verás la tabla con todos los pacientes
- Usa la búsqueda para filtrar

### 4. Ver Detalles de un Paciente
- Haz clic en el ícono de "ojo" 👁️ en cualquier paciente
- Verás toda la información detallada

### 5. Editar un Paciente
- En la página de detalles, haz clic en "Editar"
- Modifica la información
- Guarda los cambios

## 🗄️ Opciones de Base de Datos

### Opción 1: MongoDB Local (Desarrollo)

```env
MONGODB_URI=mongodb://localhost:27017/hospy
```

### Opción 2: MongoDB Atlas (Producción)

1. Crear cuenta gratis en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cluster
3. Obtener cadena de conexión
4. Actualizar `.env.local`:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/hospy
```

## 🌐 Despliegue Rápido en Vercel

```bash
# 1. Subir a GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <tu-repo-url>
git push -u origin main

# 2. Ir a Vercel.com
# 3. Importar proyecto desde GitHub
# 4. Agregar variable de entorno MONGODB_URI
# 5. Deploy!
```

## 📚 Documentación Completa

- [README.md](./README.md) - Documentación completa
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía detallada de despliegue

## 🆘 Problemas Comunes

### Error: "Cannot connect to database"
- Verifica que MongoDB esté corriendo
- Verifica la variable `MONGODB_URI` en `.env.local`

### Error: "Module not found"
- Ejecuta `npm install` nuevamente

### Puerto 3000 ocupado
- Usa otro puerto: `npm run dev -- -p 3001`

## 🎉 ¡Listo!

Tu sistema hospitalario está funcionando. Ahora puedes:
- ✅ Registrar pacientes
- ✅ Ver y buscar pacientes
- ✅ Editar información
- ✅ Ver estadísticas
- ✅ Y mucho más...

---

**¿Necesitas ayuda?** Revisa la documentación completa en [README.md](./README.md)

