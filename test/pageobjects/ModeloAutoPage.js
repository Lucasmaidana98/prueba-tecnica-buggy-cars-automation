const BasePage = require('./BasePage');

/**
 * Page Object para la página de detalles de un modelo de auto
 * Maneja la funcionalidad de votación y comentarios
 */
class ModeloAutoPage extends BasePage {
    
    // ==========================================
    // SELECTORES DE ELEMENTOS
    // ==========================================
    
    // Información del auto
    get tituloModelo() { 
        return $('h1, h2, .model-title'); 
    }
    
    get imagenAuto() { 
        return $('img.img-thumbnail, .car-image img'); 
    }
    
    get descripcionAuto() { 
        return $('.description, .car-description'); 
    }
    
    get especificacionesAuto() { 
        return $('h4:contains("Specification"), .specifications'); 
    }
    
    // Elementos de votación
    get contadorVotos() { 
        return $('h4:contains("Votes"), .vote-count'); 
    }
    
    get botonVotar() { 
        return $('button:contains("Vote"), .vote-button, input[type="submit"][value*="vote"]'); 
    }
    
    get mensajeVotoExitoso() { 
        return $('p.card-text:contains("Thank you for your vote!")'); 
    }
    
    get mensajeRequiereLogin() { 
        return $('p.card-text:contains("You need to be logged in to vote.")'); 
    }
    
    get estadoVoto() { 
        return $('p.card-text, .vote-status'); 
    }
    
    // Elementos de comentarios
    get tablaComentarios() { 
        return $('table.table'); 
    }
    
    get encabezadoTablaComentarios() { 
        return $('thead.thead-inverse, table thead'); 
    }
    
    get filasComentarios() { 
        return $$('table tbody tr, .comment-row'); 
    }
    
    get campoComentario() { 
        return $('textarea[name="comment"], .comment-input'); 
    }
    
    get botonEnviarComentario() { 
        return $('button:contains("Submit"), input[type="submit"][value*="comment"]'); 
    }
    
    get formularioComentario() { 
        return $('form.comment-form, form:has(textarea)'); 
    }
    
    // Columnas específicas de la tabla de comentarios
    get columnaFecha() { 
        return $('th:contains("Date"), .date-column'); 
    }
    
    get columnaAutor() { 
        return $('th:contains("Author"), .author-column'); 
    }
    
    get columnaComentario() { 
        return $('th:contains("Comment"), .comment-column'); 
    }
    
    // Navegación y otros elementos
    get enlaceVolverALista() { 
        return $('a:contains("Back"), .back-link'); 
    }
    
    get paginacionComentarios() { 
        return $('my-pager, .pagination'); 
    }

    // ==========================================
    // MÉTODOS DE NAVEGACIÓN
    // ==========================================

    /**
     * Navega a un modelo específico de auto
     * @param {string} makeId - ID de la marca
     * @param {string} modelId - ID del modelo
     */
    async navegarAModelo(makeId, modelId) {
        const url = `/model/${makeId}|${modelId}`;
        console.log(`🚗 Navegando al modelo: ${url}`);
        
        await this.abrir(url);
        await this.esperarCargaPagina();
        
        console.log('✅ Página del modelo cargada');
    }

    /**
     * Navega a un modelo usando el enlace desde la lista
     * @param {string} nombreModelo - Nombre del modelo a buscar
     */
    async navegarAModeloPorNombre(nombreModelo) {
        console.log(`🔍 Buscando modelo: ${nombreModelo}`);
        
        const enlaceModelo = $(`a:contains("${nombreModelo}")`);
        await this.hacerClick(enlaceModelo);
        await this.esperarCargaPagina();
        
        console.log(`✅ Navegado al modelo: ${nombreModelo}`);
    }

    // ==========================================
    // MÉTODOS DE INFORMACIÓN DEL AUTO
    // ==========================================

    /**
     * Obtiene la información completa del auto
     */
    async obtenerInformacionAuto() {
        const informacion = {
            titulo: '',
            descripcion: '',
            especificaciones: '',
            cantidadVotos: 0,
            imagenVisible: false
        };

        try {
            // Título del modelo
            if (await this.existe(this.tituloModelo)) {
                informacion.titulo = await this.obtenerTexto(this.tituloModelo);
            }

            // Descripción
            if (await this.existe(this.descripcionAuto)) {
                informacion.descripcion = await this.obtenerTexto(this.descripcionAuto);
            }

            // Especificaciones
            if (await this.existe(this.especificacionesAuto)) {
                informacion.especificaciones = await this.obtenerTexto(this.especificacionesAuto);
            }

            // Cantidad de votos
            if (await this.existe(this.contadorVotos)) {
                const textoVotos = await this.obtenerTexto(this.contadorVotos);
                const match = textoVotos.match(/(\d+)/);
                informacion.cantidadVotos = match ? parseInt(match[1]) : 0;
            }

            // Verificar si la imagen está visible
            informacion.imagenVisible = await this.estaVisible(this.imagenAuto);

        } catch (error) {
            console.error('Error obteniendo información del auto:', error.message);
        }

        console.log('📊 Información del auto obtenida:', informacion);
        return informacion;
    }

