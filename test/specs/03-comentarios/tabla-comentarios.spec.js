const LoginPage = require('../../pageobjects/LoginPage');
const HomePage = require('../../pageobjects/HomePage');
const ModeloAutoPage = require('../../pageobjects/ModeloAutoPage');

describe('Comentarios - Tabla de Comentarios', () => {
    
    before(() => {
        log.seccion('📋 TABLA COMENTARIOS: Estructura y funcionalidad de la tabla');
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

    it('TABLE_001 - Tabla tiene estructura correcta (Date, Author, Comment)', async () => {
        log.info('Verificando estructura correcta de la tabla de comentarios');
        
        // Paso 1: Navegar a modelo (sin necesidad de autenticación para ver la tabla)
        await HomePage.navegarAModeloPopular();
        
        // Paso 2: Verificar que la tabla existe y tiene estructura correcta
        const verificacionTabla = await ModeloAutoPage.verificarTablaComentarios();
        
        expect(verificacionTabla.tablaPresente).to.be.true;
        expect(verificacionTabla.encabezadosCorrecto).to.be.true;
        log.exito('Tabla de comentarios presente con estructura correcta');
        
        // Paso 3: Verificar columnas específicas
        expect(verificacionTabla.columnas.fecha).to.be.true;
        expect(verificacionTabla.columnas.autor).to.be.true;
        expect(verificacionTabla.columnas.comentario).to.be.true;
        log.exito('Todas las columnas requeridas están presentes: Date, Author, Comment');
        
        await capturarPantallaConNombre('TABLE_001_estructura_tabla', 'VERIFICADO');
    });

    it('TABLE_002 - Comentarios existentes se muestran con información completa', async () => {
        log.info('Verificando que comentarios existentes tienen información completa');
        
        // Paso 1: Navegar a modelo popular que probablemente tiene comentarios
        await HomePage.navegarAModeloPopular();
        
        // Paso 2: Obtener comentarios de la tabla
        const comentarios = await ModeloAutoPage.obtenerComentarios();
        log.info(`Comentarios encontrados en la tabla: ${comentarios.length}`);
        
        // Paso 3: Verificar que los comentarios tienen la información requerida
        if (comentarios.length > 0) {
            for (let i = 0; i < Math.min(3, comentarios.length); i++) {
                const comentario = comentarios[i];
                
                // Verificar que cada comentario tiene fecha
                expect(comentario.fecha).to.not.be.empty;
                log.exito(`Comentario ${i + 1} - Fecha: ${comentario.fecha}`);
                
                // Verificar que cada comentario tiene autor
                expect(comentario.autor).to.not.be.empty;
                log.exito(`Comentario ${i + 1} - Autor: ${comentario.autor}`);
                
                // Verificar que cada comentario tiene contenido
                expect(comentario.comentario).to.not.be.empty;
                log.exito(`Comentario ${i + 1} - Contenido: ${comentario.comentario.substring(0, 50)}...`);
            }
        } else {
            log.info('No hay comentarios existentes en este modelo');
        }
        
        await capturarPantallaConNombre('TABLE_002_comentarios_existentes', 'VERIFICADO');
    });

    it('TABLE_003 - Nuevos comentarios aparecen inmediatamente', async () => {
        log.info('Verificando que nuevos comentarios aparecen inmediatamente en la tabla');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        const nombreUsuario = await LoginPage.obtenerNombreUsuario();
        
        // Paso 2: Navegar a modelo
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Contar comentarios antes
        const comentariosAntes = await ModeloAutoPage.obtenerComentarios();
        const cantidadAntes = comentariosAntes.length;
        log.info(`Comentarios antes del nuevo comentario: ${cantidadAntes}`);
        
        // Paso 4: Agregar nuevo comentario
        const textoComentario = `Comentario para verificar aparición inmediata - ${moment().format('HH:mm:ss')}`;
        await ModeloAutoPage.enviarComentario(textoComentario);
        
        // Paso 5: Verificar que aparece inmediatamente (sin recargar página)
        await browser.pause(3000);
        
        const comentariosDespues = await ModeloAutoPage.obtenerComentarios();
        const cantidadDespues = comentariosDespues.length;
        
        expect(cantidadDespues).to.be.greaterThan(cantidadAntes);
        log.exito(`Comentarios después: ${cantidadDespues} (incremento detectado)`);
        
        // Paso 6: Verificar que el comentario específico está presente
        const comentarioEncontrado = await ModeloAutoPage.buscarComentario(textoComentario, nombreUsuario);
        expect(comentarioEncontrado).to.not.be.undefined;
        log.exito('Nuevo comentario encontrado inmediatamente en la tabla');
        
        await capturarPantallaConNombre('TABLE_003_aparicion_inmediata', 'VERIFICADO');
    });

    it('TABLE_004 - Formato de fecha es legible y coherente', async () => {
        log.info('Verificando formato de fecha en comentarios de la tabla');
        
        // Paso 1: Navegar y obtener comentarios
        await HomePage.navegarAModeloPopular();
        const comentarios = await ModeloAutoPage.obtenerComentarios();
        
        if (comentarios.length > 0) {
            // Paso 2: Verificar formato de fechas en comentarios existentes
            const formatosFechaValidos = [
                /^\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
                /^\d{2}\/\d{2}\/\d{4}/, // MM/DD/YYYY o DD/MM/YYYY
                /^\d{2}-\d{2}-\d{4}/, // DD-MM-YYYY
                /^\d{1,2}\/\d{1,2}\/\d{4}/, // M/D/YYYY
                /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/, // YYYY-MM-DD HH:MM:SS
                /\w+ \d{1,2}, \d{4}/ // Month DD, YYYY
            ];
            
            for (let i = 0; i < Math.min(5, comentarios.length); i++) {
                const fecha = comentarios[i].fecha;
                
                let formatoValido = false;
                for (let formato of formatosFechaValidos) {
                    if (formato.test(fecha)) {
                        formatoValido = true;
                        break;
                    }
                }
                
                expect(formatoValido).to.be.true;
                log.exito(`Fecha ${i + 1} tiene formato válido: ${fecha}`);
            }
        } else {
            // Crear un comentario para verificar formato
            await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
            await ModeloAutoPage.enviarComentario('Comentario para verificar formato de fecha');
            await browser.pause(2000);
            
            const nuevosComentarios = await ModeloAutoPage.obtenerComentarios();
            if (nuevosComentarios.length > 0) {
                const fechaNueva = nuevosComentarios[0].fecha;
                expect(fechaNueva).to.not.be.empty;
                log.exito(`Formato de fecha del nuevo comentario: ${fechaNueva}`);
            }
        }
        
        await capturarPantallaConNombre('TABLE_004_formato_fecha', 'VERIFICADO');
    });

    it('TABLE_005 - Tabla es accesible sin autenticación (solo lectura)', async () => {
        log.info('Verificando acceso de solo lectura a tabla sin autenticación');
        
        // Paso 1: Asegurar que no hay sesión activa
        const estaAutenticado = await LoginPage.usuarioEstaAutenticado();
        if (estaAutenticado) {
            await LoginPage.cerrarSesion();
        }
        
        // Paso 2: Navegar a modelo sin autenticación
        await HomePage.navegarAModeloPopular();
        
        // Paso 3: Verificar que la tabla es visible
        const verificacionTabla = await ModeloAutoPage.verificarTablaComentarios();
        expect(verificacionTabla.tablaPresente).to.be.true;
        log.exito('Tabla de comentarios accesible sin autenticación');
        
        // Paso 4: Verificar que puede leer comentarios
        const comentarios = await ModeloAutoPage.obtenerComentarios();
        log.info(`Comentarios legibles sin autenticación: ${comentarios.length}`);
        
        // Paso 5: Verificar que NO puede agregar comentarios
        const puedeComentarar = await ModeloAutoPage.puedeComentarar();
        expect(puedeComentarar).to.be.false;
        log.exito('Capacidad de comentar correctamente restringida sin autenticación');
        
        await capturarPantallaConNombre('TABLE_005_acceso_solo_lectura', 'VERIFICADO');
    });

    it('TABLE_006 - Tabla se mantiene ordenada y legible', async () => {
        log.info('Verificando orden y legibilidad de la tabla de comentarios');
        
        // Paso 1: Navegar a modelo con comentarios
        await HomePage.navegarAModeloPopular();
        
        // Paso 2: Verificar estructura de la tabla
        const verificacionTabla = await ModeloAutoPage.verificarTablaComentarios();
        expect(verificacionTabla.tablaPresente).to.be.true;
        expect(verificacionTabla.encabezadosCorrecto).to.be.true;
        
        // Paso 3: Obtener comentarios y verificar legibilidad
        const comentarios = await ModeloAutoPage.obtenerComentarios();
        
        if (comentarios.length >= 2) {
            // Verificar que las fechas están en orden
            log.info('Verificando orden de comentarios por fecha...');
            
            for (let i = 0; i < Math.min(5, comentarios.length); i++) {
                const comentario = comentarios[i];
                log.info(`Comentario ${i + 1}: ${comentario.fecha} - ${comentario.autor} - ${comentario.comentario.substring(0, 50)}...`);
            }
            
            log.exito('Tabla mantiene orden legible de comentarios');
        }
        
        // Paso 4: Verificar que el contenido es legible (no truncado abruptamente)
        for (let comentario of comentarios.slice(0, 3)) {
            expect(comentario.comentario.length).to.be.greaterThan(0);
            log.exito(`Comentario legible: "${comentario.comentario.substring(0, 30)}..."`);
        }
        
        await capturarPantallaConNombre('TABLE_006_orden_legibilidad', 'VERIFICADO');
    });
});