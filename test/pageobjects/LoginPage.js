const BasePage = require('./BasePage');

/**
 * Page Object para la funcionalidad de Login
 * Maneja todos los elementos y acciones relacionadas con autenticación
 */
class LoginPage extends BasePage {
    
    // ==========================================
    // SELECTORES DE ELEMENTOS
    // ==========================================
    
    get campoLogin() { 
        return $('input[name="login"]'); 
    }
    
    get campoPassword() { 
        return $('input[name="password"]'); 
    }
    
    get botonLogin() { 
        return $('button.btn.btn-success[type="submit"]'); 
    }
    
    get enlaceRegistro() { 
        return $('a.btn.btn-success-outline[href="/register"]'); 
    }
    
    get formularioLogin() { 
        return $('form.form-inline'); 
    }
    
    get contenedorLogin() { 
        return $('div.pull-xs-right'); 
    }
    
    // Elementos para usuario logueado
    get mensajeBienvenida() { 
        return $('span.nav-link.disabled'); 
    }
    
    get enlacePerfil() { 
        return $('a.nav-link[href="/profile"]'); 
    }
    
    get botonLogout() { 
        return $('a.nav-link[href="javascript:void(0)"]'); 
    }
    
    get menuNavegacion() { 
        return $('ul.nav.navbar-nav'); 
    }
    
    // Elementos de error
    get mensajeError() { 
        return $('.alert-danger, .error-message, .invalid-feedback'); 
    }
    
    get logoAplicacion() { 
        return $('a.navbar-brand[href="/"]'); 
    }

    // ==========================================
    // MÉTODOS DE ACCIÓN
    // ==========================================

    /**
     * Realiza el proceso completo de login
     * @param {string} usuario - Email/usuario
     * @param {string} password - Contraseña
     */
    async iniciarSesion(usuario, password) {
        console.log(`🔐 Iniciando sesión con usuario: ${usuario}`);
        
        await this.esperarVisible(this.campoLogin);
        await this.ingresarTexto(this.campoLogin, usuario);
        await this.ingresarTexto(this.campoPassword, password);
        await this.hacerClick(this.botonLogin);
        
        // Esperar a que la página procese el login
        await this.pausar(2000);
        
        console.log('✅ Proceso de login completado');
    }

    /**
     * Verifica si el formulario de login está visible
     */
    async formularioLoginVisible() {
        return await this.estaVisible(this.formularioLogin);
    }

    /**
     * Verifica si el usuario está autenticado
     */
    async usuarioEstaAutenticado() {
        try {
            await this.esperarVisible(this.mensajeBienvenida, 5000);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtiene el nombre del usuario logueado
     */
    async obtenerNombreUsuario() {
        if (await this.usuarioEstaAutenticado()) {
            const textoCompleto = await this.obtenerTexto(this.mensajeBienvenida);
            // Extraer el nombre del texto "Hi, test"
            return textoCompleto.replace('Hi, ', '').trim();
        }
        return null;
    }

    /**
     * Cierra la sesión del usuario
     */
    async cerrarSesion() {
        console.log('🚪 Cerrando sesión...');
        
        if (await this.usuarioEstaAutenticado()) {
            await this.hacerClick(this.botonLogout);
            await this.pausar(2000);
            console.log('✅ Sesión cerrada exitosamente');
        } else {
            console.log('ℹ️ El usuario no está autenticado');
        }
    }

    /**
     * Navega a la página de registro
     */
    async irARegistro() {
        console.log('📝 Navegando a registro...');
        await this.hacerClick(this.enlaceRegistro);
    }

    /**
     * Verifica si hay mensajes de error visibles
     */
    async hayMensajeError() {
        return await this.estaVisible(this.mensajeError);
    }

    /**
     * Obtiene el texto del mensaje de error
     */
    async obtenerMensajeError() {
        if (await this.hayMensajeError()) {
            return await this.obtenerTexto(this.mensajeError);
        }
        return null;
    }

    /**
     * Limpia los campos del formulario de login
     */
    async limpiarFormulario() {
        console.log('🧹 Limpiando formulario de login...');
        
        if (await this.estaVisible(this.campoLogin)) {
            await this.campoLogin.clearValue();
        }
        
        if (await this.estaVisible(this.campoPassword)) {
            await this.campoPassword.clearValue();
        }
    }

    /**
     * Verifica que todos los elementos del formulario estén presentes
     */
    async verificarElementosFormulario() {
        const elementos = {
            campoLogin: await this.existe(this.campoLogin),
            campoPassword: await this.existe(this.campoPassword),
            botonLogin: await this.existe(this.botonLogin),
            enlaceRegistro: await this.existe(this.enlaceRegistro)
        };
        
        console.log('🔍 Verificación de elementos del formulario:', elementos);
        return elementos;
    }

    /**
     * Navega al home de la aplicación
     */
    async irAHome() {
        console.log('🏠 Navegando al home...');
        await this.hacerClick(this.logoAplicacion);
        await this.esperarCargaPagina();
    }

    // ==========================================
    // MÉTODOS DE VALIDACIÓN
    // ==========================================

    /**
     * Valida el estado de autenticación esperado
     * @param {boolean} debeEstarAutenticado - Estado esperado
     */
    async validarEstadoAutenticacion(debeEstarAutenticado) {
        const estaAutenticado = await this.usuarioEstaAutenticado();
        
        if (debeEstarAutenticado) {
            expect(estaAutenticado).to.be.true;
            console.log('✅ Usuario correctamente autenticado');
        } else {
            expect(estaAutenticado).to.be.false;
            console.log('✅ Usuario correctamente NO autenticado');
        }
        
        return estaAutenticado;
    }

    /**
     * Valida que el formulario de login sea visible cuando no hay sesión
     */
    async validarFormularioLoginVisible() {
        const formularioVisible = await this.formularioLoginVisible();
        expect(formularioVisible).to.be.true;
        console.log('✅ Formulario de login visible');
        return formularioVisible;
    }

    /**
     * Valida que el mensaje de bienvenida contenga el nombre correcto
     * @param {string} nombreEsperado - Nombre que debería aparecer
     */
    async validarMensajeBienvenida(nombreEsperado) {
        const nombreObtenido = await this.obtenerNombreUsuario();
        expect(nombreObtenido).to.equal(nombreEsperado);
        console.log(`✅ Mensaje de bienvenida correcto: Hi, ${nombreObtenido}`);
        return nombreObtenido;
    }
}

module.exports = new LoginPage();