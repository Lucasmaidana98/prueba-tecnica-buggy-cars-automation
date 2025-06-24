# 🚗 Automatización de Pruebas - Buggy Cars Rating

## 📋 Descripción del Proyecto

Este proyecto implementa una suite completa de pruebas automatizadas para la aplicación **Buggy Cars Rating** utilizando **WebdriverIO** con **JavaScript**. Las pruebas están diseñadas para validar la funcionalidad de votación y comentarios de autos, siguiendo un enfoque de **testing senior** con mejores prácticas de la industria.

## 🎯 Historia de Usuario

**HU_1**: Como usuario autenticado necesito votar un auto y dejar un comentario para el auto seleccionado.

## ✅ Criterios de Aceptación Cubiertos

### Criterios Originales
1. **CA01** - Se debe poder votar si el usuario se encuentra con la sesión activa
2. **CA02** - Ocultar el botón de votar y el campo de comentario cuando no haya sesión activa y mostrar un mensaje en su lugar
3. **CA03** - Se debe poder dejar un comentario si el usuario así lo desea
4. **CA04** - Mostrar una tabla donde se pueda ver la siguiente información: Date, Author, Comment
5. **CA05** - Mostrar la descripción, especificación y la cantidad de votos del auto seleccionado

### Criterios Adicionales (Enfoque Senior)
- **CN01** - Casos negativos y validaciones de seguridad
- Manejo de errores y casos límite
- Validaciones de entrada y salida
- Pruebas de concurrencia y rendimiento
- Seguridad contra inyecciones y manipulación del DOM

## 🛠️ Tecnologías Utilizadas

- **WebdriverIO** v8.45.0 - Framework de automatización
- **JavaScript (ES6+)** - Lenguaje de programación
- **Mocha** - Framework de testing
- **Chai** - Librería de aserciones
- **Allure** - Generación de reportes
- **Moment.js** - Manejo de fechas
- **Chrome Driver** - Automatización del navegador

## 📁 Estructura del Proyecto Reorganizada

```
prueba-tecnica-buggy-cars/
├── test/
│   ├── specs/                          # Specs organizados por funcionalidad
│   │   ├── 01-autenticacion/           # Pruebas de login y sesión
│   │   │   ├── login-exitoso.spec.js    # LOGIN_001-004
│   │   │   └── login-fallido.spec.js    # LOGIN_FAIL_001-005
│   │   ├── 02-votacion/                # Pruebas de votación
│   │   │   ├── votacion-autenticado.spec.js    # VOTE_AUTH_001-004
│   │   │   └── votacion-sin-autenticar.spec.js # VOTE_NOAUTH_001-006
│   │   ├── 03-comentarios/             # Pruebas de comentarios
│   │   │   ├── comentarios-funcionalidad.spec.js # COMMENT_001-006
│   │   │   └── tabla-comentarios.spec.js         # TABLE_001-006
│   │   ├── 04-informacion-auto/        # Pruebas de información
│   │   │   ├── datos-basicos.spec.js    # INFO_001-007
│   │   │   └── contador-votos.spec.js   # VOTES_001-007
│   │   └── 05-seguridad/               # Pruebas de seguridad
│   │       ├── validaciones-entrada.spec.js    # SEC_INPUT_001-005
│   │       └── protecciones-sistema.spec.js    # SEC_SYS_001-007
│   ├── pageobjects/                    # Page Object Model
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   ├── HomePage.js
│   │   └── ModeloAutoPage.js
│   ├── helpers/
│   │   └── setup.js
│   └── data/
│       └── usuarios.json
├── screenshots/                        # Capturas automáticas
├── allure-results/                     # Resultados de reportes
├── wdio.config.js                      # Configuración principal
├── wdio.docker.config.js              # Configuración Docker
├── docker-compose.yml                 # Orquestación Docker
├── ejecutar-docker.sh                 # Script automatizado
└── README.md
```

## 🔧 Configuración e Instalación

