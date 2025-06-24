const LoginPage = require('../../page-objects/LoginPage');
const VotacionPage = require('../../page-objects/VotacionPage');
const NavegacionPage = require('../../page-objects/NavegacionPage');

describe('CA02: Elementos Ocultos Sin Sesión Activa', function() {
    
    beforeEach(() => {
        console.log('🧪 Preparando prueba de elementos ocultos sin sesión');
        NavegacionPage.irAPaginaPrincipal().esperarCarga();
        LoginPage.cerrarSesion(); // Asegurar que no hay sesión activa
    });

    it('Debe ocultar botón de votar cuando no hay sesión activa', () => {
        // ARRANGE
        VotacionPage.navegarADetalle(1);
        
        // ACT & ASSERT
        VotacionPage.verificarBotonVotarVisible(false);
    });

    it('Debe ocultar campo de comentario cuando no hay sesión activa', () => {
        // ARRANGE
        VotacionPage.navegarADetalle(2);
        
        // ACT & ASSERT
        VotacionPage.verificarCampoComentarioVisible(false);
    });

    it('Debe mostrar mensaje alternativo cuando no hay sesión activa', () => {
        // ARRANGE
        VotacionPage.navegarADetalle(3);
        
        // ACT & ASSERT
        VotacionPage.verificarMensajeSinSesion();
    });

    it('Debe ocultar ambos elementos (botón y campo) cuando no hay sesión activa', () => {
        // ARRANGE
        VotacionPage.navegarADetalle(4);
        
        // ACT & ASSERT
        VotacionPage.verificarEstadoSinSesion();
    });

    it('Debe mostrar información del auto pero ocultar controles de votación', () => {
        // ARRANGE
        VotacionPage.navegarADetalle(5);
        
        // ACT & ASSERT
        // Verificar que la información del auto sí está visible
        VotacionPage.verificarInformacionAuto();
        VotacionPage.verificarEspecificacionesAuto();
        
        // Verificar que los controles de votación están ocultos
        VotacionPage.verificarBotonVotarVisible(false);
        VotacionPage.verificarCampoComentarioVisible(false);
        VotacionPage.verificarMensajeSinSesion();
    });

    it('Debe mantener elementos ocultos al navegar entre diferentes autos sin sesión', () => {
        // ARRANGE & ACT
        const autoIds = [1, 2, 3, 4, 5];
        
        autoIds.forEach(autoId => {
            VotacionPage.navegarADetalle(autoId);
            
            // ASSERT: En cada auto, verificar que los elementos están ocultos
            VotacionPage.verificarBotonVotarVisible(false);
            VotacionPage.verificarCampoComentarioVisible(false);
            VotacionPage.verificarMensajeSinSesion();
        });
    });

    it('Debe mostrar elementos después de iniciar sesión', () => {
        // ARRANGE
        VotacionPage.navegarADetalle(1);
        
        // Verificar estado inicial sin sesión
        VotacionPage.verificarEstadoSinSesion();
        
        // ACT: Iniciar sesión
        LoginPage.iniciarSesionConUsuarioValido();
        
        // ASSERT: Verificar que ahora los elementos están visibles
        VotacionPage.verificarEstadoConSesion();
        VotacionPage.verificarBotonVotarVisible(true);
        VotacionPage.verificarCampoComentarioVisible(true);
    });

    it('Debe ocultar elementos después de cerrar sesión', () => {
        // ARRANGE: Iniciar con sesión activa
        LoginPage.iniciarSesionConUsuarioValido();
        VotacionPage.navegarADetalle(2);
        VotacionPage.verificarEstadoConSesion();
        
        // ACT: Cerrar sesión
        LoginPage.cerrarSesion();
        
        // ASSERT: Verificar que los elementos están ocultos
        VotacionPage.verificarBotonVotarVisible(false);
        VotacionPage.verificarCampoComentarioVisible(false);
        VotacionPage.verificarMensajeSinSesion();
    });

    it('Debe mostrar tabla de comentarios sin mostrar controles de votación', () => {
        // ARRANGE
        VotacionPage.navegarADetalle(1);
        
        // ACT & ASSERT
        // La tabla de comentarios debe ser visible para todos
        VotacionPage.verificarTablaComentarios();
        VotacionPage.verificarEncabezadosTablaComentarios();
        
        // Pero los controles de votación deben estar ocultos
        VotacionPage.verificarBotonVotarVisible(false);
        VotacionPage.verificarCampoComentarioVisible(false);
    });
});