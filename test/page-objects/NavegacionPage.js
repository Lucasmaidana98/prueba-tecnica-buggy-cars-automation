const BasePage = require('./BasePage');

/**
 * Page Object para la navegación general de la aplicación
 * Maneja menús, rutas y navegación entre páginas
 */
class NavegacionPage extends BasePage {
    constructor() {
        super();
        this.selectores = testData.selectores.navegacion;
    }

    // Elementos de navegación
    get logo() { return this.selectores.logo; }
    get menuPrincipal() { return this.selectores.menuPrincipal; }
    get linkRegistro() { return this.selectores.linkRegistro; }
    get linkPerfil() { return this.selectores.linkPerfil; }

    // Acciones de navegación
    irAInicio() {
        this.clickear(this.logo);
        return this;
    }

    irARegistro() {
        this.clickear(this.linkRegistro);
        return this;
    }

    irAPerfil() {
        this.clickear(this.linkPerfil);
        return this;
    }

    // Navegación directa por URL
    irAPaginaPrincipal() {
        this.navegarA(testData.navegacion.rutaPrincipal);
        return this;
    }

    irAPaginaRegistro() {
        this.navegarA(testData.navegacion.rutaRegistro);
        return this;
    }

    irAPaginaPerfil() {
        this.navegarA(testData.navegacion.rutaPerfil);
        return this;
    }

    irAPaginaAdmin() {
        this.navegarA(testData.navegacion.rutaAdmin);
        return this;
    }

    // Verificaciones de navegación
    verificarEnPaginaPrincipal() {
        expect(browser.getUrl()).to.include(testData.aplicacion.baseUrl);
        return this;
    }

    verificarTituloPagina() {
        expect(browser.getTitle()).to.equal(testData.aplicacion.titulo);
        return this;
    }

    verificarElementosNavegacion() {
        this.verificarElementoVisible(this.logo);
        this.verificarElementoVisible(this.menuPrincipal);
        return this;
    }

    // Navegación a autos específicos
    navegarAListaAutos() {
        this.navegarA('/overall');
        return this;
    }

    navegarAMarca(marcaId) {
        this.navegarA(`/make/${marcaId}`);
        return this;
    }

    navegarAModelo(modeloId) {
        this.navegarA(`/model/${modeloId}`);
        return this;
    }

    // Utilidades de navegación
    obtenerUrlActual() {
        return browser.getUrl();
    }

    verificarUrl(urlEsperada) {
        expect(this.obtenerUrlActual()).to.include(urlEsperada);
        return this;
    }

    regresarPaginaAnterior() {
        browser.back();
        return this;
    }

    avanzarPaginaSiguiente() {
        browser.forward();
        return this;
    }

    recargarPagina() {
        browser.refresh();
        return this;
    }
}

module.exports = new NavegacionPage();