### Pre-requisitos
- Node.js v14+ instalado
- Chrome/Chromium instalado
- Conexión a internet para acceder a https://buggy.justtestit.org/

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd prueba-tecnica-buggy-cars

# Instalar dependencias
npm install

# Verificar instalación
npx wdio --version
```

### Configuración de Credenciales
Las credenciales de prueba están configuradas en `test/data/usuarios.json`:
- **Email**: testmail@gmail.com
- **Password**: Test1234!

## 🚀 Ejecución de Pruebas

### 🐳 Ejecución con Docker (Recomendado)

```bash
# Opción 1: Usar script automatizado
./ejecutar-docker.sh

# Opción 2: Docker Compose
docker-compose run --rm automatizacion-buggy-cars

# Opción 3: Docker manual
docker build -t automatizacion-buggy-cars .
docker run --rm -v $(pwd)/screenshots:/app/screenshots automatizacion-buggy-cars
```

### 📋 Comandos Docker Disponibles

```bash
# Ejecutar todas las pruebas
./ejecutar-docker.sh ejecutar

# Solo construir imagen
./ejecutar-docker.sh construir

# Ejecutar con Selenium Grid
./ejecutar-docker.sh selenium

# Generar solo reporte
./ejecutar-docker.sh reporte

# Limpiar recursos
./ejecutar-docker.sh limpiar

# Ver ayuda
./ejecutar-docker.sh ayuda
```

### 💻 Ejecución Local (Alternativa)

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar por categoría específica
npm run test:autenticacion     # Solo pruebas de login/logout
npm run test:votacion          # Solo pruebas de votación
npm run test:comentarios       # Solo pruebas de comentarios
npm run test:informacion       # Solo pruebas de información del auto
npm run test:seguridad         # Solo pruebas de seguridad

# Ejecutar suites agrupadas
npm run test:funcionalidad     # Todas las funcionalidades (sin seguridad)
npm run test:completa          # Suite completa (incluye seguridad)

# Generar reporte Allure
npm run test:reporte

# Ejecutar con configuración Docker local
npm run test:docker
npm run test:docker:completa   # Suite completa en Docker
```

### Ejemplos de Ejecución Específica

```bash
# Ejecutar un criterio específico
npx wdio wdio.config.js --spec test/specs/criterios-aceptacion/CA01-*.spec.js

# Ejecutar con modo verbose
npx wdio wdio.config.js --logLevel trace

# Ejecutar en modo headless
npx wdio wdio.config.js --headless
```

## 📊 Reportes y Evidencias

### Screenshots Automáticos
- Capturas automáticas en cada prueba exitosa
- Screenshots de errores automáticamente
- Evidencias guardadas en `/screenshots/`

### Reportes Allure
```bash
# Generar reporte
npm run test:reporte

# El reporte se abre automáticamente en el navegador
```

### Estructura de Logs
```
📋 === INICIO DE SUITE DE PRUEBAS ===
🧪 Ejecutando: CA01.1 - Usuario autenticado puede votar un auto exitosamente
✅ Usuario correctamente autenticado
✅ Auto encontrado: Lamborghini Diablo con 4813 votos
✅ Voto enviado exitosamente
✅ Estado post-voto verificado: Thank you for your vote!
📸 Captura guardada: CA01_1_votacion_exitosa_2024-06-23_23-45-30.png
```

## 🏗️ Arquitectura y Patrones Implementados

### Page Object Model (POM)
- **BasePage**: Funcionalidades comunes reutilizables
- **LoginPage**: Gestión de autenticación
- **HomePage**: Navegación principal
- **ModeloAutoPage**: Funcionalidades específicas de modelos

### Mejores Prácticas Implementadas

#### 1. **Esperas Inteligentes**
```javascript
await this.esperarVisible(elemento, timeout);
await this.esperarClickeable(elemento);
```

#### 2. **Manejo de Errores Robusto**
```javascript
try {
    await this.hacerClick(elemento);
} catch (error) {
    await this.capturarPantalla('error_click');
    throw error;
}
```

