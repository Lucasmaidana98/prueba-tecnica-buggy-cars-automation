const BasePage = require('./BasePage');

/**
 * Page Object para la funcionalidad de Login
 * Maneja autenticación y estados de sesión
 */
class LoginPage extends BasePage {
    constructor() {
        super();
        this.selectores = testData.selectores.login;
    }

    // Elementos de la página
    get campoUsuario() { return this.selectores.campoUsuario; }
    get campoPassword() { return this.selectores.campoPassword; }
    get botonLogin() { return this.selectores.botonLogin; }
    get errorLogin() { return this.selectores.errorLogin; }
    get usuarioLogueado() { return this.selectores.usuarioLogueado; }
    get botonLogout() { return this.selectores.botonLogout; }

    // Acciones de login
    iniciarSesion(usuario, password) {
        this.escribir(this.campoUsuario, usuario);
        this.escribir(this.campoPassword, password);
        this.clickear(this.botonLogin);
        return this;
    }

    iniciarSesionConUsuarioValido() {
        const usuario = usuarios.usuarioValido;
        return this.iniciarSesion(usuario.username, usuario.password);
    }

    cerrarSesion() {
        if (this.estaLogueado()) {
            this.clickear(this.botonLogout);
        }
        return this;
    }

    // Verificaciones de estado
    estaLogueado() {
        return this.elementoExiste(this.usuarioLogueado);
    }

    verificarLoginExitoso() {
        this.esperarElemento(this.usuarioLogueado);
        this.verificarTextoContiene(this.usuarioLogueado, testData.mensajes.loginExitoso);
        return this;
    }

    verificarLoginFallido() {
        this.esperarElemento(this.errorLogin);
        this.verificarTextoContiene(this.errorLogin, testData.mensajes.loginFallido);
        return this;
    }

    verificarCamposLoginVisibles() {
        this.verificarElementoVisible(this.campoUsuario);
        this.verificarElementoVisible(this.campoPassword);
        this.verificarElementoVisible(this.botonLogin);
        return this;
    }

    verificarEstadoSinSesion() {
        this.verificarElementoVisible(this.usuarioLogueado, false);
        this.verificarCamposLoginVisibles();
        return this;
    }

    // Utilidades
    limpiarCampos() {
        if (this.elementoExiste(this.campoUsuario)) {
            browser.$(this.campoUsuario).clearValue();
        }
        if (this.elementoExiste(this.campoPassword)) {
            browser.$(this.campoPassword).clearValue();
        }
        return this;
    }

    obtenerNombreUsuario() {
        if (this.estaLogueado()) {
            const textoCompleto = this.obtenerTexto(this.usuarioLogueado);
            return textoCompleto.replace('Hi, ', '').trim();
        }
        return null;
    }
}

module.exports = new LoginPage();