    /**
     * Obtiene la cantidad actual de votos
     */
    async obtenerCantidadVotos() {
        try {
            const textoVotos = await this.obtenerTexto(this.contadorVotos);
            const match = textoVotos.match(/(\d+)/);
            const cantidad = match ? parseInt(match[1]) : 0;
            
            console.log(`🗳️ Cantidad de votos actual: ${cantidad}`);
            return cantidad;
        } catch (error) {
            console.error('Error obteniendo cantidad de votos:', error.message);
            return 0;
        }
    }

    // ==========================================
    // MÉTODOS DE VOTACIÓN
    // ==========================================

    /**
     * Realiza el proceso de votación
     */
    async votarAuto() {
        console.log('🗳️ Iniciando proceso de votación...');
        
        const votosAntes = await this.obtenerCantidadVotos();
        console.log(`📊 Votos antes de votar: ${votosAntes}`);
        
        // Verificar si el botón de votar está visible
        if (await this.estaVisible(this.botonVotar)) {
            await this.hacerClick(this.botonVotar);
            await this.pausar(3000); // Esperar procesamiento del voto
            
            console.log('✅ Voto enviado');
            return true;
        } else {
            console.log('❌ Botón de votar no disponible');
            return false;
        }
    }

    /**
     * Verifica si el usuario puede votar
     */
    async puedeVotar() {
        return await this.estaVisible(this.botonVotar);
    }

    /**
     * Verifica el estado del voto
     */
    async verificarEstadoVoto() {
        const estado = {
            puedeVotar: false,
            yavaVoto: false,
            requiereLogin: false,
            mensaje: ''
        };

        try {
            // Verificar si puede votar
            estado.puedeVotar = await this.estaVisible(this.botonVotar);

            // Verificar mensaje de agradecimiento por voto
            if (await this.estaVisible(this.mensajeVotoExitoso)) {
                estado.yavaVoto = true;
                estado.mensaje = await this.obtenerTexto(this.mensajeVotoExitoso);
            }

            // Verificar mensaje de requerimiento de login
            if (await this.estaVisible(this.mensajeRequiereLogin)) {
                estado.requiereLogin = true;
                estado.mensaje = await this.obtenerTexto(this.mensajeRequiereLogin);
            }

            // Si hay otros mensajes de estado
            if (await this.estaVisible(this.estadoVoto) && !estado.mensaje) {
                estado.mensaje = await this.obtenerTexto(this.estadoVoto);
            }

        } catch (error) {
            console.error('Error verificando estado del voto:', error.message);
        }

        console.log('🎯 Estado del voto:', estado);
        return estado;
    }

    // ==========================================
    // MÉTODOS DE COMENTARIOS
    // ==========================================

    /**
     * Envía un comentario
     * @param {string} textoComentario - Texto del comentario
     */
    async enviarComentario(textoComentario) {
        console.log(`💬 Enviando comentario: "${textoComentario}"`);
        
        if (await this.estaVisible(this.campoComentario)) {
            await this.ingresarTexto(this.campoComentario, textoComentario);
            
            if (await this.estaVisible(this.botonEnviarComentario)) {
                await this.hacerClick(this.botonEnviarComentario);
                await this.pausar(3000); // Esperar procesamiento
                
                console.log('✅ Comentario enviado');
                return true;
            }
        }
        
        console.log('❌ No se pudo enviar el comentario');
        return false;
    }

    /**
     * Verifica si se puede comentar
     */
    async puedeComentarar() {
        const campoVisible = await this.estaVisible(this.campoComentario);
        const botonVisible = await this.estaVisible(this.botonEnviarComentario);
        
        return campoVisible && botonVisible;
    }