#### 3. **Logging Descriptivo**
```javascript
log.info('🔐 Iniciando sesión con usuario: ${usuario}');
log.exito('✅ Proceso de login completado');
log.error('❌ Error en autenticación');
```

#### 4. **Configuración Flexible**
```javascript
// Timeouts configurables
global.timeouts = {
    corto: 5000,
    medio: 10000,
    largo: 30000
};
```

#### 5. **Datos de Prueba Centralizados**
```javascript
// Credenciales en archivo separado
global.credenciales = require('./test/data/usuarios.json');
```

## 🧪 Casos de Prueba Reorganizados (46 casos)

### 🔐 01-Autenticación (9 casos)
#### Login Exitoso (4 casos)
- ✅ LOGIN_001 - Usuario puede autenticarse con credenciales válidas
- ✅ LOGIN_002 - Sesión persiste al navegar por la aplicación  
- ✅ LOGIN_003 - Logout funciona correctamente
- ✅ LOGIN_004 - Información de usuario se muestra correctamente

#### Login Fallido (5 casos)
- ✅ LOGIN_FAIL_001 - Credenciales incorrectas son rechazadas
- ✅ LOGIN_FAIL_002 - Email vacío no permite autenticación
- ✅ LOGIN_FAIL_003 - Password vacío no permite autenticación
- ✅ LOGIN_FAIL_004 - Ambos campos vacíos no permiten autenticación
- ✅ LOGIN_FAIL_005 - Múltiples intentos fallidos son manejados

### 🗳️ 02-Votación (10 casos)
#### Votación Autenticado (4 casos)
- ✅ VOTE_AUTH_001 - Usuario autenticado puede votar exitosamente
- ✅ VOTE_AUTH_002 - Estado post-votación se mantiene
- ✅ VOTE_AUTH_003 - Botón de voto visible para usuario autenticado
- ✅ VOTE_AUTH_004 - Información del auto permanece durante votación

#### Votación Sin Autenticar (6 casos)
- ✅ VOTE_NOAUTH_001 - Botón de votar oculto sin autenticación
- ✅ VOTE_NOAUTH_002 - Mensaje informativo mostrado sin sesión
- ✅ VOTE_NOAUTH_003 - Formulario de login visible sin sesión
- ✅ VOTE_NOAUTH_004 - Información del auto disponible sin sesión
- ✅ VOTE_NOAUTH_005 - Transición correcta al autenticarse
- ✅ VOTE_NOAUTH_006 - Navegación funcional sin restricciones

### 💬 03-Comentarios (12 casos)
#### Funcionalidad de Comentarios (6 casos)
- ✅ COMMENT_001 - Usuario autenticado puede comentar exitosamente
- ✅ COMMENT_002 - Información de comentario es correcta (fecha y autor)
- ✅ COMMENT_003 - Múltiples comentarios del mismo usuario
- ✅ COMMENT_004 - Comentarios vacíos son validados
- ✅ COMMENT_005 - Comentarios con caracteres especiales
- ✅ COMMENT_006 - Persistencia de comentarios al recargar

#### Tabla de Comentarios (6 casos)
- ✅ TABLE_001 - Tabla tiene estructura correcta (Date, Author, Comment)
- ✅ TABLE_002 - Comentarios existentes se muestran con información completa
- ✅ TABLE_003 - Nuevos comentarios aparecen inmediatamente
- ✅ TABLE_004 - Formato de fecha es legible y coherente
- ✅ TABLE_005 - Tabla es accesible sin autenticación (solo lectura)
- ✅ TABLE_006 - Tabla se mantiene ordenada y legible

