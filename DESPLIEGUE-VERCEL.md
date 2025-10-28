# 🚀 GUÍA DE DESPLIEGUE EN VERCEL - SISTEMA HOSPY

## ✅ PASO 1: CONFIGURAR VARIABLES DE ENTORNO

### En el Dashboard de Vercel:

1. **Ve a tu proyecto en Vercel**
   - https://vercel.com/dashboard

2. **Click en tu proyecto "Hospy"**

3. **Ve a Settings → Environment Variables**

4. **Agrega estas variables:**

```env
MONGODB_URI
Valor: mongodb+srv://usuario:password@tu-cluster.mongodb.net/hospy?retryWrites=true&w=majority
Environment: Production, Preview, Development

JWT_SECRET
Valor: hospy-secret-key-production-2024-super-secret
Environment: Production, Preview, Development
```

⚠️ **IMPORTANTE**: 
- Cambia la `MONGODB_URI` por tu conexión REAL de MongoDB Atlas
- Usa un `JWT_SECRET` fuerte y único para producción

---

## ✅ PASO 2: CONFIGURAR MONGODB ATLAS

### 1. Permitir acceso desde Vercel:

1. **Ve a MongoDB Atlas** (https://cloud.mongodb.com)
2. **Click en Network Access** (en el menú izquierdo)
3. **Click en "Add IP Address"**
4. **Selecciona "Allow Access from Anywhere"** (0.0.0.0/0)
5. **Click en "Confirm"**

⚠️ **Nota**: Esto permite que Vercel (que usa IPs dinámicas) se conecte a tu base de datos.

### 2. Verificar conexión:

1. **Ve a Database → Connect**
2. **Copia tu connection string**
3. **Reemplaza `<password>` con tu contraseña real**
4. **Pégalo en Vercel como `MONGODB_URI`**

---

## ✅ PASO 3: REDESPLIEGA

### En Vercel:

1. **Ve a Deployments**
2. **Click en el despliegue más reciente**
3. **Click en los 3 puntos (•••)**
4. **Click en "Redeploy"**
5. **Espera 1-2 minutos**

---

## ✅ PASO 4: CREAR CUENTA DE ADMINISTRADOR

### Una vez desplegado:

1. **Ve a tu URL de Vercel**: `https://tu-proyecto.vercel.app`

2. **Crea el admin**: Ve a:
   ```
   https://tu-proyecto.vercel.app/api/auth/admin/setup
   ```

3. **Deberías ver**:
   ```json
   {
     "success": true,
     "message": "Admin creado exitosamente",
     "admin": {
       "username": "admin",
       "email": "admin@hospy.com"
     }
   }
   ```

---

## ✅ PASO 5: PROBAR EL SISTEMA

### 1. Login de Administrador:
```
URL: https://tu-proyecto.vercel.app/admin/login
Usuario: admin
Contraseña: rafael
```

### 2. Registrar Paciente:
```
URL: https://tu-proyecto.vercel.app/patient/register
```

### 3. Login de Doctor:
```
URL: https://tu-proyecto.vercel.app/doctor/login
(Primero crea un doctor desde el panel admin)
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Problema 1: "Error connecting to MongoDB"

**Causa**: MongoDB Atlas no permite la conexión desde Vercel

**Solución**:
1. Ve a MongoDB Atlas → Network Access
2. Agrega IP `0.0.0.0/0` (Allow from Anywhere)
3. Espera 1-2 minutos
4. Redespliega en Vercel

---

### Problema 2: "Cannot find module 'bcryptjs'"

**Causa**: Dependencias no instaladas en Vercel

**Solución**:
1. Verifica que `package.json` contenga:
   ```json
   "dependencies": {
     "bcryptjs": "^2.4.3",
     "jsonwebtoken": "^9.0.2",
     ...
   }
   ```
2. Haz commit y push:
   ```bash
   git add package.json
   git commit -m "Fix dependencies"
   git push
   ```

---

### Problema 3: "bad auth : Authentication failed"

**Causa**: Variables de entorno no configuradas en Vercel

**Solución**:
1. Ve a Vercel → Settings → Environment Variables
2. Verifica que `MONGODB_URI` y `JWT_SECRET` estén configuradas
3. Redespliega

---

### Problema 4: "Timeout Error"

**Causa**: MongoDB Atlas tarda mucho en responder

**Solución**:
1. Verifica que tu cluster de MongoDB esté activo
2. Usa un cluster de pago si es necesario (más rápido)
3. Optimiza las queries en el código

---

## 📊 VERIFICACIÓN COMPLETA

### ✅ Checklist antes de desplegar:

- [ ] MongoDB Atlas configurado
- [ ] IP 0.0.0.0/0 permitida en Network Access
- [ ] Connection string copiada
- [ ] Variables de entorno en Vercel:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
- [ ] Código en GitHub actualizado
- [ ] Vercel conectado a GitHub
- [ ] Despliegue exitoso (verde)
- [ ] `/api/auth/admin/setup` ejecutado
- [ ] Login de admin funciona

---

## 🎯 CONFIGURACIÓN ÓPTIMA

### Variables de Entorno en Vercel:

```env
# MongoDB (REQUERIDO)
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/hospy?retryWrites=true&w=majority

# JWT Secret (REQUERIDO)
JWT_SECRET=mi-clave-super-secreta-produccion-2024

# Next.js (OPCIONAL)
NEXT_PUBLIC_API_URL=https://tu-proyecto.vercel.app
```

### Configuración de MongoDB Atlas:

```
Cluster: M0 (Free) o superior
Region: Más cercana a tu ubicación
Network Access: 0.0.0.0/0 (Allow from Anywhere)
Database: hospy
Collections: Se crean automáticamente
```

---

## 🚨 ERRORES COMUNES Y SOLUCIONES

### Error: "MongoServerError: bad auth"

**Significa**: Contraseña incorrecta en MONGODB_URI

**Solución**:
1. Ve a MongoDB Atlas → Database Access
2. Verifica/resetea la contraseña del usuario
3. Actualiza MONGODB_URI en Vercel con la nueva contraseña
4. Redespliega

---

### Error: "ENOTFOUND cluster0.xxxxx.mongodb.net"

**Significa**: URL de MongoDB incorrecta

**Solución**:
1. Ve a MongoDB Atlas → Connect → Connect your application
2. Copia el connection string correcto
3. Actualiza MONGODB_URI en Vercel
4. Redespliega

---

### Error: "Module not found: Can't resolve 'x'"

**Significa**: Falta una dependencia en package.json

**Solución**:
```bash
npm install x --save
git add package.json package-lock.json
git commit -m "Add missing dependency"
git push
```

---

## 💡 TIPS PARA PRODUCCIÓN

### 1. Seguridad:
- ✅ Usa un JWT_SECRET único y fuerte
- ✅ Cambia la contraseña del admin después del primer login
- ✅ No compartas las variables de entorno públicamente

### 2. Performance:
- ✅ Usa un cluster de MongoDB en la región más cercana
- ✅ Habilita caché en Vercel si es posible
- ✅ Optimiza las imágenes

### 3. Monitoreo:
- ✅ Revisa los logs en Vercel → Deployments → View Logs
- ✅ Configura alertas en MongoDB Atlas
- ✅ Usa Vercel Analytics para monitorear performance

---

## 📱 URLS IMPORTANTES

Después del despliegue:

```
🏠 Home: https://tu-proyecto.vercel.app
🔐 Login: https://tu-proyecto.vercel.app/login
👨‍⚕️ Admin: https://tu-proyecto.vercel.app/admin/login
👨‍⚕️ Doctor: https://tu-proyecto.vercel.app/doctor/login
👤 Patient: https://tu-proyecto.vercel.app/patient/login
📝 Register: https://tu-proyecto.vercel.app/patient/register
```

---

## 🎉 ¡LISTO!

Si seguiste todos los pasos, tu sistema Hospy debería estar funcionando en:

**https://tu-proyecto.vercel.app**

### Próximos pasos:

1. ✅ Prueba el login de admin
2. ✅ Crea doctores desde el panel
3. ✅ Prueba el registro de pacientes
4. ✅ Prueba el sistema de citas
5. ✅ Comparte el link con tu equipo

---

## 📞 ¿PROBLEMAS?

Si algo no funciona:

1. **Revisa los logs de Vercel**:
   - Ve a tu proyecto en Vercel
   - Click en "View Function Logs"
   - Busca errores en rojo

2. **Revisa MongoDB Atlas**:
   - Ve a Metrics
   - Verifica que haya conexiones activas

3. **Verifica las variables**:
   - Settings → Environment Variables
   - Asegúrate de que estén bien escritas

---

**¡Tu sistema Hospy está listo para producción! 🏥✨**

