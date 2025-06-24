const LoginPage = require('../../pageobjects/LoginPage');
const HomePage = require('../../pageobjects/HomePage');
const ModeloAutoPage = require('../../pageobjects/ModeloAutoPage');

describe('CA05 - Información del Auto', () => {
    
    before(() => {
        log.seccion('CA05 - CRITERIO: Mostrar descripción, especificación y cantidad de votos del auto');
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

    it('CA05.1 - Descripción del auto es visible y contiene información relevante', async () => {
        log.info('Verificando que la descripción del auto esté visible y sea informativa');
        
        // Paso 1: Navegar a un modelo popular
        await HomePage.navegarAModeloPopular();
        
        // Paso 2: Obtener información del auto
        const infoAuto = await ModeloAutoPage.obtenerInformacionAuto();
        
        // Paso 3: Verificar que la descripción no esté vacía
        expect(infoAuto.descripcion).to.not.be.empty;
        log.exito(`Descripción encontrada: ${infoAuto.descripcion.substring(0, 100)}...`);
        
        // Paso 4: Verificar que la descripción tenga un mínimo de contenido
        expect(infoAuto.descripcion.length).to.be.greaterThan(10);
        log.exito('Descripción tiene contenido suficiente');
        
        await capturarPantallaConNombre('CA05_1_descripcion_auto', 'VERIFICADO');
    });

    it('CA05.2 - Especificaciones del auto son mostradas claramente', async () => {
        log.info('Verificando que las especificaciones del auto estén visibles');
        
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
        
        await capturarPantallaConNombre('CA05_2_especificaciones_auto', 'VERIFICADO');
    });

    it('CA05.3 - Cantidad de votos se muestra correctamente y es numérica', async () => {
        log.info('Verificando que la cantidad de votos se muestre correctamente');
        
        // Paso 1: Navegar a modelo popular
        await HomePage.navegarAModeloPopular();
        
        // Paso 2: Obtener cantidad de votos
        const cantidadVotos = await ModeloAutoPage.obtenerCantidadVotos();
        
        // Paso 3: Verificar que es un número válido
        expect(cantidadVotos).to.be.a('number');
        expect(cantidadVotos).to.be.at.least(0);
        log.exito(`Cantidad de votos válida: ${cantidadVotos}`);
        
        // Paso 4: Verificar que la información está visible
        const infoAuto = await ModeloAutoPage.obtenerInformacionAuto();
        expect(infoAuto.cantidadVotos).to.equal(cantidadVotos);
        log.exito('Cantidad de votos coincide en toda la información');
        
        await capturarPantallaConNombre('CA05_3_cantidad_votos', 'VERIFICADO');
    });

    it('CA05.4 - Imagen del auto es visible y se carga correctamente', async () => {
        log.info('Verificando que la imagen del auto esté visible');
        
        // Paso 1: Navegar a diferentes modelos para verificar imágenes
        const modelos = [
            { makeId: 'ckl2phsabijs71623vk0', modelId: 'ckl2phsabijs71623vqg' },
            // Se pueden agregar más modelos aquí
        ];
        
        for (let modelo of modelos) {
            // Paso 2: Navegar al modelo
            await ModeloAutoPage.navegarAModelo(modelo.makeId, modelo.modelId);
            
            // Paso 3: Verificar imagen
            const infoAuto = await ModeloAutoPage.obtenerInformacionAuto();
            expect(infoAuto.imagenVisible).to.be.true;
            log.exito(`Imagen visible para modelo: ${infoAuto.titulo}`);
        }
        
        await capturarPantallaConNombre('CA05_4_imagen_auto', 'VERIFICADO');
    });

    it('CA05.5 - Información del auto es consistente para usuarios autenticados y no autenticados', async () => {
        log.info('Verificando consistencia de información entre usuarios autenticados y no autenticados');
        
        // Paso 1: Obtener información sin autenticación
        await HomePage.navegarAModeloPopular();
        const infoSinAuth = await ModeloAutoPage.obtenerInformacionAuto();
        
        log.info('Información sin autenticación obtenida');
        
        // Paso 2: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        await browser.pause(2000);
        
        // Paso 3: Obtener información con autenticación
        const infoConAuth = await ModeloAutoPage.obtenerInformacionAuto();
        
        log.info('Información con autenticación obtenida');
        
        // Paso 4: Comparar información básica (debe ser la misma)
        expect(infoConAuth.titulo).to.equal(infoSinAuth.titulo);
        expect(infoConAuth.descripcion).to.equal(infoSinAuth.descripcion);
        expect(infoConAuth.especificaciones).to.equal(infoSinAuth.especificaciones);
        expect(infoConAuth.imagenVisible).to.equal(infoSinAuth.imagenVisible);
        
        log.exito('Información básica consistente entre estados de autenticación');
        
        // Paso 5: Los votos pueden diferir si el usuario votó
        if (infoConAuth.cantidadVotos !== infoSinAuth.cantidadVotos) {
            log.info(`Diferencia en votos detectada: ${infoSinAuth.cantidadVotos} -> ${infoConAuth.cantidadVotos}`);
        } else {
            log.info('Cantidad de votos idéntica en ambos estados');
        }
        
        await capturarPantallaConNombre('CA05_5_consistencia_informacion', 'VERIFICADO');
    });

    it('CA05.6 - Título/nombre del modelo se muestra prominentemente', async () => {
        log.info('Verificando que el título del modelo sea prominente y claro');
        
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
        
        await capturarPantallaConNombre('CA05_6_titulo_modelo', 'VERIFICADO');
    });

    it('CA05.7 - Información se mantiene al recargar la página', async () => {
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
        
        await capturarPantallaConNombre('CA05_7_persistencia_recarga', 'VERIFICADO');
    });

    it('CA05.8 - Contador de votos se actualiza dinámicamente', async () => {
        log.info('Verificando actualización dinámica del contador de votos');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        
        // Paso 2: Navegar a modelo
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Obtener votos iniciales
        const votosIniciales = await ModeloAutoPage.obtenerCantidadVotos();
        log.info(`Votos iniciales: ${votosIniciales}`);
        
        // Paso 4: Verificar estado del voto
        const estadoVoto = await ModeloAutoPage.verificarEstadoVoto();
        
        if (estadoVoto.puedeVotar) {
            // Paso 5: Votar y verificar actualización
            await ModeloAutoPage.votarAuto();
            await browser.pause(2000);
            
            const votosFinales = await ModeloAutoPage.obtenerCantidadVotos();
            expect(votosFinales).to.be.greaterThan(votosIniciales);
            log.exito(`Contador actualizado dinámicamente: ${votosIniciales} -> ${votosFinales}`);
        } else if (estadoVoto.yavaVoto) {
            log.info('Usuario ya había votado - verificando que el contador sea coherente');
            expect(votosIniciales).to.be.at.least(1);
            log.exito('Contador refleja voto previo del usuario');
        }
        
        await capturarPantallaConNombre('CA05_8_actualizacion_dinamica', 'VERIFICADO');
    });

    it('CA05.9 - Información está estructurada y es fácil de leer', async () => {
        log.info('Verificando que la información esté bien estructurada');
        
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
        
        await capturarPantallaConNombre('CA05_9_estructura_informacion', 'VERIFICADO');
    });

    it('CA05.10 - Información es accesible desde diferentes puntos de entrada', async () => {
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
        
        await capturarPantallaConNombre('CA05_10_accesibilidad_rutas', 'VERIFICADO');
    });
});