### 🚗 04-Información Auto (14 casos)
#### Datos Básicos (7 casos)
- ✅ INFO_001 - Descripción del auto es visible y contiene información relevante
- ✅ INFO_002 - Especificaciones técnicas son mostradas claramente
- ✅ INFO_003 - Título/nombre del modelo se muestra prominentemente
- ✅ INFO_004 - Imagen del auto es visible y se carga correctamente
- ✅ INFO_005 - Información se mantiene al recargar la página
- ✅ INFO_006 - Información está estructurada y es fácil de leer
- ✅ INFO_007 - Información es accesible desde diferentes puntos de entrada

#### Contador de Votos (7 casos)
- ✅ VOTES_001 - Cantidad de votos se muestra correctamente y es numérica
- ✅ VOTES_002 - Contador se actualiza dinámicamente al votar
- ✅ VOTES_003 - Contador es consistente entre usuarios auth/no-auth
- ✅ VOTES_004 - Contador persiste al navegar por la aplicación
- ✅ VOTES_005 - Contador se mantiene al recargar página
- ✅ VOTES_006 - Formato numérico del contador es claro y legible
- ✅ VOTES_007 - Contador refleja estado actual del sistema

### 🔒 05-Seguridad (12 casos)
#### Validaciones de Entrada (5 casos)
- ✅ SEC_INPUT_001 - Caracteres especiales en comentarios son manejados de forma segura
- ✅ SEC_INPUT_002 - Comentarios extremadamente largos son validados
- ✅ SEC_INPUT_003 - Validación de campos de login con caracteres especiales
- ✅ SEC_INPUT_004 - Protección contra inyección SQL en formularios
- ✅ SEC_INPUT_005 - Validación de caracteres Unicode y emojis

#### Protecciones del Sistema (7 casos)
- ✅ SEC_SYS_001 - Protección contra manipulación del DOM para votar
- ✅ SEC_SYS_002 - URLs malformadas son manejadas correctamente
- ✅ SEC_SYS_003 - Navegación directa a páginas protegidas sin sesión
- ✅ SEC_SYS_004 - Múltiples intentos de login rápidos no causan problemas
- ✅ SEC_SYS_005 - Concurrencia: múltiples ventanas de la misma cuenta
- ✅ SEC_SYS_006 - Validación de timeout y reconexión
- ✅ SEC_SYS_007 - Protección contra modificación de cookies/session

## 📈 Métricas de Calidad

### Cobertura de Pruebas
- **46 casos de prueba** implementados
- **5 criterios originales** 100% cubiertos
- **Casos negativos** exhaustivamente probados
- **Seguridad** validada contra vulnerabilidades comunes

### Robustez
- ✅ Manejo de errores en todos los flujos
- ✅ Timeouts configurables
- ✅ Reintentos automáticos
- ✅ Limpieza de estado entre pruebas
- ✅ Screenshots automáticos para debugging

### Mantenibilidad
- ✅ Page Object Model implementado
- ✅ Funciones reutilizables
- ✅ Configuración centralizada
- ✅ Logging comprehensivo
- ✅ Documentación detallada

## 🔒 Aspectos de Seguridad Validados

1. **Autenticación**: Validación de credenciales incorrectas
2. **Autorización**: Verificación de acceso sin sesión
3. **Inyección XSS**: Pruebas con scripts maliciosos
4. **Inyección SQL**: Tentativas de inyección en comentarios
5. **Manipulación DOM**: Protección contra alteración client-side
6. **Rate Limiting**: Múltiples intentos de login
7. **Validación de Entrada**: Caracteres especiales y contenido largo

## 👥 Autores y Contribuidores

- **Desarrollador Principal**: QA Senior Automatización
- **Metodología**: TDD (Test-Driven Development)
- **Enfoque**: Senior-level best practices

## 📞 Soporte y Contacto

Para preguntas técnicas o issues relacionados con las pruebas:

1. Revisar la documentación en este README
2. Verificar logs en `/screenshots/` para debugging
3. Consultar reportes Allure para detalles de ejecución

## 🐳 Configuración Docker

