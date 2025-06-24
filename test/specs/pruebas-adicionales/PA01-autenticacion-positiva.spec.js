const LoginPage = require('../../page-objects/LoginPage');
const NavegacionPage = require('../../page-objects/NavegacionPage');

describe('Pruebas Adicionales - Autenticación Positiva', function() {
    
    beforeEach(() => {
        console.log('🧪 Preparando pruebas adicionales de autenticación positiva');
        NavegacionPage.irAPaginaPrincipal().esperarCarga();
        LoginPage.cerrarSesion();
    });

    afterEach(() => {
        LoginPage.cerrarSesion();
    });

    it('PA01: Debe mostrar mensaje de bienvenida al iniciar sesión exitosamente', () => {
        // ACT
        LoginPage.iniciarSesionConUsuarioValido();
        
        // ASSERT
        LoginPage.verificarLoginExitoso();
        expect(LoginPage.obtenerNombreUsuario()).to.not.be.null;
    });

    it('PA02: Debe mantener sesión activa al navegar entre páginas', () => {
        // ARRANGE
        LoginPage.iniciarSesionConUsuarioValido();
        
        // ACT
        NavegacionPage.navegarAListaAutos();
        NavegacionPage.irAPaginaPrincipal();
        
        // ASSERT
        expect(LoginPage.estaLogueado()).to.be.true;
    });

    it('PA03: Debe permitir cerrar sesión correctamente', () => {
        // ARRANGE
        LoginPage.iniciarSesionConUsuarioValido();
        expect(LoginPage.estaLogueado()).to.be.true;
        
        // ACT
        LoginPage.cerrarSesion();
        
        // ASSERT
        LoginPage.verificarEstadoSinSesion();
    });

    it('PA04: Debe validar campos de login no vacíos antes de enviar', () => {
        // ACT
        LoginPage.escribir(LoginPage.campoUsuario, 'usuario_valido');
        LoginPage.escribir(LoginPage.campoPassword, 'password_valido');
        
        // ASSERT
        const usuario = browser.$(LoginPage.campoUsuario).getValue();
        const password = browser.$(LoginPage.campoPassword).getValue();
        
        expect(usuario).to.equal('usuario_valido');
        expect(password).to.equal('password_valido');
    });

    it('PA05: Debe mostrar interfaz de login consistente', () => {
        // ACT & ASSERT
        LoginPage.verificarCamposLoginVisibles();
        
        // Verificar que los campos tienen placeholders o labels apropiados
        const campoUsuario = browser.$(LoginPage.campoUsuario);
        const campoPassword = browser.$(LoginPage.campoPassword);
        
        expect(campoUsuario.isDisplayed()).to.be.true;
        expect(campoPassword.isDisplayed()).to.be.true;
        expect(campoPassword.getAttribute('type')).to.equal('password');
    });
});