    /**
     * Obtiene todos los comentarios de la tabla
     */
    async obtenerComentarios() {
        const comentarios = [];
        
        try {
            if (await this.estaVisible(this.tablaComentarios)) {
                const filas = await this.filasComentarios;
                
                for (let i = 0; i < filas.length; i++) {
                    const fila = filas[i];
                    const celdas = await fila.$$('td');
                    
                    if (celdas.length >= 3) {
                        const comentario = {
                            fecha: await celdas[0].getText(),
                            autor: await celdas[1].getText(),
                            comentario: await celdas[2].getText()
                        };
                        
                        comentarios.push(comentario);
                    }
                }
            }
        } catch (error) {
            console.error('Error obteniendo comentarios:', error.message);
        }
        
        console.log(`📝 Comentarios obtenidos: ${comentarios.length}`);
        return comentarios;
    }

    /**
     * Verifica si la tabla de comentarios está presente y tiene la estructura correcta
     */
    async verificarTablaComentarios() {
        const verificacion = {
            tablaPresente: false,
            encabezadosCorrecto: false,
            columnas: {
                fecha: false,
                autor: false,
                comentario: false
            }
        };

        try {
            // Verificar si la tabla existe
            verificacion.tablaPresente = await this.estaVisible(this.tablaComentarios);
            
            if (verificacion.tablaPresente) {
                // Verificar encabezados
                verificacion.columnas.fecha = await this.estaVisible(this.columnaFecha);
                verificacion.columnas.autor = await this.estaVisible(this.columnaAutor);
                verificacion.columnas.comentario = await this.estaVisible(this.columnaComentario);
                
                verificacion.encabezadosCorrecto = verificacion.columnas.fecha && 
                                                  verificacion.columnas.autor && 
                                                  verificacion.columnas.comentario;
            }
        } catch (error) {
            console.error('Error verificando tabla de comentarios:', error.message);
        }

        console.log('🔍 Verificación tabla de comentarios:', verificacion);
        return verificacion;
    }

    /**
     * Busca un comentario específico en la tabla
     * @param {string} textoComentario - Texto del comentario a buscar
     * @param {string} autor - Autor del comentario (opcional)
     */
    async buscarComentario(textoComentario, autor = null) {
        const comentarios = await this.obtenerComentarios();
        
        return comentarios.find(comentario => {
            const coincideTexto = comentario.comentario.includes(textoComentario);
            const coincideAutor = autor ? comentario.autor === autor : true;
            return coincideTexto && coincideAutor;
        });
    }

    // ==========================================
    // MÉTODOS DE VALIDACIÓN
    // ==========================================

    /**
     * Valida que la información del auto esté completa
     */
    async validarInformacionCompleta() {
        const info = await this.obtenerInformacionAuto();
        
        expect(info.titulo).to.not.be.empty;
        expect(info.cantidadVotos).to.be.at.least(0);
        expect(info.imagenVisible).to.be.true;
        
        console.log('✅ Información del auto completa y válida');
        return info;
    }

    /**
     * Valida el proceso de votación para usuario autenticado
     */
    async validarVotacionUsuarioAutenticado() {
        const estadoAntes = await this.verificarEstadoVoto();
        const votosAntes = await this.obtenerCantidadVotos();
        
        if (estadoAntes.puedeVotar) {
            const votoExitoso = await this.votarAuto();
            expect(votoExitoso).to.be.true;
            
            // Verificar cambio de estado después del voto
            const estadoDespues = await this.verificarEstadoVoto();
            expect(estadoDespues.yavaVoto).to.be.true;
            
            const votosDespues = await this.obtenerCantidadVotos();
            expect(votosDespues).to.be.greaterThan(votosAntes);
            
            console.log('✅ Votación de usuario autenticado validada');
        }
    }

    /**
     * Valida que usuario no autenticado no pueda votar
     */
    async validarVotacionUsuarioNoAutenticado() {
        const estado = await this.verificarEstadoVoto();
        
        expect(estado.puedeVotar).to.be.false;
        expect(estado.requiereLogin).to.be.true;
        expect(estado.mensaje).to.include('logged in');
        
        console.log('✅ Validación de usuario no autenticado correcta');
    }

    /**
     * Valida la estructura y funcionalidad de comentarios
     */
    async validarSistemaComentarios() {
        const verificacion = await this.verificarTablaComentarios();
        
        expect(verificacion.tablaPresente).to.be.true;
        expect(verificacion.encabezadosCorrecto).to.be.true;
        expect(verificacion.columnas.fecha).to.be.true;
        expect(verificacion.columnas.autor).to.be.true;
        expect(verificacion.columnas.comentario).to.be.true;
        
        console.log('✅ Sistema de comentarios validado');
        return verificacion;
    }
}

module.exports = new ModeloAutoPage();