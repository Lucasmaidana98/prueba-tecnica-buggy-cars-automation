const chai = require('chai');
const moment = require('moment');

// Configuración global de Chai
global.expect = chai.expect;
global.moment = moment;

// Configuración de moment en español
moment.locale('es');

// Variables globales para datos de prueba
global.usuarios = require('../data/usuarios.json');

// Helper para credenciales
global.credenciales = {
    validas: {
        email: 'testmail@gmail.com',
        password: 'Test1234!'
    },
    invalidas: {
        email: 'usuario_inexistente@test.com',
        password: 'password_incorrecto'
    }
};

// Helper para URLs comunes
global.urls = {
    home: '/',
    login: '/',
    registro: '/register',
    perfil: '/profile',
    marcaPopular: '/make/ckl2phsabijs71623vk0',
    modeloPopular: '/model/ckl2phsabijs71623vk0|ckl2phsabijs71623vqg',
    ratingGeneral: '/overall'
};

// Helper para timeouts estándar
global.timeouts = {
    corto: 5000,
    medio: 10000,
    largo: 30000,
    xlargo: 60000
};

// Helper para mensajes de validación
global.mensajes = {
    votoExitoso: 'Thank you for your vote!',
    requiereLogin: 'You need to be logged in to vote.',
    loginExitoso: 'Hi, test',
    loginFallido: 'Invalid username/password'
};

// Helper para capturas de pantalla con nombres descriptivos
global.capturarPantallaConNombre = function(nombrePrueba, estado = '') {
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const nombreArchivo = `${nombrePrueba}_${estado}_${timestamp}`.replace(/\s+/g, '_');
    return browser.saveScreenshot(`./screenshots/${nombreArchivo}.png`);
};

// Helper para logging mejorado
global.log = {
    info: function(mensaje) {
        console.log(`ℹ️  ${mensaje}`);
    },
    
    exito: function(mensaje) {
        console.log(`✅ ${mensaje}`);
    },
    
    error: function(mensaje) {
        console.log(`❌ ${mensaje}`);
    },
    
    advertencia: function(mensaje) {
        console.log(`⚠️  ${mensaje}`);
    },
    
    prueba: function(nombre) {
        console.log(`🧪 Ejecutando: ${nombre}`);
    },
    
    seccion: function(nombre) {
        console.log(`\n📋 === ${nombre} ===`);
    }
};

// Configurar hooks para mejor logging
before(function() {
    log.seccion('INICIO DE SUITE DE PRUEBAS');
    log.info(`Timestamp: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
    log.info(`URL Base: ${browser.config.baseUrl}`);
});

beforeEach(function() {
    log.prueba(this.currentTest.title);
});

afterEach(function() {
    if (this.currentTest.state === 'failed') {
        log.error(`Prueba falló: ${this.currentTest.title}`);
        capturarPantallaConNombre(this.currentTest.title, 'FAILED');
    } else {
        log.exito(`Prueba exitosa: ${this.currentTest.title}`);
    }
});

after(function() {
    log.seccion('FIN DE SUITE DE PRUEBAS');
});

console.log('🚀 Setup de helpers cargado exitosamente');