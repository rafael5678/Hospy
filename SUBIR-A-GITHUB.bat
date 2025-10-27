@echo off
cls
echo ========================================
echo   SUBIENDO PROYECTO HOSPY A GITHUB
echo ========================================
echo.
echo Repositorio: https://github.com/rafael5678/Hospy.git
echo.

echo [1/6] Inicializando Git...
git init
if errorlevel 1 (
    echo ERROR: No se pudo inicializar Git
    pause
    exit /b 1
)
echo      OK!

echo.
echo [2/6] Agregando todos los archivos...
git add .
echo      OK!

echo.
echo [3/6] Creando commit inicial...
git commit -m "Sistema Hospy completo - Hospital Management System"
echo      OK!

echo.
echo [4/6] Cambiando a rama main...
git branch -M main
echo      OK!

echo.
echo [5/6] Conectando con GitHub...
git remote add origin https://github.com/rafael5678/Hospy.git
if errorlevel 1 (
    echo El remoto ya existe, actualizando...
    git remote set-url origin https://github.com/rafael5678/Hospy.git
)
echo      OK!

echo.
echo [6/6] Subiendo a GitHub...
git push -u origin main
if errorlevel 1 (
    echo.
    echo NOTA: Si te pide credenciales, ingresalas.
    echo Si falla, puede que necesites usar un token de GitHub.
    echo.
    pause
)

echo.
echo ========================================
echo   PROYECTO SUBIDO EXITOSAMENTE!
echo ========================================
echo.
echo Ve a: https://github.com/rafael5678/Hospy
echo.
pause

