# 📂 Estructura del Proyecto Hospy

Guía completa de la estructura de archivos y carpetas del proyecto.

## 📁 Estructura General

```
hospy/
├── 📁 app/                      # Directorio principal de Next.js (App Router)
│   ├── 📁 api/                  # API Routes (Backend)
│   ├── 📁 patients/             # Páginas de gestión de pacientes
│   ├── 📁 statistics/           # Página de estadísticas
│   ├── 📁 medical-history/      # Página de historial médico
│   ├── 📁 settings/             # Página de configuración
│   ├── 📄 layout.tsx            # Layout principal (Sidebar + Header)
│   ├── 📄 page.tsx              # Dashboard (página principal)
│   └── 📄 globals.css           # Estilos globales de Tailwind
│
├── 📁 components/               # Componentes reutilizables
│   ├── 📄 Sidebar.tsx           # Barra lateral de navegación
│   ├── 📄 Header.tsx            # Encabezado superior
│   └── 📄 StatCard.tsx          # Tarjeta de estadística
│
├── 📁 lib/                      # Utilidades y configuraciones
│   └── 📄 mongodb.ts            # Conexión a MongoDB
│
├── 📁 models/                   # Modelos de Mongoose (Esquemas)
│   └── 📄 Patient.ts            # Modelo de Paciente
│
├── 📁 node_modules/             # Dependencias (generado automáticamente)
│
├── 📄 .env.local                # Variables de entorno (CREAR MANUALMENTE)
├── 📄 .env.example              # Ejemplo de variables de entorno
├── 📄 .eslintrc.json            # Configuración de ESLint
├── 📄 .gitignore                # Archivos ignorados por Git
├── 📄 DEPLOYMENT.md             # Guía de despliegue en Vercel
├── 📄 next.config.js            # Configuración de Next.js
├── 📄 next-env.d.ts             # Tipos de Next.js
├── 📄 package.json              # Dependencias y scripts
├── 📄 package-lock.json         # Lock de dependencias
├── 📄 postcss.config.js         # Configuración de PostCSS
├── 📄 QUICKSTART.md             # Guía de inicio rápido
├── 📄 README.md                 # Documentación principal
├── 📄 SETUP.md                  # Instrucciones de configuración
├── 📄 tailwind.config.ts        # Configuración de Tailwind CSS
├── 📄 tsconfig.json             # Configuración de TypeScript
└── 📄 vercel.json               # Configuración de Vercel
```

## 📂 Detalle de Carpetas Principales

### 1. 📁 app/ - Rutas y Páginas

Next.js 14 usa el "App Router", donde la estructura de carpetas define las rutas.

```
app/
├── api/                          # Backend API
│   └── patients/                 # Endpoints de pacientes
│       ├── route.ts              # /api/patients (GET, POST)
│       ├── [id]/                 # Rutas dinámicas
│       │   └── route.ts          # /api/patients/:id (GET, PUT, DELETE)
│       └── stats/
│           └── route.ts          # /api/patients/stats (GET)
│
├── patients/                     # Frontend - Gestión de pacientes
│   ├── page.tsx                  # /patients (Lista)
│   ├── new/
│   │   └── page.tsx              # /patients/new (Nuevo)
│   └── [id]/                     # Rutas dinámicas
│       ├── page.tsx              # /patients/:id (Detalles)
│       └── edit/
│           └── page.tsx          # /patients/:id/edit (Editar)
│
├── statistics/
│   └── page.tsx                  # /statistics
│
├── medical-history/
│   └── page.tsx                  # /medical-history
│
├── settings/
│   └── page.tsx                  # /settings
│
├── layout.tsx                    # Layout raíz (aplicado a todas las páginas)
├── page.tsx                      # / (Dashboard principal)
└── globals.css                   # Estilos globales
```

### 2. 📁 components/ - Componentes Reutilizables

Componentes de UI que se usan en múltiples páginas.

```
components/
├── Sidebar.tsx                   # Navegación lateral
├── Header.tsx                    # Barra superior con búsqueda
└── StatCard.tsx                  # Tarjeta de estadística para dashboard
```

**¿Cuándo crear un componente?**
- Si un código se repite en más de 2 lugares
- Si una pieza de UI es compleja y autocontenida
- Si quieres mejorar la legibilidad del código

### 3. 📁 lib/ - Utilidades

Funciones de ayuda, configuraciones y utilidades.

```
lib/
└── mongodb.ts                    # Conexión singleton a MongoDB
```

**¿Qué va aquí?**
- Configuraciones de servicios externos
- Funciones de utilidad comunes
- Helpers de autenticación
- Formatters de datos

