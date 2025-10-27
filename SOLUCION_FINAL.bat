@echo off
cls
echo ========================================
echo   SOLUCION COMPLETA - SISTEMA HOSPY
echo ========================================
echo.
echo Este proceso tomara 2-3 minutos...
echo.

echo [PASO 1/5] Deteniendo servidor anterior...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3004 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul
echo OK!
echo.

echo [PASO 2/5] Instalando dependencias de autenticacion...
echo (Esto puede tardar 1-2 minutos)
call npm install bcryptjs@2.4.3 jsonwebtoken@9.0.2 js-cookie@3.0.5
call npm install --save-dev @types/bcryptjs@2.4.6 @types/jsonwebtoken@9.0.6
echo OK!
echo.

echo [PASO 3/5] Iniciando servidor...
start /B npm run dev -- -p 3004
echo Esperando 15 segundos a que el servidor inicie...
timeout /t 15 /nobreak
echo OK!
echo.

echo [PASO 4/5] Creando cuenta de administrador...
echo Usuario: admin
echo Contraseña: rafael
echo.

curl -X POST http://localhost:3004/api/auth/admin/setup -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"email\":\"admin@hospy.com\",\"password\":\"rafael\",\"fullName\":\"Administrador Principal\"}" 2>nul

echo.
echo.

echo [PASO 5/5] Verificando login...
curl -X POST http://localhost:3004/api/auth/admin/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"rafael\"}" 2>nul

echo.
echo.
echo ========================================
echo   PROCESO COMPLETADO!
echo ========================================
echo.
echo Credenciales para login:
echo   Usuario: admin
echo   Contraseña: rafael
echo.
echo Accede en: http://localhost:3004/admin/login
echo.
echo Presiona cualquier tecla para salir...
pause >nul

