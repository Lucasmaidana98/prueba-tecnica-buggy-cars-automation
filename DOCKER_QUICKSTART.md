# 🐳 Docker Quick Start - Buggy Cars Automation

## 🚀 Ejecución Rápida

### Prerequisitos
- Docker instalado
- Docker Compose disponible

### Comando de 1 Línea
```bash
git clone https://github.com/Lucasmaidana98/prueba-tecnica-buggy-cars-automation.git && cd prueba-tecnica-buggy-cars-automation && ./ejecutar-docker.sh
```

## 📋 Comandos Principales

### Ejecución Completa
```bash
# Opción 1: Script automatizado (Recomendado)
./ejecutar-docker.sh

# Opción 2: Docker Compose directo
docker-compose run --rm automatizacion-buggy-cars

# Opción 3: Docker puro
docker build -t automatizacion-buggy-cars . && docker run --rm automatizacion-buggy-cars
```

### Comandos Específicos
```bash
# Solo construir imagen
./ejecutar-docker.sh construir

# Ejecutar con Selenium Grid
./ejecutar-docker.sh selenium

# Generar solo reportes
./ejecutar-docker.sh reporte

# Limpiar todo
./ejecutar-docker.sh limpiar

# Ver ayuda completa
./ejecutar-docker.sh ayuda
```

## 📊 Resultados Esperados

### ✅ Ejecución Exitosa
```
🚗 === AUTOMATIZACIÓN BUGGY CARS CON DOCKER ===
📋 Iniciando configuración y ejecución de pruebas...
✅ Docker y Docker Compose encontrados
🔨 Construyendo imagen Docker...
✅ Imagen Docker construida exitosamente
🧪 Ejecutando suite completa de pruebas...
✅ Pruebas ejecutadas exitosamente

📋 === RESUMEN DE RESULTADOS ===
📸 Screenshots: 44 archivos
📝 Logs: 1 archivo
📊 Resultados Allure: 15 archivos
🎯 Proceso completado.
```

### 📁 Archivos Generados
```
├── screenshots/          # 44+ capturas de pantalla
├── logs/                 # Logs detallados de ejecución  
├── allure-results/       # Resultados para reportes
└── REPORTE_FINAL_EJECUCION.md  # Reporte completo
```

## 🔧 Configuración Avanzada

### Variables de Entorno
```bash
# Ejecución con variables personalizadas
docker run --rm \
  -e HEADLESS=false \
  -e NODE_ENV=development \
  -v $(pwd)/screenshots:/app/screenshots \
  automatizacion-buggy-cars
```

### Selenium Grid
```bash
# Ejecutar con grid distribuido
docker-compose --profile selenium-grid up -d
./ejecutar-docker.sh selenium
docker-compose --profile selenium-grid down
```

## 🆘 Troubleshooting

### Error: "Docker no encontrado"
```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install docker.io docker-compose

# macOS
brew install docker docker-compose

# Windows
# Instalar Docker Desktop desde https://docker.com
```

### Error: "Permisos denegados"
```bash
# Hacer ejecutable el script
chmod +x ejecutar-docker.sh

# Agregar usuario a grupo docker (Linux)
sudo usermod -aG docker $USER
```

### Error: "Puerto en uso"
```bash
# Limpiar contenedores existentes
docker-compose down --volumes --remove-orphans
docker system prune -f
```

## 📚 Links Útiles

- **Repositorio**: https://github.com/Lucasmaidana98/prueba-tecnica-buggy-cars-automation
- **Documentación Completa**: [README.md](README.md)
- **Reporte Final**: [REPORTE_FINAL_EJECUCION.md](REPORTE_FINAL_EJECUCION.md)
- **Docker Hub**: Docker oficial en https://hub.docker.com

---

**🎯 Con Docker, las pruebas están listas en menos de 5 minutos en cualquier sistema!**