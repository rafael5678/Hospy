@echo off
echo ========================================
echo OPTIMIZACION COMPLETA DEL SISTEMA HOSPY
echo ========================================
echo.
echo Este script optimizara todo el sistema para maxima velocidad
echo.
pause

echo.
echo [1/4] Limpiando cache de Next.js...
if exist .next rmdir /s /q .next
echo Cache limpiado!

echo.
echo [2/4] Limpiando node_modules y reinstalando dependencias optimizadas...
if exist node_modules rmdir /s /q node_modules
call npm install --prefer-offline
echo Dependencias instaladas!

echo.
echo [3/4] Matando procesos en puerto 3004...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3004 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
echo Puerto 3004 liberado!

echo.
echo [4/4] Iniciando servidor optimizado...
start cmd /k "npm run dev -- -p 3004"

echo.
echo ========================================
echo OPTIMIZACION COMPLETADA!
echo El servidor se esta iniciando en otra ventana
echo Espera 10 segundos y ve a: http://localhost:3004
echo ========================================
pause

