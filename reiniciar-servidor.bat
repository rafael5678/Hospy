@echo off
echo ========================================
echo Reiniciando Servidor Hospy
echo ========================================
echo.

echo Deteniendo proceso anterior...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3004 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo.
echo Instalando dependencias...
call npm install

echo.
echo Iniciando servidor en puerto 3004...
echo Abre tu navegador en: http://localhost:3004
echo.
call npm run dev -- -p 3004

