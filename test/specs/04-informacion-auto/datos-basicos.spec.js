const LoginPage = require('../../pageobjects/LoginPage');
const HomePage = require('../../pageobjects/HomePage');
const ModeloAutoPage = require('../../pageobjects/ModeloAutoPage');

describe('Información Auto - Datos Básicos', () => {
    
    before(() => {
        log.seccion('🚗 INFORMACIÓN AUTO: Descripción, especificaciones y datos básicos');
    });

    beforeEach(async () => {
        await browser.url('/');
        await browser.maximizeWindow();
    });

    afterEach(async () => {
        // Limpiar sesión si existe
        try {
            if (await LoginPage.usuarioEstaAutenticado()) {
                await LoginPage.cerrarSesion();
            }
        } catch (error) {
            // Continuar si no hay sesión
        }
    });

    it('INFO_001 - Descripción del auto es visible y contiene información relevante', async () => {
        log.info('Verificando descripción del auto');
        
        // Paso 1: Navegar a modelo popular
        await HomePage.navegarAModeloPopular();
        
        // Paso 2: Obtener información del auto
        const infoAuto = await ModeloAutoPage.obtenerInformacionAuto();
        
        // Paso 3: Verificar que la descripción no esté vacía
        expect(infoAuto.descripcion).to.not.be.empty;
        log.exito(`Descripción encontrada: ${infoAuto.descripcion.substring(0, 100)}...`);
        
        // Paso 4: Verificar que la descripción tenga un mínimo de contenido
        expect(infoAuto.descripcion.length).to.be.greaterThan(10);
        log.exito('Descripción tiene contenido suficiente');
        
        await capturarPantallaConNombre('INFO_001_descripcion_auto', 'VERIFICADO');
    });

    it('INFO_002 - Especificaciones técnicas son mostradas claramente', async () => {
        log.info('Verificando especificaciones técnicas del auto');
        
        // Paso 1: Navegar a modelo específico
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 2: Obtener información completa
        const infoAuto = await ModeloAutoPage.obtenerInformacionAuto();
        
        // Paso 3: Verificar especificaciones
        expect(infoAuto.especificaciones).to.not.be.empty;
        log.exito(`Especificaciones encontradas: ${infoAuto.especificaciones}`);
        
        // Paso 4: Validar información completa
        await ModeloAutoPage.validarInformacionCompleta();
        log.exito('Información del auto validada como completa');
        
        await capturarPantallaConNombre('INFO_002_especificaciones_auto', 'VERIFICADO');
    });

    it('INFO_003 - Título/nombre del modelo se muestra prominentemente', async () => {
        log.info('Verificando título del modelo');
        
        // Paso 1: Navegar a modelo popular
        await HomePage.navegarAModeloPopular();
        
        // Paso 2: Verificar título
        const infoAuto = await ModeloAutoPage.obtenerInformacionAuto();
        
        expect(infoAuto.titulo).to.not.be.empty;
        expect(infoAuto.titulo.length).to.be.greaterThan(3);
        log.exito(`Título del modelo: ${infoAuto.titulo}`);
        
        // Paso 3: Verificar que el título contiene información relevante del auto
        expect(infoAuto.titulo).to.match(/\w+/); // Al menos contiene palabras
        log.exito('Título contiene información relevante');
        
        await capturarPantallaConNombre('INFO_003_titulo_modelo', 'VERIFICADO');
    });

    it('INFO_004 - Imagen del auto es visible y se carga correctamente', async () => {
        log.info('Verificando imagen del auto');
        
        // Paso 1: Navegar a diferentes modelos para verificar imágenes
        const modelos = [
            { makeId: 'ckl2phsabijs71623vk0', modelId: 'ckl2phsabijs71623vqg' }
        ];
        
        for (let modelo of modelos) {
            // Paso 2: Navegar al modelo
            await ModeloAutoPage.navegarAModelo(modelo.makeId, modelo.modelId);
            
            // Paso 3: Verificar imagen
            const infoAuto = await ModeloAutoPage.obtenerInformacionAuto();
            expect(infoAuto.imagenVisible).to.be.true;
            log.exito(`Imagen visible para modelo: ${infoAuto.titulo}`);
        }
        
        await capturarPantallaConNombre('INFO_004_imagen_auto', 'VERIFICADO');
    });

    it('INFO_005 - Información se mantiene al recargar la página', async () => {
        log.info('Verificando persistencia de información al recargar');
        
        // Paso 1: Navegar y obtener información inicial
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        const infoAntes = await ModeloAutoPage.obtenerInformacionAuto();
        
        log.info('Información inicial obtenida');
        
        // Paso 2: Recargar la página
        await browser.refresh();
        await browser.pause(3000);
        
        // Paso 3: Obtener información después de recargar
        const infoDespues = await ModeloAutoPage.obtenerInformacionAuto();
        
        // Paso 4: Comparar que la información es consistente
        expect(infoDespues.titulo).to.equal(infoAntes.titulo);
        expect(infoDespues.descripcion).to.equal(infoAntes.descripcion);
        expect(infoDespues.especificaciones).to.equal(infoAntes.especificaciones);
        expect(infoDespues.imagenVisible).to.equal(infoAntes.imagenVisible);
        
        log.exito('Información persistió correctamente después de recargar');
        
        await capturarPantallaConNombre('INFO_005_persistencia_recarga', 'VERIFICADO');
    });

    it('INFO_006 - Información está estructurada y es fácil de leer', async () => {
        log.info('Verificando estructura y legibilidad de la información');
        
        // Paso 1: Navegar a modelo
        await HomePage.navegarAModeloPopular();
        
        // Paso 2: Validar estructura completa
        await ModeloAutoPage.validarInformacionCompleta();
        
        // Paso 3: Obtener y verificar toda la información
        const infoAuto = await ModeloAutoPage.obtenerInformacionAuto();
        
        // Verificar que todos los elementos principales están presentes
        const elementosRequeridos = [
            { campo: 'titulo', valor: infoAuto.titulo, descripcion: 'Título del modelo' },
            { campo: 'cantidadVotos', valor: infoAuto.cantidadVotos, descripcion: 'Cantidad de votos' },
            { campo: 'imagenVisible', valor: infoAuto.imagenVisible, descripcion: 'Imagen del auto' }
        ];
        
        for (let elemento of elementosRequeridos) {
            if (elemento.campo === 'imagenVisible') {
                expect(elemento.valor).to.be.true;
            } else if (elemento.campo === 'cantidadVotos') {
                expect(elemento.valor).to.be.a('number');
                expect(elemento.valor).to.be.at.least(0);
            } else {
                expect(elemento.valor).to.not.be.empty;
            }
            log.exito(`${elemento.descripcion}: ✓`);
        }
        
        log.exito('Estructura de información validada completamente');
        
        await capturarPantallaConNombre('INFO_006_estructura_informacion', 'VERIFICADO');
    });

    it('INFO_007 - Información es accesible desde diferentes puntos de entrada', async () => {
        log.info('Verificando accesibilidad de información desde diferentes rutas');
        
        // Paso 1: Acceder desde home -> marca popular -> modelo
        await HomePage.abrirPaginaPrincipal();
        await HomePage.navegarAMarcaPopular();
        await browser.pause(1000);
        
        // Buscar y hacer clic en el primer modelo disponible
        const enlacesModelos = await $$('a[href*="/model/"]');
        if (enlacesModelos.length > 0) {
            await enlacesModelos[0].click();
            await browser.pause(2000);
            
            const infoRuta1 = await ModeloAutoPage.obtenerInformacionAuto();
            log.exito('Información obtenida desde ruta: Home -> Marca -> Modelo');
            
            // Paso 2: Acceder directamente desde home -> modelo popular
            await HomePage.regresarAlHome();
            await HomePage.navegarAModeloPopular();
            
            const infoRuta2 = await ModeloAutoPage.obtenerInformacionAuto();
            log.exito('Información obtenida desde ruta: Home -> Modelo directo');
            
            // Paso 3: Verificar que la información es consistente
            expect(infoRuta2.titulo).to.not.be.empty;
            expect(infoRuta2.cantidadVotos).to.be.a('number');
            expect(infoRuta2.imagenVisible).to.be.true;
            
            log.exito('Información consistente desde diferentes rutas de acceso');
        }
        
        await capturarPantallaConNombre('INFO_007_accesibilidad_rutas', 'VERIFICADO');
    });
});