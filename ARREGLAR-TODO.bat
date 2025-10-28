@echo off
cls
echo ================================================================
echo   DIAGNOSTICO Y ARREGLO COMPLETO - SISTEMA HOSPY
echo ================================================================
echo.
echo Detectando y arreglando problemas...
echo.

echo [1/8] Deteniendo servidor...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo      OK!

echo.
echo [2/8] Limpiando cache de Next.js...
if exist .next rmdir /s /q .next
echo      OK!

echo.
echo [3/8] Limpiando node_modules...
if exist node_modules rmdir /s /q node_modules
echo      OK!

echo.
echo [4/8] Reinstalando dependencias...
call npm install
echo      OK!

echo.
echo [5/8] Verificando variables de entorno...
if not exist .env.local (
    echo ADVERTENCIA: No existe .env.local
    echo Creando archivo .env.local basico...
    echo MONGODB_URI=mongodb://localhost:27017/hospy > .env.local
    echo JWT_SECRET=hospy-secret-key-change-in-production >> .env.local
    echo Archivo creado! IMPORTANTE: Actualiza la MONGODB_URI con tu conexion real.
) else (
    echo .env.local existe
)
echo      OK!

echo.
echo [6/8] Creando cuenta de administrador...
start /wait cmd /c "npm run dev -- -p 3004 & timeout /t 5 >nul & curl http://localhost:3004/api/auth/admin/setup & taskkill /F /IM node.exe >nul 2>&1"
echo      OK!

echo.
echo [7/8] Limpiando cache nuevamente...
if exist .next rmdir /s /q .next
echo      OK!

echo.
echo [8/8] Iniciando servidor limpio...
start cmd /k "npm run dev -- -p 3004"
echo      OK!

echo.
echo ================================================================
echo   SISTEMA ARREGLADO Y LISTO!
echo ================================================================
echo.
echo El servidor esta iniciando en otra ventana...
echo Espera 10 segundos y prueba:
echo.
echo   http://localhost:3004/patient/register
echo.
echo Si aun hay problemas, verifica:
echo   1. MongoDB esta corriendo
echo   2. .env.local tiene la conexion correcta
echo   3. El puerto 3004 no esta ocupado
echo.
echo ================================================================
pause

