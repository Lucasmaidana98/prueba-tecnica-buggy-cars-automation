const BasePage = require('./BasePage');

/**
 * Page Object para la funcionalidad de Votación
 * Maneja votación de autos y comentarios
 */
class VotacionPage extends BasePage {
    constructor() {
        super();
        this.selectores = testData.selectores;
    }

    // Elementos de votación
    get botonVotar() { return this.selectores.votacion.botonVotar; }
    get campoComentario() { return this.selectores.votacion.campoComentario; }
    get contadorVotos() { return this.selectores.votacion.contadorVotos; }
    get mensajeEstado() { return this.selectores.votacion.mensajeEstado; }
    get alertaError() { return this.selectores.votacion.alertaError; }
    get alertaExito() { return this.selectores.votacion.alertaExito; }

    // Elementos de comentarios
    get tablaComentarios() { return this.selectores.comentarios.tablaComentarios; }
    get filaComentario() { return this.selectores.comentarios.filaComentario; }

    // Elementos del auto
    get imagenAuto() { return this.selectores.auto.imagen; }
    get descripcionAuto() { return this.selectores.auto.descripcion; }
    get especificacionesAuto() { return this.selectores.auto.especificaciones; }

    // Acciones de votación
    votarAuto(comentario = '') {
        if (comentario) {
            this.escribir(this.campoComentario, comentario);
        }
        this.clickear(this.botonVotar);
        return this;
    }

    votarConComentario(comentario) {
        return this.votarAuto(comentario);
    }

    votarSinComentario() {
        return this.votarAuto();
    }

    // Verificaciones de votación
    verificarBotonVotarVisible(visible = true) {
        this.verificarElementoVisible(this.botonVotar, visible);
        return this;
    }

    verificarCampoComentarioVisible(visible = true) {
        this.verificarElementoVisible(this.campoComentario, visible);
        return this;
    }

    verificarVotacionExitosa() {
        this.esperarElemento(this.alertaExito);
        this.verificarTextoContiene(this.alertaExito, testData.mensajes.votacionExitosa);
        return this;
    }

    verificarVotacionFallida() {
        this.esperarElemento(this.alertaError);
        return this;
    }

    verificarMensajeSinSesion() {
        this.verificarTextoContiene(this.mensajeEstado, testData.mensajes.sinSesion);
        return this;
    }

    obtenerNumeroVotos() {
        const textoVotos = this.obtenerTexto(this.contadorVotos);
        return parseInt(textoVotos.match(/\\d+/)[0]);
    }

    verificarIncrementoVotos(votosAnteriores) {
        const votosActuales = this.obtenerNumeroVotos();
        expect(votosActuales).to.be.greaterThan(votosAnteriores);
        return this;
    }

    // Verificaciones de comentarios
    verificarTablaComentarios() {
        this.verificarElementoVisible(this.tablaComentarios);
        return this;
    }

    verificarEncabezadosTablaComentarios() {
        this.verificarElementoVisible(this.selectores.comentarios.encabezadoFecha);
        this.verificarElementoVisible(this.selectores.comentarios.encabezadoAutor);
        this.verificarElementoVisible(this.selectores.comentarios.encabezadoComentario);
        return this;
    }

    obtenerComentarios() {
        const filas = browser.$$(this.filaComentario);
        return filas.map(fila => {
            const celdas = fila.$$('td');
            return {
                fecha: celdas[0].getText(),
                autor: celdas[1].getText(),
                comentario: celdas[2].getText()
            };
        });
    }

    verificarComentarioEnTabla(comentario, autor) {
        const comentarios = this.obtenerComentarios();
        const comentarioEncontrado = comentarios.find(c => 
            c.comentario.includes(comentario) && c.autor.includes(autor)
        );
        expect(comentarioEncontrado).to.not.be.undefined;
        return this;
    }

    // Verificaciones del auto
    verificarInformacionAuto() {
        this.verificarElementoVisible(this.imagenAuto);
        this.verificarElementoVisible(this.descripcionAuto);
        this.verificarElementoVisible(this.contadorVotos);
        return this;
    }

    verificarEspecificacionesAuto() {
        this.verificarElementoVisible(this.especificacionesAuto);
        return this;
    }

    obtenerDescripcionAuto() {
        return this.obtenerTexto(this.descripcionAuto);
    }

    // Navegación a un auto específico
    navegarADetalle(autoId) {
        this.navegarA(`/model/${autoId}`);
        return this;
    }

    // Verificaciones de estado para usuarios no logueados
    verificarEstadoSinSesion() {
        this.verificarBotonVotarVisible(false);
        this.verificarCampoComentarioVisible(false);
        this.verificarMensajeSinSesion();
        return this;
    }

    // Verificaciones de estado para usuarios logueados
    verificarEstadoConSesion() {
        this.verificarBotonVotarVisible(true);
        this.verificarCampoComentarioVisible(true);
        return this;
    }
}

module.exports = new VotacionPage();