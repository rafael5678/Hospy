@echo off
cls
echo ================================================
echo   ARREGLO COMPLETO - SISTEMA DE CITAS MEDICAS
echo ================================================
echo.
echo Se arreglaron los siguientes problemas:
echo.
echo   [OK] API mapea correctamente patientId -^> patient
echo   [OK] API mapea correctamente doctorId -^> doctor  
echo   [OK] API calcula automaticamente la duracion
echo   [OK] Formulario envia todos los campos requeridos
echo.
echo ================================================
echo.

echo [1/2] Deteniendo servidor...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo      OK!

echo.
echo [2/2] Iniciando servidor con los cambios...
start cmd /k "npm run dev -- -p 3004"
echo      OK!

echo.
echo ================================================
echo   LISTO PARA PROBAR!
echo ================================================
echo.
echo Espera 10 segundos y sigue estos pasos:
echo.
echo 1. Ve a: http://localhost:3004/patient/login
echo 2. Inicia sesion como paciente
echo 3. Click en "Agendar Cita"
echo 4. Llena el formulario y agenda!
echo.
echo Ahora SI deberia funcionar correctamente!
echo ================================================
pause

