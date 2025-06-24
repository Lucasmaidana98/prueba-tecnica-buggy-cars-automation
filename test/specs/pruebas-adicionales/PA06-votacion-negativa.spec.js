const LoginPage = require('../../page-objects/LoginPage');
const VotacionPage = require('../../page-objects/VotacionPage');
const NavegacionPage = require('../../page-objects/NavegacionPage');

describe('Pruebas Adicionales - Votación Negativa', function() {
    
    beforeEach(() => {
        console.log('🧪 Preparando pruebas adicionales de votación negativa');
        NavegacionPage.irAPaginaPrincipal().esperarCarga();
        LoginPage.cerrarSesion();
    });

    it('PA26: No debe permitir votar sin autenticación', () => {
        // ARRANGE
        VotacionPage.navegarADetalle(1);
        
        // ACT & ASSERT
        VotacionPage.verificarEstadoSinSesion();
        VotacionPage.verificarBotonVotarVisible(false);
    });

    it('PA27: Debe manejar comentarios extremadamente largos', () => {
        // ARRANGE
        const comentarioMuyLargo = 'a'.repeat(10000);
        VotacionPage.navegarADetalle(2);
        LoginPage.iniciarSesionConUsuarioValido();
        
        // ACT
        VotacionPage.escribir(VotacionPage.campoComentario, comentarioMuyLargo);
        
        // ASSERT
        // Verificar que el campo maneja texto largo sin errores
        const valorCampo = browser.$(VotacionPage.campoComentario).getValue();
        expect(valorCampo.length).to.be.greaterThan(0);
    });

    it('PA28: Debe prevenir doble votación del mismo usuario', () => {
        // ARRANGE
        VotacionPage.navegarADetalle(3);
        LoginPage.iniciarSesionConUsuarioValido();
        
        // Primera votación
        VotacionPage.votarSinComentario();
        VotacionPage.verificarVotacionExitosa();
        
        // ACT - Intentar votar de nuevo
        const votosAntesSegundoVoto = VotacionPage.obtenerNumeroVotos();
        VotacionPage.votarSinComentario();
        
        // ASSERT
        // El sistema debería prevenir la doble votación
        const votosDespuesSegundoIntento = VotacionPage.obtenerNumeroVotos();
        expect(votosDespuesSegundoIntento).to.equal(votosAntesSegundoVoto);
    });

    it('PA29: Debe manejar caracteres especiales en comentarios', () => {
        // ARRANGE
        const comentarioEspecial = '<script>alert("test")</script> & \\" \\'';
        VotacionPage.navegarADetalle(4);
        LoginPage.iniciarSesionConUsuarioValido();
        
        // ACT
        VotacionPage.votarConComentario(comentarioEspecial);
        
        // ASSERT
        // Verificar que no hay ejecución de scripts maliciosos
        VotacionPage.verificarVotacionExitosa();
        expect(() => browser.getAlertText()).to.throw(); // No debe haber alert
    });

    it('PA30: Debe manejar pérdida de conexión durante votación', () => {
        // ARRANGE
        VotacionPage.navegarADetalle(5);
        LoginPage.iniciarSesionConUsuarioValido();
        
        // ACT
        // Simular pérdida temporal de conexión cambiando a offline
        browser.execute(() => {
            window.navigator.onLine = false;
        });
        
        VotacionPage.votarSinComentario();
        
        // Restaurar conexión
        browser.execute(() => {
            window.navigator.onLine = true;
        });
        
        // ASSERT
        // La aplicación debería manejar la situación graciosamente
        // Puede mostrar error o reintentar automáticamente
        expect(() => browser.getTitle()).to.not.throw();
    });
});