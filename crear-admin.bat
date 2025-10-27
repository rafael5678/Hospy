@echo off
echo ========================================
echo Creando Cuenta de Administrador
echo ========================================
echo.

echo Creando usuario: admin
echo Contraseña: rafael
echo.

powershell -Command "$body = @{ username = 'admin'; email = 'admin@hospy.com'; password = 'rafael'; fullName = 'Administrador Principal' } | ConvertTo-Json; try { $response = Invoke-RestMethod -Uri 'http://localhost:3004/api/auth/admin/setup' -Method POST -Body $body -ContentType 'application/json'; Write-Host 'Cuenta creada exitosamente!' -ForegroundColor Green; Write-Host 'Usuario: admin' -ForegroundColor Cyan; Write-Host 'Contraseña: rafael' -ForegroundColor Cyan; Write-Host 'Accede en: http://localhost:3004/login' -ForegroundColor Yellow } catch { Write-Host 'Error al crear la cuenta. Posiblemente ya existe o el servidor no está corriendo.' -ForegroundColor Red }"

echo.
echo ========================================
echo Presiona cualquier tecla para salir...
pause >nul
