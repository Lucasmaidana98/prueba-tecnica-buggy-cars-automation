#!/bin/bash

# Script para ejecutar pruebas automatizadas de Buggy Cars
# Autor: Automatización Senior
# Fecha: 2025-06-23

set -e  # Salir en caso de error

echo "🚗 Iniciando Automatización de Pruebas - Buggy Cars Rating"
echo "============================================================"

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [OPCIÓN]"
    echo ""
    echo "Opciones:"
    echo "  --all           Ejecutar todas las pruebas"
    echo "  --criterios     Ejecutar solo criterios de aceptación"
    echo "  --adicionales   Ejecutar solo pruebas adicionales"
    echo "  --docker        Ejecutar en contenedor Docker"
    echo "  --report        Generar reporte Allure"
    echo "  --help          Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 --all"
    echo "  $0 --criterios"
    echo "  $0 --docker"
    echo ""
}

# Función para verificar prerequisitos
check_prerequisites() {
    echo "🔍 Verificando prerequisitos..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js no está instalado"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm no está instalado"
        exit 1
    fi
    
    echo "✅ Prerequisitos verificados"
}

# Función para instalar dependencias
install_dependencies() {
    echo "📦 Instalando dependencias..."
    npm install --timeout=300000
    echo "✅ Dependencias instaladas"
}

# Función para crear directorios
create_directories() {
    echo "📁 Creando directorios necesarios..."
    mkdir -p logs screenshots allure-results test-results
    echo "✅ Directorios creados"
}

# Función para ejecutar todas las pruebas
run_all_tests() {
    echo "🧪 Ejecutando todas las pruebas..."
    npm test
}

# Función para ejecutar criterios de aceptación
run_criteria_tests() {
    echo "🎯 Ejecutando criterios de aceptación..."
    npm run test:chrome
}

# Función para ejecutar pruebas adicionales
run_additional_tests() {
    echo "➕ Ejecutando pruebas adicionales..."
    npm run test:firefox
}

# Función para ejecutar en Docker
run_docker_tests() {
    echo "🐳 Ejecutando pruebas en Docker..."
    
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker no está instalado"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose no está instalado"
        exit 1
    fi
    
    docker-compose up --build
}

# Función para generar reporte
generate_report() {
    echo "📊 Generando reporte Allure..."
    npm run test:reporte
}

# Función para limpiar archivos temporales
cleanup() {
    echo "🧹 Limpiando archivos temporales..."
    rm -rf node_modules/.cache
    rm -rf .nyc_output
    echo "✅ Limpieza completada"
}

# Función principal
main() {
    case $1 in
        --all)
            check_prerequisites
            install_dependencies
            create_directories
            run_all_tests
            ;;
        --criterios)
            check_prerequisites
            install_dependencies
            create_directories
            run_criteria_tests
            ;;
        --adicionales)
            check_prerequisites
            install_dependencies
            create_directories
            run_additional_tests
            ;;
        --docker)
            run_docker_tests
            ;;
        --report)
            generate_report
            ;;
        --help)
            show_help
            ;;
        "")
            echo "⚡ Ejecución rápida - Todas las pruebas"
            check_prerequisites
            install_dependencies
            create_directories
            run_all_tests
            ;;
        *)
            echo "❌ Opción desconocida: $1"
            show_help
            exit 1
            ;;
    esac
}

# Capturar Ctrl+C para limpieza
trap cleanup EXIT

# Ejecutar función principal
main "$@"

echo ""
echo "🎉 Ejecución completada!"
echo "📁 Revisar resultados en:"
echo "   - Screenshots: ./screenshots/"
echo "   - Logs: ./logs/"
echo "   - Reportes Allure: ./allure-results/"
echo ""