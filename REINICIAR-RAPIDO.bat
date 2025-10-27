@echo off
cls
echo =============================================
echo   REINICIO RAPIDO - SISTEMA HOSPY OPTIMIZADO
echo =============================================
echo.

echo [1/3] Matando servidor en puerto 3004...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul
echo      OK - Servidor detenido

echo.
echo [2/3] Limpiando cache de Next.js...
if exist .next rmdir /s /q .next >nul 2>&1
echo      OK - Cache limpiado

echo.
echo [3/3] Iniciando servidor optimizado...
start cmd /k "npm run dev -- -p 3004"
echo      OK - Servidor iniciando...

echo.
echo =============================================
echo   LISTO! Espera 5 segundos y ve a:
echo   http://localhost:3004
echo =============================================
echo.
timeout /t 2 /nobreak >nul
exit

