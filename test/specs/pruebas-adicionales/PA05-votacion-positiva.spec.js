const LoginPage = require('../../page-objects/LoginPage');
const VotacionPage = require('../../page-objects/VotacionPage');
const NavegacionPage = require('../../page-objects/NavegacionPage');

describe('Pruebas Adicionales - Votación Positiva', function() {
    
    beforeEach(() => {
        console.log('🧪 Preparando pruebas adicionales de votación positiva');
        NavegacionPage.irAPaginaPrincipal().esperarCarga();
        LoginPage.cerrarSesion();
    });

    afterEach(() => {
        LoginPage.cerrarSesion();
    });

    it('PA21: Debe incrementar contador de votos después de votar', () => {
        // ARRANGE
        VotacionPage.navegarADetalle(1);
        LoginPage.iniciarSesionConUsuarioValido();
        
        const votosIniciales = VotacionPage.obtenerNumeroVotos();
        
        // ACT
        VotacionPage.votarSinComentario();
        
        // ASSERT
        VotacionPage.verificarVotacionExitosa();
        const votosFinales = VotacionPage.obtenerNumeroVotos();
        expect(votosFinales).to.equal(votosIniciales + 1);
    });

    it('PA22: Debe permitir comentarios con emojis y caracteres Unicode', () => {
        // ARRANGE
        const comentarioEmoji = '¡Excelente auto! 🚗👍 ¿Es muy rápido? 💨';
        VotacionPage.navegarADetalle(2);
        LoginPage.iniciarSesionConUsuarioValido();
        
        // ACT
        VotacionPage.votarConComentario(comentarioEmoji);
        
        // ASSERT
        VotacionPage.verificarVotacionExitosa();
        const nombreUsuario = LoginPage.obtenerNombreUsuario();
        VotacionPage.verificarComentarioEnTabla(comentarioEmoji, nombreUsuario);
    });

    it('PA23: Debe manejar comentarios con saltos de línea', () => {
        // ARRANGE
        const comentarioMultilinea = 'Línea 1 del comentario\\nLínea 2 del comentario\\nLínea 3 del comentario';
        VotacionPage.navegarADetalle(3);
        LoginPage.iniciarSesionConUsuarioValido();
        
        // ACT
        VotacionPage.votarConComentario(comentarioMultilinea);
        
        // ASSERT
        VotacionPage.verificarVotacionExitosa();
    });

    it('PA24: Debe permitir votar en múltiples autos consecutivamente', () => {
        // ARRANGE
        LoginPage.iniciarSesionConUsuarioValido();
        const autoIds = [1, 2, 3];
        
        // ACT & ASSERT
        autoIds.forEach(autoId => {
            VotacionPage.navegarADetalle(autoId);
            const votosAnteriores = VotacionPage.obtenerNumeroVotos();
            
            VotacionPage.votarConComentario(`Voto para auto ${autoId}`);
            VotacionPage.verificarVotacionExitosa();
            VotacionPage.verificarIncrementoVotos(votosAnteriores);
        });
    });

    it('PA25: Debe preservar votos después de cerrar y abrir sesión', () => {
        // ARRANGE
        VotacionPage.navegarADetalle(4);
        LoginPage.iniciarSesionConUsuarioValido();
        
        const votosAntesVotar = VotacionPage.obtenerNumeroVotos();
        VotacionPage.votarSinComentario();
        VotacionPage.verificarVotacionExitosa();
        
        const votosDespuesVotar = VotacionPage.obtenerNumeroVotos();
        
        // ACT
        LoginPage.cerrarSesion();
        LoginPage.iniciarSesionConUsuarioValido();
        
        // ASSERT
        const votosFinales = VotacionPage.obtenerNumeroVotos();
        expect(votosFinales).to.equal(votosDespuesVotar);
        expect(votosFinales).to.be.greaterThan(votosAntesVotar);
    });
});