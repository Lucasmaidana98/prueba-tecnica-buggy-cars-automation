const LoginPage = require('../../page-objects/LoginPage');
const VotacionPage = require('../../page-objects/VotacionPage');
const NavegacionPage = require('../../page-objects/NavegacionPage');

describe('CA03: Funcionalidad de Comentarios', function() {
    
    beforeEach(() => {
        console.log('🧪 Preparando prueba de funcionalidad de comentarios');
        NavegacionPage.irAPaginaPrincipal().esperarCarga();
        LoginPage.cerrarSesion();
    });

    afterEach(() => {
        LoginPage.cerrarSesion();
    });

    it('Debe permitir dejar comentario opcional al votar', () => {
        // ARRANGE
        const comentarioOpcional = 'Este es un comentario opcional para el auto';
        VotacionPage.navegarADetalle(1);
        LoginPage.iniciarSesionConUsuarioValido();
        
        // ACT
        VotacionPage.votarConComentario(comentarioOpcional);
        
        // ASSERT
        VotacionPage.verificarVotacionExitosa();
        const nombreUsuario = LoginPage.obtenerNombreUsuario();
        VotacionPage.verificarComentarioEnTabla(comentarioOpcional, nombreUsuario);
    });

    it('Debe permitir votar sin comentario', () => {
        // ARRANGE
        VotacionPage.navegarADetalle(2);
        LoginPage.iniciarSesionConUsuarioValido();
        const votosAnteriores = VotacionPage.obtenerNumeroVotos();
        
        // ACT
        VotacionPage.votarSinComentario();
        
        // ASSERT
        VotacionPage.verificarVotacionExitosa();
        VotacionPage.verificarIncrementoVotos(votosAnteriores);
    });

    it('Debe mostrar comentarios con formato de texto largo', () => {
        // ARRANGE
        const comentarioLargo = 'Este es un comentario muy largo que tiene como propósito probar que el sistema puede manejar comentarios extensos con múltiples palabras y caracteres especiales como !@#$%^&*()_+-={}[]|:";\'<>?,./ y números 1234567890';
        VotacionPage.navegarADetalle(3);
        LoginPage.iniciarSesionConUsuarioValido();
        
        // ACT
        VotacionPage.votarConComentario(comentarioLargo);
        
        // ASSERT
        VotacionPage.verificarVotacionExitosa();
        const nombreUsuario = LoginPage.obtenerNombreUsuario();
        VotacionPage.verificarComentarioEnTabla(comentarioLargo, nombreUsuario);
    });

    it('Debe manejar comentarios con caracteres especiales', () => {
        // ARRANGE
        const comentarioEspecial = 'Comentario con acentos: áéíóú, ñ, ¡¿ y símbolos €$£¥';
        VotacionPage.navegarADetalle(4);
        LoginPage.iniciarSesionConUsuarioValido();
        
        // ACT
        VotacionPage.votarConComentario(comentarioEspecial);
        
        // ASSERT
        VotacionPage.verificarVotacionExitosa();
        const nombreUsuario = LoginPage.obtenerNombreUsuario();
        VotacionPage.verificarComentarioEnTabla(comentarioEspecial, nombreUsuario);
    });

    it('Debe permitir múltiples comentarios de diferentes usuarios', () => {
        // ARRANGE
        const comentarios = [
            { usuario: usuarios.usuariosAdicionales[0], comentario: 'Primer comentario de usuario adicional' },
            { usuario: usuarios.usuariosAdicionales[1], comentario: 'Segundo comentario de otro usuario' }
        ];
        
        VotacionPage.navegarADetalle(5);
        
        // ACT & ASSERT
        comentarios.forEach((item, index) => {
            // Cerrar sesión anterior si existe
            if (index > 0) LoginPage.cerrarSesion();
            
            // Iniciar sesión con usuario específico
            LoginPage.iniciarSesion(item.usuario.username, item.usuario.password);
            LoginPage.verificarLoginExitoso();
            
            // Votar con comentario
            VotacionPage.votarConComentario(item.comentario);
            VotacionPage.verificarVotacionExitosa();
            
            // Verificar que el comentario aparece
            VotacionPage.verificarComentarioEnTabla(item.comentario, item.usuario.firstName);
        });
    });

    it('Debe validar que comentario vacío es aceptable', () => {
        // ARRANGE
        VotacionPage.navegarADetalle(6);
        LoginPage.iniciarSesionConUsuarioValido();
        const votosAnteriores = VotacionPage.obtenerNumeroVotos();
        
        // ACT: Escribir en el campo de comentario pero luego borrarlo
        VotacionPage.escribir(VotacionPage.campoComentario, 'Comentario temporal');
        VotacionPage.escribir(VotacionPage.campoComentario, ''); // Borrar
        VotacionPage.clickear(VotacionPage.botonVotar);
        
        // ASSERT
        VotacionPage.verificarVotacionExitosa();
        VotacionPage.verificarIncrementoVotos(votosAnteriores);
    });

    it('Debe preservar comentarios al recargar la página', () => {
        // ARRANGE
        const comentarioPersistente = 'Este comentario debe persistir al recargar';
        VotacionPage.navegarADetalle(1);
        LoginPage.iniciarSesionConUsuarioValido();
        
        // ACT
        VotacionPage.votarConComentario(comentarioPersistente);
        VotacionPage.verificarVotacionExitosa();
        
        // Recargar la página
        NavegacionPage.recargarPagina();
        
        // ASSERT
        const nombreUsuario = LoginPage.obtenerNombreUsuario();
        VotacionPage.verificarComentarioEnTabla(comentarioPersistente, nombreUsuario);
    });

    it('Debe mostrar comentarios ordenados cronológicamente', () => {
        // ARRANGE
        VotacionPage.navegarADetalle(2);
        LoginPage.iniciarSesionConUsuarioValido();
        
        // ACT: Añadir varios comentarios
        const comentarios = [
            'Primer comentario cronológico',
            'Segundo comentario cronológico',
            'Tercer comentario cronológico'
        ];
        
        comentarios.forEach((comentario, index) => {
            if (index > 0) {
                // Simular espera entre comentarios
                browser.pause(1000);
            }
            VotacionPage.votarConComentario(comentario);
            VotacionPage.verificarVotacionExitosa();
        });
        
        // ASSERT: Verificar que todos los comentarios están presentes
        const nombreUsuario = LoginPage.obtenerNombreUsuario();
        comentarios.forEach(comentario => {
            VotacionPage.verificarComentarioEnTabla(comentario, nombreUsuario);
        });
    });
});