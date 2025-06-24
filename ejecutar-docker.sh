#!/bin/bash

# Script de ejecuci�n de pruebas con Docker para Buggy Cars Automation
# Automatizaci�n Senior - Prueba T�cnica

echo "=� === AUTOMATIZACI�N BUGGY CARS CON DOCKER ==="
echo "=� Iniciando configuraci�n y ejecuci�n de pruebas..."

# Verificar que Docker est� instalado
if ! command -v docker &> /dev/null; then
    echo "L Docker no est� instalado. Por favor inst�lalo primero."
    echo "=� Instrucciones: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar que docker-compose est� disponible
if ! command -v docker-compose &> /dev/null; then
    echo "L Docker Compose no est� instalado. Por favor inst�lalo primero."
    exit 1
fi

echo " Docker y Docker Compose encontrados"

# Crear directorios necesarios
echo "=� Creando directorios de resultados..."
mkdir -p screenshots logs allure-results allure-report test-results

# Construir la imagen Docker
echo "=( Construyendo imagen Docker..."
docker build -t automatizacion-buggy-cars .

if [ $? -eq 0 ]; then
    echo " Imagen Docker construida exitosamente"
else
    echo "L Error al construir la imagen Docker"
    exit 1
fi

# Funci�n para ejecutar pruebas
ejecutar_pruebas() {
    echo ">� Ejecutando suite completa de pruebas..."
    
    # Ejecutar pruebas con Docker Compose
    docker-compose run --rm automatizacion-buggy-cars
    
    if [ $? -eq 0 ]; then
        echo " Pruebas ejecutadas exitosamente"
        
        # Generar reporte Allure si hay resultados
        if [ -d "allure-results" ] && [ "$(ls -A allure-results)" ]; then
            echo "=� Generando reporte Allure..."
            docker-compose --profile reportes run --rm reporte-allure
        fi
        
        # Mostrar resumen de archivos generados
        echo ""
        echo "=� === RESUMEN DE RESULTADOS ==="
        echo "=� Screenshots: $(find screenshots -name "*.png" 2>/dev/null | wc -l) archivos"
        echo "=� Logs: $(find logs -name "*.log" 2>/dev/null | wc -l) archivos"
        echo "=� Resultados Allure: $(find allure-results -name "*.json" 2>/dev/null | wc -l) archivos"
        
    else
        echo "L Error durante la ejecuci�n de pruebas"
        return 1
    fi
}

# Funci�n para limpiar recursos
limpiar_recursos() {
    echo ">� Limpiando recursos Docker..."
    docker-compose down --volumes --remove-orphans
    docker system prune -f
}

# Funci�n principal
main() {
    case "${1:-ejecutar}" in
        "ejecutar"|"test")
            ejecutar_pruebas
            ;;
        "construir"|"build")
            echo "=( Solo construyendo imagen..."
            ;;
        "limpiar"|"clean")
            limpiar_recursos
            ;;
        "selenium")
            echo "< Ejecutando con Selenium Grid..."
            docker-compose --profile selenium-grid up -d
            sleep 10
            docker-compose run --rm automatizacion-buggy-cars npm run test:selenium
            docker-compose --profile selenium-grid down
            ;;
        "reporte"|"report")
            echo "=� Generando solo reporte..."
            docker-compose --profile reportes run --rm reporte-allure
            ;;
        "ayuda"|"help")
            echo "=� Comandos disponibles:"
            echo "  ./ejecutar-docker.sh ejecutar    - Ejecutar todas las pruebas"
            echo "  ./ejecutar-docker.sh construir   - Solo construir imagen Docker"
            echo "  ./ejecutar-docker.sh selenium    - Ejecutar con Selenium Grid"
            echo "  ./ejecutar-docker.sh reporte     - Generar solo reporte Allure"
            echo "  ./ejecutar-docker.sh limpiar     - Limpiar recursos Docker"
            ;;
        *)
            echo "S Comando no reconocido. Use './ejecutar-docker.sh ayuda' para ver opciones"
            exit 1
            ;;
    esac
}

# Configurar trap para limpieza al salir
trap 'echo "=� Interrupci�n detectada. Limpiando..."; limpiar_recursos; exit 1' INT TERM

# Ejecutar funci�n principal
main "$@"

echo "<� Proceso completado."
echo "=� Para m�s informaci�n, consulta el README.md"