@echo off
echo ========================================
echo Creando archivo .env.local...
echo ========================================
echo.

(
echo MONGODB_URI=mongodb://localhost:27017/hospy
echo NEXT_PUBLIC_APP_URL=http://localhost:3004
) > .env.local

echo.
echo ✅ Archivo .env.local creado exitosamente!
echo.
echo Contenido:
type .env.local
echo.
echo ========================================
echo Ahora ejecuta: npm install
echo Luego ejecuta: npm run dev -- -p 3004
echo ========================================
pause

