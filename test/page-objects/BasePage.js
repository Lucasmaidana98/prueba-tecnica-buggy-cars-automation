/**
 * Clase base para todos los Page Objects
 * Implementa patrones SENIOR y buenas prácticas
 */
class BasePage {
    constructor() {
        this.timeout = testData.aplicacion.timeout;
    }

    // Métodos base para interacciones
    esperarElemento(selector, timeout = this.timeout) {
        browser.waitForExist(selector, timeout);
        browser.waitForDisplayed(selector, timeout);
        return browser.$(selector);
    }

    clickear(selector) {
        const elemento = this.esperarElemento(selector);
        elemento.click();
        return this;
    }

    escribir(selector, texto) {
        const elemento = this.esperarElemento(selector);
        elemento.clearValue();
        elemento.setValue(texto);
        return this;
    }

    obtenerTexto(selector) {
        const elemento = this.esperarElemento(selector);
        return elemento.getText();
    }

    verificarElementoVisible(selector, visible = true) {
        if (visible) {
            expect(browser.$(selector).isDisplayed()).to.be.true;
        } else {
            expect(browser.$(selector).isExisting()).to.be.false;
        }
        return this;
    }

    verificarTextoContiene(selector, textoEsperado) {
        const textoActual = this.obtenerTexto(selector);
        expect(textoActual).to.include(textoEsperado);
        return this;
    }

    navegarA(url) {
        browser.url(url);
        return this;
    }

    esperarCarga() {
        browser.waitUntil(
            () => browser.execute(() => document.readyState === 'complete'),
            {
                timeout: this.timeout,
                timeoutMsg: 'La página no terminó de cargar'
            }
        );
        return this;
    }

    capturarPantalla(nombre) {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        browser.saveScreenshot(`./screenshots/${nombre}_${timestamp}.png`);
        return this;
    }

    // Utilidad para manejar elementos que pueden no existir
    elementoExiste(selector) {
        return browser.$(selector).isExisting();
    }

    // Utilidad para scroll hasta elemento
    scrollHaciaElemento(selector) {
        const elemento = this.esperarElemento(selector);
        elemento.scrollIntoView();
        return this;
    }

    // Utilidad para manejo de alerts
    manejarAlert(aceptar = true) {
        browser.waitUntil(() => {
            try {
                browser.getAlertText();
                return true;
            } catch (error) {
                return false;
            }
        }, { timeout: 5000 });

        if (aceptar) {
            browser.acceptAlert();
        } else {
            browser.dismissAlert();
        }
        return this;
    }
}

module.exports = BasePage;