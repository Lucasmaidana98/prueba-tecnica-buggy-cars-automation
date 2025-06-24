#!/bin/bash

# Script de ejecución de pruebas con Docker para Buggy Cars Automation
# Automatización Senior - Prueba Técnica

echo "=— === AUTOMATIZACIÓN BUGGY CARS CON DOCKER ==="
echo "=Ë Iniciando configuración y ejecución de pruebas..."

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "L Docker no está instalado. Por favor instálalo primero."
    echo "=Ö Instrucciones: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar que docker-compose esté disponible
if ! command -v docker-compose &> /dev/null; then
    echo "L Docker Compose no está instalado. Por favor instálalo primero."
    exit 1
fi

echo " Docker y Docker Compose encontrados"

# Crear directorios necesarios
echo "=Á Creando directorios de resultados..."
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

# Función para ejecutar pruebas
ejecutar_pruebas() {
    echo ">ê Ejecutando suite completa de pruebas..."
    
    # Ejecutar pruebas con Docker Compose
    docker-compose run --rm automatizacion-buggy-cars
    
    if [ $? -eq 0 ]; then
        echo " Pruebas ejecutadas exitosamente"
        
        # Generar reporte Allure si hay resultados
        if [ -d "allure-results" ] && [ "$(ls -A allure-results)" ]; then
            echo "=Ê Generando reporte Allure..."
            docker-compose --profile reportes run --rm reporte-allure
        fi
        
        # Mostrar resumen de archivos generados
        echo ""
        echo "=Ë === RESUMEN DE RESULTADOS ==="
        echo "=ø Screenshots: $(find screenshots -name "*.png" 2>/dev/null | wc -l) archivos"
        echo "=Ý Logs: $(find logs -name "*.log" 2>/dev/null | wc -l) archivos"
        echo "=Ê Resultados Allure: $(find allure-results -name "*.json" 2>/dev/null | wc -l) archivos"
        
    else
        echo "L Error durante la ejecución de pruebas"
        return 1
    fi
}

# Función para limpiar recursos
limpiar_recursos() {
    echo ">ù Limpiando recursos Docker..."
    docker-compose down --volumes --remove-orphans
    docker system prune -f
}

# Función principal
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
            echo "=Ê Generando solo reporte..."
            docker-compose --profile reportes run --rm reporte-allure
            ;;
        "ayuda"|"help")
            echo "=Ö Comandos disponibles:"
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
trap 'echo "=Ñ Interrupción detectada. Limpiando..."; limpiar_recursos; exit 1' INT TERM

# Ejecutar función principal
main "$@"

echo "<¯ Proceso completado."
echo "=Ö Para más información, consulta el README.md"