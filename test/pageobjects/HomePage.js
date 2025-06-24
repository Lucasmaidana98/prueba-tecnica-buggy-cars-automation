const BasePage = require('./BasePage');

/**
 * Page Object para la página principal de Buggy Cars Rating
 * Maneja la navegación principal y listado de autos
 */
class HomePage extends BasePage {
    
    // ==========================================
    // SELECTORES DE ELEMENTOS
    // ==========================================
    
    // Header y navegación principal
    get logoAplicacion() { 
        return $('a.navbar-brand[href="/"]'); 
    }
    
    get navegacionPrincipal() { 
        return $('nav.navbar'); 
    }
    
    get tituloHero() { 
        return $('h1.display-4'); 
    }
    
    get imagenHero() { 
        return $('img.img-fluid[src="/img/header-car.gif"]'); 
    }
    
    // Cards principales de la página
    get cardMarcaPopular() { 
        return $('h2:contains("Popular Make")').parentElement(); 
    }
    
    get cardModeloPopular() { 
        return $('h2:contains("Popular Model")').parentElement(); 
    }
    
    get cardRatingGeneral() { 
        return $('h2:contains("Overall Rating")').parentElement(); 
    }
    
    // Enlaces de navegación de cards
    get enlaceMarcaPopular() { 
        return $('a[href="/make/ckl2phsabijs71623vk0"]'); 
    }
    
    get enlaceModeloPopular() { 
        return $('a[href="/model/ckl2phsabijs71623vk0|ckl2phsabijs71623vqg"]'); 
    }
    
    get enlaceRatingGeneral() { 
        return $('a[href="/overall"]'); 
    }
    
    // Imágenes de las cards
    get imagenLamborghini() { 
        return $('img[src="/img/cars/Lamborghini-Logo.png"]'); 
    }
    
    get imagenDiablo() { 
        return $('img[src="/img/cars/Diablo.jpg"]'); 
    }
    
    get imagenOverall() { 
        return $('img[src="/img/overall.jpg"]'); 
    }
    
    // Información de votos
    get votosLamborghini() { 
        return $('small:contains("votes")').first(); 
    }
    
    get votosDiablo() { 
        return $('small:contains("votes")').nth(1); 
    }
    
    // Footer
    get footerPagina() { 
        return $('footer.footer'); 
    }
    
    get enlaceFacebook() { 
        return $('a[href="https://www.facebook.com"]'); 
    }
    
    get enlaceTwitter() { 
        return $('a[href="https://www.twitter.com"]'); 
    }
    
    get copyright() { 
        return $('p:contains("2016 Buggy Software")'); 
    }

    // ==========================================
    // MÉTODOS DE NAVEGACIÓN
    // ==========================================

    /**
     * Abre la página principal
     */
    async abrirPaginaPrincipal() {
        console.log('🏠 Abriendo página principal...');
        
        await this.abrir('/');
        await this.esperarCargaPagina();
        await this.esperarVisible(this.logoAplicacion);
        
        console.log('✅ Página principal cargada');
    }

    /**
     * Navega a la marca popular (Lamborghini)
     */
    async navegarAMarcaPopular() {
        console.log('🚗 Navegando a marca popular...');
        
        await this.hacerClick(this.enlaceMarcaPopular);
        await this.esperarCargaPagina();
        
        console.log('✅ Navegado a marca popular');
    }

    /**
     * Navega al modelo popular (Diablo)
     */
    async navegarAModeloPopular() {
        console.log('🏎️ Navegando a modelo popular...');
        
        await this.hacerClick(this.enlaceModeloPopular);
        await this.esperarCargaPagina();
        
        console.log('✅ Navegado a modelo popular');
    }

    /**
     * Navega al rating general
     */
    async navegarARatingGeneral() {
        console.log('📊 Navegando a rating general...');
        
        await this.hacerClick(this.enlaceRatingGeneral);
        await this.esperarCargaPagina();
        
        console.log('✅ Navegado a rating general');
    }

    /**
     * Regresa al home desde cualquier página
     */
    async regresarAlHome() {
        console.log('🔙 Regresando al home...');
        
        await this.hacerClick(this.logoAplicacion);
        await this.esperarCargaPagina();
        
        console.log('✅ De vuelta en home');
    }

    // ==========================================
    // MÉTODOS DE INFORMACIÓN
    // ==========================================

    /**
     * Obtiene la información de las cards principales
     */
    async obtenerInformacionCards() {
        const informacion = {
            marcaPopular: {
                nombre: '',
                votos: 0,
                imagenVisible: false
            },
            modeloPopular: {
                nombre: '',
                votos: 0,
                imagenVisible: false
            },
            ratingGeneral: {
                descripcion: '',
                imagenVisible: false
            }
        };

        try {
            // Información marca popular
            if (await this.existe(this.cardMarcaPopular)) {
                const textoCard = await this.obtenerTexto(this.cardMarcaPopular);
                informacion.marcaPopular.nombre = this.extraerNombreMarca(textoCard);
                informacion.marcaPopular.votos = this.extraerVotos(textoCard);
                informacion.marcaPopular.imagenVisible = await this.estaVisible(this.imagenLamborghini);
            }

            // Información modelo popular
            if (await this.existe(this.cardModeloPopular)) {
                const textoCard = await this.obtenerTexto(this.cardModeloPopular);
                informacion.modeloPopular.nombre = this.extraerNombreModelo(textoCard);
                informacion.modeloPopular.votos = this.extraerVotos(textoCard);
                informacion.modeloPopular.imagenVisible = await this.estaVisible(this.imagenDiablo);
            }

            // Información rating general
            if (await this.existe(this.cardRatingGeneral)) {
                const textoCard = await this.obtenerTexto(this.cardRatingGeneral);
                informacion.ratingGeneral.descripcion = textoCard;
                informacion.ratingGeneral.imagenVisible = await this.estaVisible(this.imagenOverall);
            }

        } catch (error) {
            console.error('Error obteniendo información de cards:', error.message);
        }

        console.log('📊 Información de cards obtenida:', informacion);
        return informacion;
    }

