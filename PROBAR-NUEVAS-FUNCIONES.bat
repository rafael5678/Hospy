@echo off
cls
echo ========================================================
echo   NUEVAS FUNCIONALIDADES IMPLEMENTADAS - SISTEMA HOSPY
echo ========================================================
echo.
echo Se implementaron las siguientes funcionalidades:
echo.
echo [1] CONFIRMACION DE CITAS POR EL DOCTOR
echo     - El doctor puede CONFIRMAR citas pendientes
echo     - El doctor puede RECHAZAR citas con razon
echo     - El paciente ve el estado actualizado
echo.
echo [2] HISTORIAL COMPLETO DEL PACIENTE
echo     - Ver informacion personal completa
echo     - Ver todas las citas del paciente
echo     - Ver todas las consultas medicas
echo     - Ver todas las recetas emitidas
echo     - Signos vitales de cada consulta
echo     - Alergias y enfermedades cronicas
echo.
echo ========================================================
echo.

echo [1/2] Reiniciando servidor...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo      OK!

echo.
echo [2/2] Iniciando servidor con nuevas funcionalidades...
start cmd /k "npm run dev -- -p 3004"
echo      OK!

echo.
echo ========================================================
echo   LISTO PARA PROBAR!
echo ========================================================
echo.
echo COMO PROBAR:
echo.
echo A) CONFIRMAR/RECHAZAR CITAS:
echo    1. Ve a: http://localhost:3004/doctor/login
echo    2. Inicia sesion como doctor
echo    3. Click en "Ver Agenda"
echo    4. Veras botones "Confirmar" y "Rechazar" en citas PENDIENTES
echo    5. Confirma o rechaza una cita
echo    6. El paciente vera el cambio en su portal
echo.
echo B) VER HISTORIAL COMPLETO:
echo    1. Ve a: http://localhost:3004/doctor/login
echo    2. Inicia sesion como doctor
echo    3. Click en "Mis Pacientes"
echo    4. Click en "Ver Historial Completo" de cualquier paciente
echo    5. Explora las 4 pestanas: Info, Citas, Consultas, Recetas
echo.
echo C) VERIFICAR COMO PACIENTE:
echo    1. Ve a: http://localhost:3004/patient/login
echo    2. Inicia sesion como paciente
echo    3. Click en "Mis Citas"
echo    4. Veras el estado actualizado de tus citas
echo.
echo ========================================================
pause

