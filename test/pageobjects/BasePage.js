/**
 * Clase base para todos los Page Objects
 * Implementa patrones comunes y utilidades reutilizables
 */
class BasePage {
    constructor() {
        this.timeout = 30000;
    }

    /**
     * Abre una URL específica
     * @param {string} path - Ruta relativa o absoluta
     */
    abrir(path) {
        return browser.url(path);
    }

    /**
     * Espera a que un elemento sea visible
     * @param {WebdriverIO.Element} elemento - Elemento a esperar
     * @param {number} timeout - Timeout personalizado
     */
    esperarVisible(elemento, timeout = this.timeout) {
        return elemento.waitForDisplayed({ timeout });
    }

    /**
     * Espera a que un elemento sea clickeable
     * @param {WebdriverIO.Element} elemento - Elemento a esperar
     * @param {number} timeout - Timeout personalizado
     */
    esperarClickeable(elemento, timeout = this.timeout) {
        return elemento.waitForClickable({ timeout });
    }

    /**
     * Espera a que un elemento contenga texto específico
     * @param {WebdriverIO.Element} elemento - Elemento a esperar
     * @param {string} texto - Texto esperado
     * @param {number} timeout - Timeout personalizado
     */
    esperarTexto(elemento, texto, timeout = this.timeout) {
        return browser.waitUntil(
            () => elemento.getText().includes(texto),
            { timeout, timeoutMsg: `Elemento no contiene el texto esperado: ${texto}` }
        );
    }

    /**
     * Hace clic en un elemento con espera automática
     * @param {WebdriverIO.Element} elemento - Elemento a clickear
     */
    async hacerClick(elemento) {
        await this.esperarClickeable(elemento);
        return elemento.click();
    }

    /**
     * Ingresa texto en un campo con limpieza previa
     * @param {WebdriverIO.Element} elemento - Campo de entrada
     * @param {string} texto - Texto a ingresar
     */
    async ingresarTexto(elemento, texto) {
        await this.esperarVisible(elemento);
        await elemento.clearValue();
        return elemento.setValue(texto);
    }

    /**
     * Obtiene el texto de un elemento
     * @param {WebdriverIO.Element} elemento - Elemento del cual obtener texto
     */
    async obtenerTexto(elemento) {
        await this.esperarVisible(elemento);
        return elemento.getText();
    }

    /**
     * Verifica si un elemento está visible
     * @param {WebdriverIO.Element} elemento - Elemento a verificar
     */
    async estaVisible(elemento) {
        try {
            return await elemento.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Verifica si un elemento existe en el DOM
     * @param {WebdriverIO.Element} elemento - Elemento a verificar
     */
    async existe(elemento) {
        try {
            return await elemento.isExisting();
        } catch (error) {
            return false;
        }
    }

    /**
     * Captura pantalla con nombre personalizado
     * @param {string} nombre - Nombre descriptivo de la captura
     */
    capturarPantalla(nombre) {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const nombreArchivo = `${nombre}_${timestamp}`;
        return browser.saveScreenshot(`./screenshots/${nombreArchivo}.png`);
    }

    /**
     * Espera a que la página termine de cargar
     */
    esperarCargaPagina() {
        return browser.waitUntil(
            () => browser.execute(() => document.readyState === 'complete'),
            { timeout: this.timeout, timeoutMsg: 'La página no terminó de cargar' }
        );
    }

    /**
     * Scroll hasta un elemento específico
     * @param {WebdriverIO.Element} elemento - Elemento hacia el cual hacer scroll
     */
    async scrollHacia(elemento) {
        await this.esperarVisible(elemento);
        return elemento.scrollIntoView();
    }

    /**
     * Obtiene el título de la página actual
     */
    obtenerTituloPagina() {
        return browser.getTitle();
    }

    /**
     * Obtiene la URL actual
     */
    obtenerUrlActual() {
        return browser.getUrl();
    }

    /**
     * Refresca la página actual
     */
    refrescarPagina() {
        return browser.refresh();
    }

    /**
     * Navega hacia atrás en el navegador
     */
    volverAtras() {
        return browser.back();
    }

    /**
     * Pausa la ejecución por X milisegundos
     * @param {number} milisegundos - Tiempo de pausa
     */
    pausar(milisegundos) {
        return browser.pause(milisegundos);
    }
}

module.exports = BasePage;