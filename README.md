# 🏥 Sistema Hospy - Hospital Management System

Sistema completo de gestión hospitalaria con autenticación de 3 niveles (Administrador, Doctores y Pacientes).

## 🚀 Características Principales

### 👨‍⚕️ Portal del Doctor
- ✅ Gestión de agenda médica
- ✅ Confirmación/Rechazo de citas
- ✅ Registro de consultas médicas
- ✅ Emisión de recetas
- ✅ Historial completo de pacientes
- ✅ Lista de pacientes asignados

### 👤 Portal del Paciente
- ✅ Agendar citas médicas
- ✅ Ver historial de consultas
- ✅ Ver recetas médicas
- ✅ Gestión de perfil personal
- ✅ Ver estado de citas (Pendiente/Confirmada/Cancelada)

### 🔐 Portal del Administrador
- ✅ Gestión completa de doctores
- ✅ Gestión completa de pacientes
- ✅ Estadísticas del sistema
- ✅ Configuración general

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **Base de Datos**: MongoDB + Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Fechas**: date-fns

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/rafael5678/Hospy.git
cd Hospy
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env.local` en la raíz:
```env
MONGODB_URI=tu_conexion_mongodb
JWT_SECRET=tu_clave_secreta_jwt
```

4. **Crear cuenta de administrador**
```bash
# En Windows:
crear-admin.bat

# O manualmente, ir a:
http://localhost:3004/api/auth/admin/setup
```

5. **Iniciar el servidor**
```bash
npm run dev -- -p 3004
```

6. **Abrir en el navegador**
```
http://localhost:3004
```

## 🔑 Credenciales por Defecto

### Administrador
- Usuario: `admin`
- Contraseña: `rafael`

### Doctores y Pacientes
Se crean desde el panel de administrador.

## 📚 Estructura del Proyecto

```
hospy/
├── app/
│   ├── (dashboard)/          # Rutas con sidebar y header
│   │   ├── patients/         # Gestión de pacientes
│   │   ├── doctors/          # Gestión de doctores
│   │   ├── appointments/     # Gestión de citas
│   │   ├── consultations/    # Gestión de consultas
│   │   └── prescriptions/    # Gestión de recetas
│   ├── admin/                # Portal del administrador
│   ├── doctor/               # Portal del doctor
│   ├── patient/              # Portal del paciente
│   ├── api/                  # API Routes
│   └── login/                # Página de login
├── components/               # Componentes reutilizables
├── lib/                      # Utilidades
├── models/                   # Modelos de MongoDB
└── public/                   # Archivos estáticos
```

## 🎯 Flujo de Trabajo

### Para Pacientes:
1. Registrarse en `/patient/register`
2. Iniciar sesión en `/patient/login`
3. Agendar cita médica con doctor específico
4. Esperar confirmación del doctor
5. Ver historial de consultas y recetas

### Para Doctores:
1. El admin crea la cuenta del doctor
2. Iniciar sesión en `/doctor/login`
3. Ver agenda de citas
4. Confirmar o rechazar citas pendientes
5. Registrar consultas médicas
6. Emitir recetas
7. Ver historial completo de pacientes

### Para Administradores:
1. Iniciar sesión en `/admin/login`
2. Crear cuentas de doctores
3. Gestionar pacientes
4. Ver estadísticas del sistema
5. Configurar el sistema

## 🔒 Seguridad

- ✅ Autenticación JWT
- ✅ Passwords hasheados con bcrypt
- ✅ Validación de permisos por rol
- ✅ Protección de rutas API
- ✅ Variables de entorno seguras

## 📊 Características del Sistema

### Sistema de Citas
- Estados: Pendiente, Confirmada, Cancelada, Completada
- Cálculo automático de duración
- Filtros por fecha y doctor
- Notificaciones de cambio de estado

### Historial Médico
- Información completa del paciente
- Registro de signos vitales
- Historial de consultas
- Historial de recetas
- Alergias y enfermedades crónicas destacadas

### Panel de Estadísticas
- Total de pacientes
- Total de doctores
- Citas por estado
- Consultas realizadas

## 🚀 Scripts Útiles

- `npm run dev -- -p 3004` - Iniciar servidor de desarrollo
- `REINICIAR-RAPIDO.bat` - Reiniciar servidor rápidamente
- `PROBAR-CITAS.bat` - Probar sistema de citas
- `PROBAR-NUEVAS-FUNCIONES.bat` - Probar nuevas funcionalidades
- `SUBIR-A-GITHUB.bat` - Subir cambios a GitHub

## 🎨 Capturas de Pantalla

### Portal de Login
Página principal con selección de tipo de usuario (Admin, Doctor, Paciente).

### Dashboard del Doctor
Vista completa de agenda, pacientes y consultas.

### Historial del Paciente
Visualización organizada por pestañas con toda la información médica.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y de uso exclusivo.

## 👥 Autor

**Rafael**
- GitHub: [@rafael5678](https://github.com/rafael5678)

## 📧 Contacto

Para soporte o preguntas, por favor abre un issue en GitHub.

## 🎉 Agradecimientos

- Next.js por el excelente framework
- MongoDB por la base de datos
- Tailwind CSS por los estilos
- La comunidad de desarrolladores

---

**⚡ Hecho con ❤️ para mejorar la gestión hospitalaria**
