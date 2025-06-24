const NavegacionPage = require('../../page-objects/NavegacionPage');
const VotacionPage = require('../../page-objects/VotacionPage');

describe('Pruebas Adicionales - Navegación Positiva', function() {
    
    beforeEach(() => {
        console.log('🧪 Preparando pruebas adicionales de navegación positiva');
        NavegacionPage.irAPaginaPrincipal().esperarCarga();
    });

    it('PA11: Debe cargar página principal correctamente', () => {
        // ACT & ASSERT
        NavegacionPage.verificarEnPaginaPrincipal();
        NavegacionPage.verificarTituloPagina();
        NavegacionPage.verificarElementosNavegacion();
    });

    it('PA12: Debe navegar a diferentes modelos de autos', () => {
        // ARRANGE
        const modeloIds = [1, 2, 3, 4, 5];
        
        // ACT & ASSERT
        modeloIds.forEach(modeloId => {
            NavegacionPage.navegarAModelo(modeloId);
            NavegacionPage.verificarUrl(`/model/${modeloId}`);
            VotacionPage.verificarInformacionAuto();
        });
    });

    it('PA13: Debe permitir navegación con botón atrás del navegador', () => {
        // ARRANGE
        const urlInicial = NavegacionPage.obtenerUrlActual();
        
        // ACT
        NavegacionPage.navegarAModelo(1);
        NavegacionPage.regresarPaginaAnterior();
        
        // ASSERT
        expect(NavegacionPage.obtenerUrlActual()).to.include(testData.aplicacion.baseUrl);
    });

    it('PA14: Debe permitir recargar página sin perder funcionalidad', () => {
        // ARRANGE
        NavegacionPage.navegarAModelo(2);
        VotacionPage.verificarInformacionAuto();
        
        // ACT
        NavegacionPage.recargarPagina();
        
        // ASSERT
        VotacionPage.verificarInformacionAuto();
        NavegacionPage.verificarUrl('/model/2');
    });

    it('PA15: Debe mostrar logo y permitir regresar al inicio', () => {
        // ARRANGE
        NavegacionPage.navegarAModelo(3);
        
        // ACT
        NavegacionPage.irAInicio();
        
        // ASSERT
        NavegacionPage.verificarEnPaginaPrincipal();
    });
});