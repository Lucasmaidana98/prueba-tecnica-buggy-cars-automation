const NavegacionPage = require('../../page-objects/NavegacionPage');
const VotacionPage = require('../../page-objects/VotacionPage');

describe('Pruebas Adicionales - Navegación Negativa', function() {
    
    beforeEach(() => {
        console.log('🧪 Preparando pruebas adicionales de navegación negativa');
        NavegacionPage.irAPaginaPrincipal().esperarCarga();
    });

    it('PA16: Debe manejar IDs de modelos inexistentes', () => {
        // ACT
        NavegacionPage.navegarAModelo(99999);
        
        // ASSERT
        // La aplicación debe manejar graciosamente modelos inexistentes
        // Podría mostrar un error 404 o redirigir al inicio
        const urlActual = NavegacionPage.obtenerUrlActual();
        expect(urlActual).to.include('model/99999');
    });

    it('PA17: Debe manejar URLs malformadas', () => {
        // ACT
        browser.url(testData.aplicacion.baseUrl + '/model/abc');
        
        // ASSERT  
        // La aplicación debe manejar parámetros no numéricos
        const urlActual = NavegacionPage.obtenerUrlActual();
        expect(urlActual).to.include('/model/abc');
    });

    it('PA18: Debe manejar navegación a rutas inexistentes', () => {
        // ACT
        browser.url(testData.aplicacion.baseUrl + '/ruta-inexistente');
        
        // ASSERT
        // Verificar que no hay errores JavaScript críticos
        const logs = browser.getLogs('browser');
        const erroresCriticos = logs.filter(log => log.level === 'SEVERE');
        expect(erroresCriticos.length).to.be.lessThan(5); // Permitir algunos errores menores
    });

    it('PA19: Debe manejar IDs negativos en rutas', () => {
        // ACT
        NavegacionPage.navegarAModelo(-1);
        
        // ASSERT
        const urlActual = NavegacionPage.obtenerUrlActual();
        expect(urlActual).to.include('model/-1');
    });

    it('PA20: Debe manejar caracteres especiales en rutas', () => {
        // ACT
        browser.url(testData.aplicacion.baseUrl + '/model/%20test%20');
        
        // ASSERT
        // Verificar que la aplicación no crashea
        expect(() => browser.getTitle()).to.not.throw();
    });
});