@echo off
REM Script para ejecutar pruebas automatizadas de Buggy Cars en Windows
REM Autor: Automatización Senior
REM Fecha: 2025-06-23

setlocal EnableDelayedExpansion

echo 🚗 Iniciando Automatización de Pruebas - Buggy Cars Rating
echo ============================================================

if "%1"=="--help" goto :show_help
if "%1"=="--all" goto :run_all
if "%1"=="--criterios" goto :run_criteria
if "%1"=="--adicionales" goto :run_additional
if "%1"=="--docker" goto :run_docker
if "%1"=="--report" goto :run_report
if "%1"=="" goto :run_default

echo ❌ Opción desconocida: %1
goto :show_help

:show_help
echo Uso: %0 [OPCIÓN]
echo.
echo Opciones:
echo   --all           Ejecutar todas las pruebas
echo   --criterios     Ejecutar solo criterios de aceptación
echo   --adicionales   Ejecutar solo pruebas adicionales
echo   --docker        Ejecutar en contenedor Docker
echo   --report        Generar reporte Allure
echo   --help          Mostrar esta ayuda
echo.
echo Ejemplos:
echo   %0 --all
echo   %0 --criterios
echo   %0 --docker
echo.
goto :end

:check_prerequisites
echo 🔍 Verificando prerequisitos...

where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js no está instalado
    echo Descargar desde: https://nodejs.org
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ npm no está instalado
    exit /b 1
)

echo ✅ Prerequisitos verificados
goto :eof

:install_dependencies
echo 📦 Instalando dependencias...
npm install --timeout=300000
if errorlevel 1 (
    echo ❌ Error instalando dependencias
    exit /b 1
)
echo ✅ Dependencias instaladas
goto :eof

:create_directories
echo 📁 Creando directorios necesarios...
if not exist "logs" mkdir logs
if not exist "screenshots" mkdir screenshots
if not exist "allure-results" mkdir allure-results
if not exist "test-results" mkdir test-results
echo ✅ Directorios creados
goto :eof

:run_all
call :check_prerequisites
if errorlevel 1 exit /b 1
call :install_dependencies
if errorlevel 1 exit /b 1
call :create_directories
echo 🧪 Ejecutando todas las pruebas...
npm test
goto :show_results

:run_criteria
call :check_prerequisites
if errorlevel 1 exit /b 1
call :install_dependencies
if errorlevel 1 exit /b 1
call :create_directories
echo 🎯 Ejecutando criterios de aceptación...
npm run test:chrome
goto :show_results

:run_additional
call :check_prerequisites
if errorlevel 1 exit /b 1
call :install_dependencies
if errorlevel 1 exit /b 1
call :create_directories
echo ➕ Ejecutando pruebas adicionales...
npm run test:firefox
goto :show_results

:run_docker
echo 🐳 Ejecutando pruebas en Docker...

where docker >nul 2>nul
if errorlevel 1 (
    echo ❌ Docker no está instalado
    echo Descargar desde: https://www.docker.com/products/docker-desktop
    exit /b 1
)

where docker-compose >nul 2>nul
if errorlevel 1 (
    echo ❌ Docker Compose no está instalado
    exit /b 1
)

docker-compose up --build
goto :show_results

:run_report
echo 📊 Generando reporte Allure...
npm run test:reporte
goto :show_results

:run_default
echo ⚡ Ejecución rápida - Todas las pruebas
call :check_prerequisites
if errorlevel 1 exit /b 1
call :install_dependencies
if errorlevel 1 exit /b 1
call :create_directories
npm test
goto :show_results

:show_results
echo.
echo 🎉 Ejecución completada!
echo 📁 Revisar resultados en:
echo    - Screenshots: .\screenshots\
echo    - Logs: .\logs\
echo    - Reportes Allure: .\allure-results\
echo.

:end
endlocal