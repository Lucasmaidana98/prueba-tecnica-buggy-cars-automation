# 📋 Instrucciones de Ejecución - Paso a Paso

## 🖥️ Windows (CMD/PowerShell)

### Paso 1: Requisitos Previos
```cmd
# Verificar que Docker Desktop está instalado y ejecutándose
docker --version
docker-compose --version

# Verificar que Git está instalado
git --version
```

### Paso 2: Descargar el Proyecto
```cmd
# Opción A: Clonar desde repositorio
git clone <URL_DEL_REPOSITORIO>
cd prueba-tecnica-buggy-cars

# Opción B: Si tienes el ZIP, extraer y navegar
cd C:\\ruta\\donde\\extrajiste\\prueba-tecnica-buggy-cars
```

### Paso 3: Ejecutar con Docker (Método Recomendado)
```cmd
# Construir y ejecutar las pruebas
docker-compose up --build

# Para ver logs en tiempo real en otra ventana CMD
docker-compose logs -f automatizacion-buggy-cars

# Para ejecutar solo las pruebas de criterios de aceptación
docker-compose run automatizacion-buggy-cars npm run test:chrome

# Para generar reportes Allure
docker-compose --profile reportes up
```

### Paso 4: Ver Resultados
```cmd
# Las capturas de pantalla y logs estarán en:
dir screenshots
dir logs
dir allure-results

# Para limpiar contenedores después de la ejecución
docker-compose down
```

### Paso 5: Instalación Local (Alternativa)
```cmd
# Solo si prefieres ejecutar sin Docker
# Instalar Node.js 18+ desde https://nodejs.org

# Instalar dependencias
npm install

# Ejecutar pruebas
npm test

# Generar reportes
npm run test:reporte
```

---

## 🐧 Linux/WSL

### Paso 1: Requisitos Previos
```bash
# Actualizar sistema
sudo apt update

# Instalar Docker si no está instalado
sudo apt install docker.io docker-compose

# Verificar instalaciones
docker --version
docker-compose --version
git --version
```

### Paso 2: Configurar Permisos Docker
```bash
# Agregar usuario al grupo docker (para evitar sudo)
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar:
newgrp docker

# Verificar que funciona sin sudo
docker ps
```

### Paso 3: Descargar el Proyecto
```bash
# Opción A: Clonar desde repositorio
git clone <URL_DEL_REPOSITORIO>
cd prueba-tecnica-buggy-cars

# Opción B: Si tienes el archivo, extraer
tar -xzf prueba-tecnica-buggy-cars.tar.gz
cd prueba-tecnica-buggy-cars

# O para ZIP:
unzip prueba-tecnica-buggy-cars.zip
cd prueba-tecnica-buggy-cars
```

### Paso 4: Configurar Permisos de Directorios
```bash
# Crear directorios si no existen y configurar permisos
mkdir -p screenshots logs allure-results test-results
chmod 755 screenshots logs allure-results test-results
```

### Paso 5: Ejecutar con Docker
```bash
# Construir y ejecutar las pruebas
docker-compose up --build

# En terminal separada, ver logs en tiempo real
docker-compose logs -f automatizacion-buggy-cars

# Ejecutar solo criterios de aceptación
docker-compose run automatizacion-buggy-cars npm run test:chrome

# Ejecutar pruebas adicionales
docker-compose run automatizacion-buggy-cars npm run test:firefox

# Ejecutar todas en paralelo
docker-compose run automatizacion-buggy-cars npm run test:parallel
```

### Paso 6: Generar Reportes
```bash
# Generar reportes Allure
docker-compose --profile reportes up

# El reporte estará disponible en http://localhost:4444
# Para abrir en navegador automáticamente (Ubuntu):
xdg-open http://localhost:4444
```

### Paso 7: Ver y Analizar Resultados
```bash
# Ver capturas de pantalla
ls -la screenshots/
eog screenshots/*.png  # Abrir imágenes

# Ver logs
tail -f logs/*
cat logs/wdio.log

# Ver resultados de Allure
ls -la allure-results/
```

### Paso 8: Limpiar Después de Ejecución
```bash
# Detener y limpiar contenedores
docker-compose down

# Limpiar imágenes (opcional)
docker system prune -f

# Limpiar resultados anteriores (opcional)
rm -rf screenshots/* logs/* allure-results/*
```

---

## 🔧 Comandos de Desarrollo Avanzados

### Para Debugging
```bash
# Ejecutar en modo interactivo
docker-compose run --rm automatizacion-buggy-cars bash

# Dentro del contenedor:
npm test -- --grep "PA01"  # Ejecutar prueba específica
npm run lint              # Verificar código
ls -la test/specs/        # Ver estructura de pruebas
```

### Para Desarrollo Local
```bash
# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar dependencias
npm install

# Ejecutar pruebas específicas
npm test -- --suite criterios
npm test -- --suite adicionales

# Ejecutar con configuración personalizada
npx wdio wdio.config.js --spec test/specs/criterios-aceptacion/CA01*.js
```

### Configuración de CI/CD
```bash
# Para GitHub Actions, crear .github/workflows/tests.yml
mkdir -p .github/workflows

# Para Jenkins, configurar Jenkinsfile
# Para GitLab CI, configurar .gitlab-ci.yml
```

---

## 📊 Interpretación de Resultados

### Estados de Pruebas:
- ✅ **PASSED** - Prueba exitosa
- ❌ **FAILED** - Prueba fallida (screenshot automático)
- ⏭️ **SKIPPED** - Prueba omitida
- 🔄 **PENDING** - Prueba pendiente

### Archivos de Salida:
- `screenshots/` - Capturas automáticas en fallos
- `logs/` - Logs detallados de ejecución
- `allure-results/` - Datos para reportes Allure
- `test-results/` - Resultados adicionales

### Métricas Importantes:
- **Tiempo total de ejecución**
- **Porcentaje de éxito**
- **Casos fallidos con causa**
- **Performance por suite de pruebas**

---

## 🆘 Solución de Problemas Frecuentes

### Error: "Puerto 4444 ocupado"
```bash
# Verificar procesos usando el puerto
lsof -i :4444
sudo netstat -tlnp | grep :4444

# Cambiar puerto en docker-compose.yml
ports: ["4445:4444"]
```

### Error: "Permission denied" (Linux)
```bash
sudo chown -R $USER:$USER .
chmod -R 755 screenshots logs allure-results
```

### Error: "Chrome binary not found"
```bash
# En Docker ya está incluido
# Para local, instalar Chrome:
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt update
sudo apt install google-chrome-stable
```

### Error: "Memory issues"
```bash
# Aumentar memoria para Docker Desktop (Windows/Mac)
# Settings > Resources > Memory > 4GB+

# En Linux, limpiar Docker
docker system prune -a
```

---

## 📞 Soporte Técnico

Si encuentras problemas:

1. **Revisar logs**: `cat logs/wdio.log`
2. **Verificar screenshots**: Revisar capturas automáticas
3. **Consultar documentación**: README.md completo
4. **Reportar issue**: Con logs y descripción detallada

**¡Listo para ejecutar pruebas automatizadas profesionales! 🚀**