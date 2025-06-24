const { join } = require('path');

exports.config = {
    // Runner Configuration
    runner: 'local',
    
    // Especificaciones de pruebas - Solo un subconjunto crítico para demostración
    specs: [
        './test/specs/criterios-aceptacion/CA01-votacion-usuario-autenticado.spec.js',
        './test/specs/criterios-aceptacion/CA02-elementos-ocultos-sin-sesion.spec.js',
        './test/specs/pruebas-adicionales/PA01-autenticacion-positiva.spec.js'
    ],
    
    // Configuración de navegadores
    capabilities: [{
        maxInstances: 1,
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
                '--disable-features=VizDisplayCompositor',
                '--remote-debugging-port=9222',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding'
            ]
        }
    }],

    // Configuración de timeouts
    logLevel: 'info',
    bail: 0,
    baseUrl: 'https://buggy.justtestit.org',
    waitforTimeout: 60000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 3,
    
    // Framework
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000,
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
    services: ['chromedriver'],

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
        console.log(`\n🧪 Iniciando prueba: ${test.title}`);
    },

    afterTest: function (test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            const testName = test.title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
            browser.saveScreenshot(`./screenshots/FAILED_${testName}_${timestamp}.png`);
            console.log(`❌ Prueba fallida: ${test.title}`);
            if (error) {
                console.log(`Error: ${error.message}`);
            }
        } else {
            console.log(`✅ Prueba exitosa: ${test.title}`);
        }
    },

    onComplete: function (exitCode, config, capabilities, results) {
        console.log('\n📊 Resultados de las pruebas:');
        console.log(`Total: ${results.passed + results.failed}`);
        console.log(`✅ Exitosas: ${results.passed}`);
        console.log(`❌ Fallidas: ${results.failed}`);
        console.log(`⏱️  Duración: ${results.duration}ms`);
    }
};