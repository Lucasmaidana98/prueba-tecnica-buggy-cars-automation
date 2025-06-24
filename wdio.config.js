const { join } = require('path');

exports.config = {
    // Runner Configuration
    runner: 'local',
    
    // Especificaciones de pruebas
    specs: [
        './test/specs/**/*.js'
    ],
    
    // Patrones a excluir
    exclude: [
        './test/specs/ejemplos/**/*.js'
    ],

    // Suites de pruebas
    suites: {
        criterios: [
            './test/specs/criterios-aceptacion/**/*.js'
        ],
        adicionales: [
            './test/specs/pruebas-adicionales/**/*.js'
        ]
    },

    // Configuración de navegadores
    capabilities: [{
        maxInstances: 5,
        browserName: 'chrome',
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
            args: [
                '--headless',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--window-size=1920,1080',
                '--disable-extensions',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ]
        }
    }],

    // Nivel de logging
    logLevel: 'info',
    bail: 0,
    
    // URL base de la aplicación
    baseUrl: 'https://buggy.justtestit.org',
    
    // Timeouts
    waitforTimeout: 30000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    // Test framework
    framework: 'mocha',
    
    // Opciones de Mocha
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
        require: ['./test/helpers/setup.js']
    },

    // Reportes
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }]
    ],

    // Servicios
    services: [
        'chromedriver'
    ],

    // Hooks
    before: function (capabilities, specs) {
        browser.maximizeWindow();
        
        // Configurar variables globales
        global.testData = require('./test/data/test-data.json');
        global.usuarios = require('./test/data/usuarios.json');
        global.expect = require('chai').expect;
        
        // Helper personalizado para capturas
        global.capturarPantalla = function(nombre) {
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            browser.saveScreenshot(`./screenshots/${nombre}_${timestamp}.png`);
        };
    },

    beforeTest: function (test, context) {
        console.log(`\\n🧪 Iniciando prueba: ${test.title}`);
    },

    afterTest: function (test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            browser.saveScreenshot(`./screenshots/FAILED_${test.title.replace(/\\s+/g, '_')}_${timestamp}.png`);
        }
    },

    onComplete: function (exitCode, config, capabilities, results) {
        console.log('\\n📊 Resultados de las pruebas:');
        console.log(`Total: ${results.passed + results.failed}`);
        console.log(`✅ Exitosas: ${results.passed}`);
        console.log(`❌ Fallidas: ${results.failed}`);
        console.log(`⏱️  Duración: ${results.duration}ms`);
    }
};