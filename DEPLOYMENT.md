# 🚀 Guía de Despliegue - Hospy

Esta guía te ayudará a desplegar tu aplicación Hospy en Vercel paso a paso.

## 📋 Requisitos Previos

1. ✅ Cuenta de GitHub
2. ✅ Cuenta de Vercel (gratis)
3. ✅ Cuenta de MongoDB Atlas (gratis)
4. ✅ Proyecto funcionando localmente

## 🗄️ Paso 1: Configurar MongoDB Atlas

### 1.1 Crear Cuenta en MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Haz clic en "Try Free"
3. Regístrate con tu correo o cuenta de Google
4. Completa la encuesta inicial

### 1.2 Crear un Cluster

1. Selecciona "M0 Sandbox" (Gratis)
2. Elige una región cercana (ej: AWS / Virginia)
3. Nombre del cluster: `Hospy` (o el que prefieras)
4. Haz clic en "Create Cluster"

### 1.3 Configurar Acceso a la Base de Datos

**Crear Usuario:**
1. En el menú lateral, ve a "Database Access"
2. Haz clic en "Add New Database User"
3. Método de autenticación: Password
4. Username: `hospyuser` (o el que prefieras)
5. Password: Genera una contraseña segura (guárdala)
6. Database User Privileges: "Read and write to any database"
7. Haz clic en "Add User"

**Configurar IP Whitelist:**
1. En el menú lateral, ve a "Network Access"
2. Haz clic en "Add IP Address"
3. Haz clic en "Allow Access from Anywhere" (0.0.0.0/0)
4. Haz clic en "Confirm"

⚠️ Nota: Para producción, es mejor configurar IPs específicas.

### 1.4 Obtener Cadena de Conexión

1. Ve a "Database" en el menú lateral
2. Haz clic en "Connect" en tu cluster
3. Selecciona "Connect your application"
4. Driver: Node.js
5. Copia la cadena de conexión, se verá así:

```
mongodb+srv://hospyuser:<password>@hospy.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. Reemplaza `<password>` con tu contraseña real
7. Añade el nombre de la base de datos después de `.net/`:

```
mongodb+srv://hospyuser:tu_password@hospy.xxxxx.mongodb.net/hospy?retryWrites=true&w=majority
```

✅ Guarda esta cadena, la necesitarás para Vercel

## 🔄 Paso 2: Subir Código a GitHub

### 2.1 Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com)
2. Haz clic en el "+" en la esquina superior derecha
3. Selecciona "New repository"
4. Nombre: `hospy`
5. Descripción: "Sistema de Gestión Hospitalaria"
6. Público o Privado (tu elección)
7. NO inicialices con README (ya tienes uno)
8. Haz clic en "Create repository"

### 2.2 Subir tu Código

En tu terminal, dentro de la carpeta del proyecto:

```bash
# Inicializar Git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: Sistema Hospy completo"

# Conectar con GitHub (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/hospy.git

# Subir código
git branch -M main
git push -u origin main
```

✅ Tu código ya está en GitHub

## 🚀 Paso 3: Desplegar en Vercel

### 3.1 Crear Cuenta en Vercel

1. Ve a [Vercel](https://vercel.com)
2. Haz clic en "Sign Up"
3. Selecciona "Continue with GitHub"
4. Autoriza Vercel a acceder a tu GitHub

### 3.2 Importar Proyecto

1. En el Dashboard de Vercel, haz clic en "Add New..."
2. Selecciona "Project"
3. Busca tu repositorio `hospy`
4. Haz clic en "Import"

### 3.3 Configurar Proyecto

**Framework Preset:** Next.js (debería detectarse automáticamente)

**Root Directory:** `./` (dejar por defecto)

**Build Command:** `next build` (dejar por defecto)

**Output Directory:** `.next` (dejar por defecto)

### 3.4 Agregar Variables de Entorno

¡IMPORTANTE! Antes de hacer clic en "Deploy":

1. Expande la sección "Environment Variables"
2. Agrega las siguientes variables:

**Variable 1:**
- Name: `MONGODB_URI`
- Value: Tu cadena de conexión de MongoDB Atlas
- Environment: All (Production, Preview, Development)

**Variable 2:**
- Name: `NEXT_PUBLIC_APP_URL`
- Value: Lo dejaremos en blanco por ahora, lo actualizaremos después

### 3.5 Desplegar

1. Haz clic en "Deploy"
2. Espera 2-3 minutos mientras Vercel construye tu aplicación
3. ¡Listo! Verás confeti cuando termine 🎉

### 3.6 Actualizar URL de la Aplicación

1. Copia la URL que Vercel te dio (ej: `https://hospy-abc123.vercel.app`)
2. Ve a "Settings" → "Environment Variables"
3. Encuentra `NEXT_PUBLIC_APP_URL`
4. Haz clic en el botón de editar (lápiz)
5. Pega tu URL de Vercel
6. Haz clic en "Save"
7. Ve a "Deployments"
8. En el último deployment, haz clic en los tres puntos (⋮)
9. Selecciona "Redeploy"

## ✅ Paso 4: Verificar Despliegue

1. Abre tu URL de Vercel
2. Deberías ver el Dashboard de Hospy
3. Prueba registrar un paciente
4. Verifica que se guarde correctamente

## 🔧 Configuración Adicional (Opcional)

### Dominio Personalizado

1. Ve a "Settings" → "Domains"
2. Ingresa tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

### Variables de Entorno Locales

Crea un archivo `.env.local` para desarrollo local:

```env
MONGODB_URI=mongodb+srv://hospyuser:tu_password@hospy.xxxxx.mongodb.net/hospy
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"

**Solución:**
1. Verifica que la variable `MONGODB_URI` esté correctamente configurada
2. Verifica que la contraseña no tenga caracteres especiales sin codificar
3. Asegúrate de que 0.0.0.0/0 esté en la Network Access de MongoDB Atlas

### Error: "Build Failed"

**Solución:**
1. Verifica que el código compile localmente: `npm run build`
2. Verifica que todas las dependencias estén en `package.json`
3. Revisa los logs de Vercel para más detalles

### La aplicación se despliega pero no muestra datos

**Solución:**
1. Abre las Developer Tools (F12)
2. Ve a la pestaña "Console"
3. Busca errores de conexión a la API
4. Verifica que las variables de entorno estén correctas

## 📊 Monitoreo

### Ver Logs en Vercel

1. Ve a tu proyecto en Vercel
2. Haz clic en "Deployments"
3. Selecciona un deployment
4. Ve a "Functions" para ver logs

### Ver Datos en MongoDB Atlas

1. Ve a tu cluster en MongoDB Atlas
2. Haz clic en "Browse Collections"
3. Verás tu base de datos `hospy` y la colección `patients`

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios en tu código:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

Vercel automáticamente:
1. Detectará los cambios
2. Construirá la nueva versión
3. Desplegará automáticamente

## 🎉 ¡Felicidades!

Tu sistema hospitalario Hospy está ahora en producción y accesible desde cualquier lugar del mundo.

## 📞 Soporte

Si tienes problemas:
1. Revisa la documentación oficial de [Vercel](https://vercel.com/docs)
2. Revisa la documentación de [MongoDB Atlas](https://docs.atlas.mongodb.com/)
3. Busca en los issues del repositorio

---

**¡Tu aplicación está lista para usarse en un hospital real! 🏥**