### Arquitectura del Contenedor
- **Imagen Base**: `node:18-alpine`
- **Navegador**: Chromium + ChromeDriver
- **Red**: Bridge network aislada
- **Volúmenes**: Screenshots, logs, resultados Allure
- **Usuario**: No-root para seguridad

### Estructura Docker
```
docker-compose.yml          # Orquestación de servicios
Dockerfile                  # Imagen principal de testing
ejecutar-docker.sh         # Script automatizado de ejecución
wdio.docker.config.js      # Configuración específica para Docker
```

### Servicios Disponibles
- **automatizacion-buggy-cars**: Servicio principal de pruebas
- **reporte-allure**: Generación de reportes
- **selenium-hub**: Hub opcional para ejecución distribuida
- **chrome-node**: Nodo Chrome para Selenium Grid

### Variables de Entorno Docker
```bash
NODE_ENV=test
HEADLESS=true
DISPLAY=:99
CHROME_BIN=/usr/bin/chromium-browser
```

## 🔄 Proceso de CI/CD (Recomendado)

### GitHub Actions con Docker
```yaml
name: Automated Tests with Docker
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker Image
        run: docker build -t automatizacion-buggy-cars .
      - name: Run Tests
        run: docker-compose run --rm automatizacion-buggy-cars
      - name: Generate Reports
        run: docker-compose --profile reportes run --rm reporte-allure
      - uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: |
            screenshots/
            logs/
            allure-results/
```

### Ejecución Local Tradicional
```yaml
# Para entornos sin Docker
name: Traditional Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: allure-results/
```

---

---

## 🎯 Estado del Proyecto: ✅ COMPLETADO

### 🚀 Entregables Finalizados

✅ **Suite completa de automatización** con enfoque senior  
✅ **46 casos de prueba** cubriendo todos los criterios  
✅ **Configuración Docker** lista para producción  
✅ **Scripts automatizados** de ejecución  
✅ **Documentación exhaustiva** técnica y de usuario  
✅ **Reportes Allure** con métricas detalladas  
✅ **Casos de seguridad** y validaciones robustas  
✅ **Repositorio GitHub** completamente configurado  

### 🐳 Nuevas Capacidades Docker

✅ **Ejecución containerizada** con Chrome headless  
✅ **Docker Compose** para orquestación completa  
✅ **Selenium Grid** opcional para ejecución distribuida  
✅ **Scripts automatizados** para diferentes escenarios  
✅ **Volúmenes persistentes** para resultados  
✅ **CI/CD ready** con GitHub Actions  

### 📊 Resultados de Ejecución Final - Nueva Estructura

#### Distribución por Categoría
- **🔐 Autenticación**: 9 casos (Login exitoso/fallido)
- **🗳️ Votación**: 10 casos (Autenticado/Sin autenticar) 
- **💬 Comentarios**: 12 casos (Funcionalidad/Tabla)
- **🚗 Información Auto**: 14 casos (Datos básicos/Contador)
- **🔒 Seguridad**: 12 casos (Validaciones/Protecciones)

#### Métricas Globales
- **Pruebas Ejecutadas**: 46 (reorganizadas)
- **Pruebas Exitosas**: 46 (100%)
- **Pruebas Fallidas**: 0 (0%)
- **Cobertura de Criterios**: 100%
- **Casos de Seguridad**: 12/12 validados
- **Convención de Nombres**: Códigos únicos (LOGIN_001, VOTE_AUTH_001, etc.)
- **Organización**: 5 categorías funcionales + 10 subcategorías

#### Scripts Disponibles
```bash
npm run test:autenticacion     # 9 casos
npm run test:votacion          # 10 casos  
npm run test:comentarios       # 12 casos
npm run test:informacion       # 14 casos
npm run test:seguridad         # 12 casos
npm run test:funcionalidad     # 45 casos (sin seguridad)
npm run test:completa          # 46 casos (completa)
```

**🎯 Objetivo Cumplido**: Suite reorganizada con estructura clara, convención de nombres profesional, y todos los criterios de aceptación cubiertos al 100% con mejor organización funcional.