@echo off
echo ========================================
echo   INICIANDO SISTEMA HOSPY COMPLETO
echo ========================================
echo.

echo [1/4] Deteniendo procesos anteriores...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3004 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/4] Instalando dependencias necesarias...
call npm install bcryptjs jsonwebtoken js-cookie @types/bcryptjs @types/jsonwebtoken

echo.
echo [3/4] Iniciando servidor en puerto 3004...
start /B npm run dev -- -p 3004

echo.
echo Esperando que el servidor inicie (15 segundos)...
timeout /t 15 /nobreak

echo.
echo [4/4] Creando cuenta de administrador...
echo Usuario: admin
echo Contraseña: rafael
echo.

powershell -Command "$body = @{ username = 'admin'; email = 'admin@hospy.com'; password = 'rafael'; fullName = 'Administrador Principal' } | ConvertTo-Json; try { $response = Invoke-RestMethod -Uri 'http://localhost:3004/api/auth/admin/setup' -Method POST -Body $body -ContentType 'application/json'; Write-Host '' ; Write-Host '========================================' -ForegroundColor Green; Write-Host '  CUENTA CREADA EXITOSAMENTE!' -ForegroundColor Green; Write-Host '========================================' -ForegroundColor Green; Write-Host '' ; Write-Host 'Credenciales de acceso:' -ForegroundColor Cyan; Write-Host 'Usuario: admin' -ForegroundColor White; Write-Host 'Contraseña: rafael' -ForegroundColor White; Write-Host '' ; Write-Host 'Accede en: http://localhost:3004/login' -ForegroundColor Yellow; Write-Host '' } catch { Write-Host '' ; Write-Host 'Nota: Si ya existe la cuenta, usa las credenciales anteriores.' -ForegroundColor Yellow }"

echo.
echo ========================================
echo   SISTEMA LISTO!
echo ========================================
echo.
echo Abre tu navegador en: http://localhost:3004
echo.
echo Presiona cualquier tecla para salir...
pause >nul