    /**
     * Verifica que todos los elementos principales estén visibles
     */
    async verificarElementosPrincipales() {
        const elementos = {
            logo: await this.estaVisible(this.logoAplicacion),
            tituloHero: await this.estaVisible(this.tituloHero),
            imagenHero: await this.estaVisible(this.imagenHero),
            cardMarcaPopular: await this.estaVisible(this.cardMarcaPopular),
            cardModeloPopular: await this.estaVisible(this.cardModeloPopular),
            cardRatingGeneral: await this.estaVisible(this.cardRatingGeneral),
            footer: await this.estaVisible(this.footerPagina)
        };

        console.log('🔍 Verificación de elementos principales:', elementos);
        return elementos;
    }

    /**
     * Obtiene el título de la aplicación
     */
    async obtenerTituloAplicacion() {
        return await this.obtenerTexto(this.tituloHero);
    }

    // ==========================================
    // MÉTODOS AUXILIARES PRIVADOS
    // ==========================================

    /**
     * Extrae el nombre de la marca del texto de la card
     * @param {string} textoCard - Texto completo de la card
     */
    extraerNombreMarca(textoCard) {
        const match = textoCard.match(/([A-Za-z]+)\s*\(/);
        return match ? match[1] : '';
    }

    /**
     * Extrae el nombre del modelo del texto de la card
     * @param {string} textoCard - Texto completo de la card
     */
    extraerNombreModelo(textoCard) {
        const lineas = textoCard.split('\n');
        for (let linea of lineas) {
            if (linea.includes('votes') && !linea.includes('Popular')) {
                return linea.replace(/\([^)]*\)/, '').trim();
            }
        }
        return '';
    }

    /**
     * Extrae la cantidad de votos del texto
     * @param {string} texto - Texto que contiene la información de votos
     */
    extraerVotos(texto) {
        const match = texto.match(/\((\d+)\s*votes?\)/);
        return match ? parseInt(match[1]) : 0;
    }

    // ==========================================
    // MÉTODOS DE VALIDACIÓN
    // ==========================================

    /**
     * Valida que la página principal esté completamente cargada
     */
    async validarPaginaPrincipalCargada() {
        const elementos = await this.verificarElementosPrincipales();
        
        expect(elementos.logo).to.be.true;
        expect(elementos.tituloHero).to.be.true;
        expect(elementos.imagenHero).to.be.true;
        expect(elementos.cardMarcaPopular).to.be.true;
        expect(elementos.cardModeloPopular).to.be.true;
        expect(elementos.cardRatingGeneral).to.be.true;
        
        console.log('✅ Página principal validada correctamente');
        return elementos;
    }

    /**
     * Valida que las imágenes de las cards estén visibles
     */
    async validarImagenesVisibles() {
        const imagenesVisibles = {
            lamborghini: await this.estaVisible(this.imagenLamborghini),
            diablo: await this.estaVisible(this.imagenDiablo),
            overall: await this.estaVisible(this.imagenOverall)
        };

        expect(imagenesVisibles.lamborghini).to.be.true;
        expect(imagenesVisibles.diablo).to.be.true;
        expect(imagenesVisibles.overall).to.be.true;

        console.log('✅ Todas las imágenes están visibles');
        return imagenesVisibles;
    }

    /**
     * Valida que los enlaces de navegación funcionen
     */
    async validarEnlacesNavegacion() {
        const urlBase = await this.obtenerUrlActual();
        
        // Probar navegación a marca popular
        await this.navegarAMarcaPopular();
        let urlActual = await this.obtenerUrlActual();
        expect(urlActual).to.include('/make/');
        
        // Regresar al home
        await this.regresarAlHome();
        urlActual = await this.obtenerUrlActual();
        expect(urlActual).to.equal(urlBase);
        
        // Probar navegación a modelo popular
        await this.navegarAModeloPopular();
        urlActual = await this.obtenerUrlActual();
        expect(urlActual).to.include('/model/');
        
        // Regresar al home
        await this.regresarAlHome();
        
        console.log('✅ Enlaces de navegación validados');
    }

    /**
     * Valida que la información de votos sea coherente
     */
    async validarInformacionVotos() {
        const info = await this.obtenerInformacionCards();
        
        expect(info.marcaPopular.votos).to.be.greaterThan(0);
        expect(info.modeloPopular.votos).to.be.greaterThan(0);
        expect(info.marcaPopular.votos).to.be.greaterThan(info.modeloPopular.votos);
        
        console.log('✅ Información de votos validada');
        return info;
    }
}

module.exports = new HomePage();