### 4. 📁 models/ - Modelos de Base de Datos

Esquemas de Mongoose que definen la estructura de datos.

```
models/
└── Patient.ts                    # Esquema del modelo Paciente
```

**¿Qué es un modelo?**
- Define la estructura de una colección en MongoDB
- Incluye tipos de datos y validaciones
- Métodos y hooks del modelo

## 📄 Archivos de Configuración Importantes

### `package.json`
```json
{
  "scripts": {
    "dev": "next dev",           // Desarrollo
    "build": "next build",       // Construir para producción
    "start": "next start",       // Iniciar en producción
    "lint": "next lint"          // Verificar código
  },
  "dependencies": { ... }         // Dependencias del proyecto
}
```

### `tsconfig.json`
Configuración de TypeScript:
- Qué archivos compilar
- Alias de rutas (@/* = ./*)
- Opciones del compilador

### `tailwind.config.ts`
Configuración de Tailwind CSS:
- Dónde buscar clases
- Colores personalizados
- Plugins

### `next.config.js`
Configuración de Next.js:
- Dominios de imágenes permitidos
- Variables de entorno
- Redirects y rewrites

### `.env.local` (Crear manualmente)
Variables de entorno sensibles:
```env
MONGODB_URI=...
NEXT_PUBLIC_APP_URL=...
```

**NUNCA** subir a Git (está en .gitignore)

## 🔄 Flujo de Datos

### Crear un Paciente

```
┌─────────────┐
│ Frontend    │
│ (Form)      │
└──────┬──────┘
       │ POST /api/patients
       │ { firstName, lastName, ... }
       ▼
┌─────────────┐
│ API Route   │
│ route.ts    │
└──────┬──────┘
       │ Patient.create()
       ▼
┌─────────────┐
│ Mongoose    │
│ Patient.ts  │
└──────┬──────┘
       │ Validación + Guardado
       ▼
┌─────────────┐
│ MongoDB     │
│ (Database)  │
└─────────────┘
```

### Obtener Pacientes

```
┌─────────────┐
│ Frontend    │
│ page.tsx    │
└──────┬──────┘
       │ GET /api/patients
       ▼
┌─────────────┐
│ API Route   │
│ route.ts    │
└──────┬──────┘
       │ Patient.find()
       ▼
┌─────────────┐
│ MongoDB     │
│ (Database)  │
└──────┬──────┘
       │ Datos
       ▼
┌─────────────┐
│ Frontend    │
│ Renderiza   │
└─────────────┘
```

## 🎯 Convenciones de Nombres

### Archivos
- **Componentes**: `PascalCase.tsx` (ej: `Sidebar.tsx`)
- **Páginas**: `page.tsx` (Next.js App Router)
- **API Routes**: `route.ts` (Next.js App Router)
- **Utilidades**: `camelCase.ts` (ej: `mongodb.ts`)
- **Modelos**: `PascalCase.ts` (ej: `Patient.ts`)

### Carpetas
- **Rutas**: `kebab-case` (ej: `medical-history/`)
- **Dinámicas**: `[id]` o `[slug]` (Next.js)

### Variables y Funciones
- **Variables**: `camelCase` (ej: `const patientData`)
- **Constantes**: `UPPER_SNAKE_CASE` (ej: `const API_URL`)
- **Funciones**: `camelCase` (ej: `function fetchPatients()`)
- **Componentes**: `PascalCase` (ej: `function StatCard()`)

## 🚀 Agregar Nueva Funcionalidad

### Ejemplo: Agregar módulo de "Citas"

1. **Crear Modelo**
   ```
   models/Appointment.ts
   ```

2. **Crear API Routes**
   ```
   app/api/appointments/
   ├── route.ts              # GET, POST
   └── [id]/route.ts         # GET, PUT, DELETE
   ```

3. **Crear Páginas**
   ```
   app/appointments/
   ├── page.tsx              # Lista
   ├── new/page.tsx          # Nueva cita
   └── [id]/page.tsx         # Detalles
   ```

4. **Agregar al Sidebar**
   ```typescript
   // components/Sidebar.tsx
   { name: 'Citas', icon: Calendar, href: '/appointments' }
   ```

## 📚 Recursos Adicionales

- **Next.js App Router:** https://nextjs.org/docs/app
- **Mongoose Schemas:** https://mongoosejs.com/docs/guide.html
- **Tailwind Components:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs/

---

**¿Necesitas agregar algo al proyecto? ¡Sigue esta estructura!**

