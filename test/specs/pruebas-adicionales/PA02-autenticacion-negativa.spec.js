const LoginPage = require('../../page-objects/LoginPage');
const NavegacionPage = require('../../page-objects/NavegacionPage');

describe('Pruebas Adicionales - Autenticación Negativa', function() {
    
    beforeEach(() => {
        console.log('🧪 Preparando pruebas adicionales de autenticación negativa');
        NavegacionPage.irAPaginaPrincipal().esperarCarga();
        LoginPage.cerrarSesion();
    });

    it('PA06: Debe mostrar error con credenciales incorrectas', () => {
        // ACT
        LoginPage.iniciarSesion('usuario_incorrecto', 'password_incorrecto');
        
        // ASSERT
        LoginPage.verificarLoginFallido();
        expect(LoginPage.estaLogueado()).to.be.false;
    });

    it('PA07: Debe mostrar error con usuario vacío', () => {
        // ACT
        LoginPage.iniciarSesion('', 'password123');
        
        // ASSERT
        expect(LoginPage.estaLogueado()).to.be.false;
    });

    it('PA08: Debe mostrar error con password vacío', () => {
        // ACT
        LoginPage.iniciarSesion('usuario123', '');
        
        // ASSERT
        expect(LoginPage.estaLogueado()).to.be.false;
    });

    it('PA09: Debe manejar caracteres especiales en credenciales', () => {
        // ACT
        LoginPage.iniciarSesion('user@#$%', 'pass!@#$');
        
        // ASSERT
        expect(LoginPage.estaLogueado()).to.be.false;
    });

    it('PA10: Debe manejar credenciales extremadamente largas', () => {
        // ARRANGE
        const usuarioLargo = 'a'.repeat(200);
        const passwordLargo = 'b'.repeat(200);
        
        // ACT
        LoginPage.iniciarSesion(usuarioLargo, passwordLargo);
        
        // ASSERT
        expect(LoginPage.estaLogueado()).to.be.false;
    });
});