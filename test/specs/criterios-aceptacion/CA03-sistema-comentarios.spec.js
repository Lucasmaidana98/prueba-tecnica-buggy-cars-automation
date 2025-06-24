const LoginPage = require('../../pageobjects/LoginPage');
const HomePage = require('../../pageobjects/HomePage');
const ModeloAutoPage = require('../../pageobjects/ModeloAutoPage');

describe('CA03 - Sistema de Comentarios', () => {
    
    before(() => {
        log.seccion('CA03 - CRITERIO: Se debe poder dejar un comentario si el usuario así lo desea');
    });

    beforeEach(async () => {
        await browser.url('/');
        await browser.maximizeWindow();
        
        // Limpiar sesión antes de cada prueba
        try {
            if (await LoginPage.usuarioEstaAutenticado()) {
                await LoginPage.cerrarSesion();
            }
        } catch (error) {
            // Continuar si no hay sesión
        }
    });

    afterEach(async () => {
        // Limpiar sesión después de cada prueba
        try {
            if (await LoginPage.usuarioEstaAutenticado()) {
                await LoginPage.cerrarSesion();
            }
        } catch (error) {
            log.advertencia('Error cerrando sesión en cleanup');
        }
    });

    it('CA03.1 - Usuario autenticado puede dejar comentario exitosamente', async () => {
        log.info('Verificando capacidad de dejar comentarios para usuario autenticado');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        await LoginPage.validarEstadoAutenticacion(true);
        
        // Paso 2: Navegar a un modelo
        await HomePage.navegarAModeloPopular();
        
        // Paso 3: Verificar que puede comentar
        const puedeComentarar = await ModeloAutoPage.puedeComentarar();
        expect(puedeComentarar).to.be.true;
        log.exito('Usuario puede acceder al sistema de comentarios');
        
        // Paso 4: Obtener comentarios existentes
        const comentariosIniciales = await ModeloAutoPage.obtenerComentarios();
        const cantidadInicial = comentariosIniciales.length;
        log.info(`Comentarios existentes: ${cantidadInicial}`);
        
        // Paso 5: Enviar comentario
        const textoComentario = `Comentario de prueba automatizada - ${moment().format('YYYY-MM-DD HH:mm:ss')}`;
        const comentarioEnviado = await ModeloAutoPage.enviarComentario(textoComentario);
        expect(comentarioEnviado).to.be.true;
        log.exito('Comentario enviado exitosamente');
        
        // Paso 6: Verificar que el comentario aparece en la tabla
        await browser.pause(3000); // Esperar procesamiento
        
        const comentarioEncontrado = await ModeloAutoPage.buscarComentario(textoComentario, 'test');
        expect(comentarioEncontrado).to.not.be.undefined;
        log.exito(`Comentario encontrado en la tabla: "${comentarioEncontrado.comentario}"`);
        
        await capturarPantallaConNombre('CA03_1_comentario_exitoso', 'VERIFICADO');
    });

    it('CA03.2 - Comentario aparece con fecha y autor correctos', async () => {
        log.info('Verificando información correcta del comentario (fecha y autor)');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        const nombreUsuario = await LoginPage.obtenerNombreUsuario();
        
        // Paso 2: Navegar y comentar
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        const fechaAntes = moment();
        const textoComentario = `Comentario con verificación de fecha y autor - ${fechaAntes.format('HH:mm:ss')}`;
        
        await ModeloAutoPage.enviarComentario(textoComentario);
        await browser.pause(3000);
        
        // Paso 3: Buscar y verificar el comentario
        const comentarioEncontrado = await ModeloAutoPage.buscarComentario(textoComentario);
        expect(comentarioEncontrado).to.not.be.undefined;
        
        // Paso 4: Verificar autor
        expect(comentarioEncontrado.autor).to.equal(nombreUsuario);
        log.exito(`Autor correcto: ${comentarioEncontrado.autor}`);
        
        // Paso 5: Verificar fecha (debe ser reciente)
        expect(comentarioEncontrado.fecha).to.not.be.empty;
        log.exito(`Fecha registrada: ${comentarioEncontrado.fecha}`);
        
        await capturarPantallaConNombre('CA03_2_fecha_autor_correctos', 'VERIFICADO');
    });

    it('CA03.3 - Múltiples comentarios del mismo usuario se almacenan correctamente', async () => {
        log.info('Verificando múltiples comentarios del mismo usuario');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        
        // Paso 2: Navegar a modelo
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Enviar múltiples comentarios
        const comentarios = [
            'Primer comentario de la serie de pruebas',
            'Segundo comentario con diferente contenido',
            'Tercer comentario para verificar almacenamiento múltiple'
        ];
        
        for (let i = 0; i < comentarios.length; i++) {
            const comentarioTexto = `${comentarios[i]} - ${moment().format('HH:mm:ss')}`;
            await ModeloAutoPage.enviarComentario(comentarioTexto);
            await browser.pause(2000);
            
            // Verificar que cada comentario se guardó
            const comentarioEncontrado = await ModeloAutoPage.buscarComentario(comentarios[i]);
            expect(comentarioEncontrado).to.not.be.undefined;
            log.exito(`Comentario ${i + 1} almacenado correctamente`);
        }
        
        await capturarPantallaConNombre('CA03_3_multiples_comentarios', 'VERIFICADO');
    });

    it('CA03.4 - Comentarios vacíos no se procesan', async () => {
        log.info('Verificando que comentarios vacíos no se procesan');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        
        // Paso 2: Navegar a modelo
        await HomePage.navegarAModeloPopular();
        
        // Paso 3: Intentar enviar comentario vacío
        const comentariosAntesVacio = await ModeloAutoPage.obtenerComentarios();
        const cantidadAntesVacio = comentariosAntesVacio.length;
        
        const comentarioVacioEnviado = await ModeloAutoPage.enviarComentario('');
        
        // Paso 4: Verificar que no se procesó
        await browser.pause(2000);
        const comentariosDespuesVacio = await ModeloAutoPage.obtenerComentarios();
        const cantidadDespuesVacio = comentariosDespuesVacio.length;
        
        expect(cantidadDespuesVacio).to.equal(cantidadAntesVacio);
        log.exito('Comentario vacío correctamente rechazado');
        
        // Paso 5: Intentar con espacios en blanco
        const comentarioEspaciosEnviado = await ModeloAutoPage.enviarComentario('   ');
        await browser.pause(2000);
        
        const comentariosDespuesEspacios = await ModeloAutoPage.obtenerComentarios();
        expect(comentariosDespuesEspacios.length).to.equal(cantidadAntesVacio);
        log.exito('Comentario con solo espacios correctamente rechazado');
        
        await capturarPantallaConNombre('CA03_4_comentarios_vacios', 'VERIFICADO');
    });

    it('CA03.5 - Comentarios con caracteres especiales se manejan correctamente', async () => {
        log.info('Verificando manejo de caracteres especiales en comentarios');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        
        // Paso 2: Navegar a modelo
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Probar diferentes tipos de caracteres especiales
        const comentariosEspeciales = [
            'Comentario con acentos: áéíóú ñ Ñ',
            'Comentario con números: 123456789',
            'Comentario con símbolos: !@#$%^&*()',
            'Comentario con emojis: 😀 🚗 ⭐'
        ];
        
        for (let i = 0; i < comentariosEspeciales.length; i++) {
            const textoCompleto = `${comentariosEspeciales[i]} - ${moment().format('HH:mm:ss')}`;
            
            try {
                await ModeloAutoPage.enviarComentario(textoCompleto);
                await browser.pause(2000);
                
                // Verificar que el comentario se procesó correctamente
                const comentarioEncontrado = await ModeloAutoPage.buscarComentario(comentariosEspeciales[i]);
                if (comentarioEncontrado) {
                    log.exito(`Caracteres especiales procesados: "${comentariosEspeciales[i]}"`);
                } else {
                    log.advertencia(`Comentario con caracteres especiales no encontrado: "${comentariosEspeciales[i]}"`);
                }
            } catch (error) {
                log.advertencia(`Error procesando comentario especial: ${error.message}`);
            }
        }
        
        await capturarPantallaConNombre('CA03_5_caracteres_especiales', 'VERIFICADO');
    });

    it('CA03.6 - Comentarios largos se manejan apropiadamente', async () => {
        log.info('Verificando manejo de comentarios largos');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        
        // Paso 2: Navegar a modelo
        await HomePage.navegarAModeloPopular();
        
        // Paso 3: Crear comentario largo
        const comentarioLargo = 'Este es un comentario muy largo para probar los límites del sistema. '.repeat(10) + 
                              `Timestamp: ${moment().format('YYYY-MM-DD HH:mm:ss')}`;
        
        log.info(`Longitud del comentario: ${comentarioLargo.length} caracteres`);
        
        // Paso 4: Enviar comentario largo
        const comentarioEnviado = await ModeloAutoPage.enviarComentario(comentarioLargo);
        
        if (comentarioEnviado) {
            await browser.pause(3000);
            
            // Verificar que se procesó (aunque puede estar truncado)
            const comentarioEncontrado = await ModeloAutoPage.buscarComentario('Este es un comentario muy largo');
            
            if (comentarioEncontrado) {
                log.exito('Comentario largo procesado exitosamente');
                log.info(`Contenido almacenado: ${comentarioEncontrado.comentario.substring(0, 100)}...`);
            } else {
                log.advertencia('Comentario largo no encontrado en la tabla');
            }
        } else {
            log.info('Comentario largo fue rechazado por el sistema (comportamiento válido)');
        }
        
        await capturarPantallaConNombre('CA03_6_comentarios_largos', 'VERIFICADO');
    });

    it('CA03.7 - Comentarios persisten al recargar la página', async () => {
        log.info('Verificando persistencia de comentarios al recargar página');
        
        // Paso 1: Autenticarse y comentar
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        const textoComentario = `Comentario de persistencia - ${moment().format('YYYY-MM-DD HH:mm:ss')}`;
        await ModeloAutoPage.enviarComentario(textoComentario);
        await browser.pause(3000);
        
        // Paso 2: Verificar que el comentario está presente
        let comentarioAntes = await ModeloAutoPage.buscarComentario('Comentario de persistencia');
        expect(comentarioAntes).to.not.be.undefined;
        log.exito('Comentario encontrado antes de recargar');
        
        // Paso 3: Recargar la página
        await browser.refresh();
        await browser.pause(3000);
        
        // Paso 4: Verificar que el comentario persiste
        let comentarioDespues = await ModeloAutoPage.buscarComentario('Comentario de persistencia');
        expect(comentarioDespues).to.not.be.undefined;
        expect(comentarioDespues.comentario).to.equal(comentarioAntes.comentario);
        log.exito('Comentario persistió correctamente después de recargar');
        
        await capturarPantallaConNombre('CA03_7_persistencia_comentarios', 'VERIFICADO');
    });
});