# 🛠️ Configuración Inicial - Hospy

## 📝 Instrucciones de Configuración

### 1. Variables de Entorno

El proyecto necesita variables de entorno para funcionar. Sigue estos pasos:

#### Crear archivo .env.local

En la raíz del proyecto, crea un archivo llamado `.env.local` con el siguiente contenido:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/hospy

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**IMPORTANTE:** 
- ⚠️ NO subas el archivo `.env.local` a GitHub (ya está en .gitignore)
- ✅ Usa el archivo `.env.example` como referencia (puedes copiarlo)

### 2. Opciones de Base de Datos

#### Opción A: MongoDB Local (Recomendado para Desarrollo)

1. **Instalar MongoDB Community Server**
   - Windows: https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: Sigue las instrucciones de MongoDB para tu distribución

2. **Instalar MongoDB Compass (GUI opcional pero recomendado)**
   - Descargar: https://www.mongodb.com/try/download/compass

3. **Iniciar MongoDB**
   - Windows: 
     ```cmd
     net start MongoDB
     ```
   - Mac/Linux:
     ```bash
     brew services start mongodb-community
     # o
     mongod
     ```

4. **Verificar conexión con Compass**
   - Abrir MongoDB Compass
   - Conectar a: `mongodb://localhost:27017`
   - Deberías ver la conexión exitosa

5. **Configurar .env.local**
   ```env
   MONGODB_URI=mongodb://localhost:27017/hospy
   ```

#### Opción B: MongoDB Atlas (Para Producción o si no quieres instalar MongoDB)

1. **Crear cuenta gratuita**
   - Ve a: https://www.mongodb.com/cloud/atlas
   - Regístrate (gratis para siempre)

2. **Crear un Cluster**
   - Selecciona M0 Sandbox (Gratis)
   - Elige región cercana

3. **Configurar acceso**
   - **Database Access**: Crear usuario y contraseña
   - **Network Access**: Agregar IP → "Allow Access from Anywhere"

4. **Obtener cadena de conexión**
   - Haz clic en "Connect"
   - Selecciona "Connect your application"
   - Copia la cadena de conexión

5. **Configurar .env.local**
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/hospy?retryWrites=true&w=majority
   ```
   
   Reemplaza:
   - `usuario` con tu usuario de MongoDB
   - `password` con tu contraseña
   - `cluster` con el nombre de tu cluster

### 3. Instalación de Dependencias

```bash
npm install
```

Esto instalará:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Mongoose
- Lucide React (iconos)
- date-fns (manejo de fechas)

### 4. Ejecutar el Proyecto

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

### 5. Verificar que Todo Funciona

1. ✅ Abre http://localhost:3000
2. ✅ Deberías ver el Dashboard (sin datos aún)
3. ✅ Haz clic en "Nuevo Paciente"
4. ✅ Completa el formulario
5. ✅ Haz clic en "Registrar Paciente"
6. ✅ Deberías ver el mensaje de éxito
7. ✅ Ve a "Pacientes" y verifica que aparece

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

**Causa:** MongoDB no está corriendo o la URL es incorrecta

**Solución:**
1. Verifica que MongoDB esté corriendo:
   - Windows: Abre "Servicios" y busca "MongoDB"
   - Mac/Linux: `brew services list` o `ps aux | grep mongod`

2. Verifica la variable `MONGODB_URI` en `.env.local`

3. Intenta conectarte con MongoDB Compass usando la misma URL

### Error: "Module not found: Can't resolve 'mongoose'"

**Causa:** Dependencias no instaladas

**Solución:**
```bash
npm install
```

### Error: "Port 3000 already in use"

**Causa:** Otro proceso está usando el puerto 3000

**Solución:**
```bash
# Usar otro puerto
npm run dev -- -p 3001

# O encontrar y matar el proceso en 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <numero_de_pid> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

### Error: TypeScript/ESLint errors

**Solución:**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Si persiste, reinicia tu editor (VS Code)
```

### La aplicación carga pero no muestra los estilos

**Solución:**
1. Verifica que `app/globals.css` existe
2. Verifica que `tailwind.config.ts` existe
3. Reinicia el servidor de desarrollo

## 📊 Verificar Datos en MongoDB

### Con MongoDB Compass (GUI)

1. Abrir MongoDB Compass
2. Conectar a tu base de datos
3. Buscar la base de datos "hospy"
4. Ver la colección "patients"
5. Verás todos los pacientes registrados

### Con MongoDB CLI

```bash
# Abrir shell de MongoDB
mongosh

# Ver bases de datos
show dbs

# Usar base de datos hospy
use hospy

# Ver colecciones
show collections

# Ver pacientes
db.patients.find().pretty()
```

## 🚀 Próximos Pasos

Una vez que todo funcione localmente:

1. ✅ Registra algunos pacientes de prueba
2. ✅ Prueba todas las funcionalidades
3. ✅ Lee [DEPLOYMENT.md](./DEPLOYMENT.md) para desplegar en Vercel
4. ✅ Lee [README.md](./README.md) para documentación completa

## 📞 Ayuda Adicional

- **Documentación de Next.js:** https://nextjs.org/docs
- **Documentación de MongoDB:** https://docs.mongodb.com/
- **Documentación de Mongoose:** https://mongoosejs.com/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs

---

**¿Todo funcionando? ¡Genial! Ahora puedes empezar a usar tu sistema hospitalario! 🏥**

