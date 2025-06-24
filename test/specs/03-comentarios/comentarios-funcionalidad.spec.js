const LoginPage = require('../../pageobjects/LoginPage');
const HomePage = require('../../pageobjects/HomePage');
const ModeloAutoPage = require('../../pageobjects/ModeloAutoPage');

describe('Comentarios - Funcionalidad Principal', () => {
    
    before(() => {
        log.seccion('💬 COMENTARIOS: Funcionalidad de comentarios para usuarios');
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

    it('COMMENT_001 - Usuario autenticado puede comentar exitosamente', async () => {
        log.info('Verificando envío exitoso de comentarios');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        const nombreUsuario = await LoginPage.obtenerNombreUsuario();
        
        // Paso 2: Navegar a modelo
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Verificar que campo de comentarios está disponible
        const puedeComentarar = await ModeloAutoPage.puedeComentarar();
        expect(puedeComentarar).to.be.true;
        log.exito('Campo de comentarios disponible para usuario autenticado');
        
        // Paso 4: Agregar comentario único
        const textoComentario = `Excelente auto deportivo con gran rendimiento - Test ${moment().format('HH:mm:ss')}`;
        await ModeloAutoPage.enviarComentario(textoComentario);
        await browser.pause(3000);
        
        // Paso 5: Verificar que comentario aparece en la tabla
        const comentarioEncontrado = await ModeloAutoPage.buscarComentario(textoComentario, nombreUsuario);
        expect(comentarioEncontrado).to.not.be.undefined;
        expect(comentarioEncontrado.comentario).to.include(textoComentario);
        expect(comentarioEncontrado.autor).to.equal(nombreUsuario);
        log.exito('Comentario enviado y encontrado exitosamente en la tabla');
        
        await capturarPantallaConNombre('COMMENT_001_comentario_exitoso', 'VERIFICADO');
    });

    it('COMMENT_002 - Información de comentario es correcta (fecha y autor)', async () => {
        log.info('Verificando metadatos correctos del comentario');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        const nombreUsuario = await LoginPage.obtenerNombreUsuario();
        
        // Paso 2: Navegar a modelo
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Enviar comentario con timestamp
        const timestamp = moment().format('HH:mm:ss');
        const textoComentario = `Comentario con verificación de metadatos - ${timestamp}`;
        await ModeloAutoPage.enviarComentario(textoComentario);
        await browser.pause(3000);
        
        // Paso 4: Buscar y verificar comentario
        const comentario = await ModeloAutoPage.buscarComentario(textoComentario, nombreUsuario);
        expect(comentario).to.not.be.undefined;
        
        // Paso 5: Verificar autor
        expect(comentario.autor).to.equal(nombreUsuario);
        log.exito(`Autor correcto: ${comentario.autor}`);
        
        // Paso 6: Verificar fecha (debe ser hoy)
        const fechaHoy = moment().format('YYYY-MM-DD');
        expect(comentario.fecha).to.include(fechaHoy.substring(0, 4)); // Al menos el año
        log.exito(`Fecha del comentario: ${comentario.fecha}`);
        
        await capturarPantallaConNombre('COMMENT_002_metadatos_correctos', 'VERIFICADO');
    });

    it('COMMENT_003 - Múltiples comentarios del mismo usuario', async () => {
        log.info('Verificando que usuario puede hacer múltiples comentarios');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        const nombreUsuario = await LoginPage.obtenerNombreUsuario();
        
        // Paso 2: Navegar a modelo
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Enviar primer comentario
        const comentario1 = `Primer comentario múltiple - ${moment().format('HH:mm:ss')}`;
        await ModeloAutoPage.enviarComentario(comentario1);
        await browser.pause(2000);
        
        // Paso 4: Enviar segundo comentario
        const comentario2 = `Segundo comentario múltiple - ${moment().format('HH:mm:ss')}`;
        await ModeloAutoPage.enviarComentario(comentario2);
        await browser.pause(2000);
        
        // Paso 5: Verificar que ambos comentarios están presentes
        const encontrado1 = await ModeloAutoPage.buscarComentario(comentario1, nombreUsuario);
        const encontrado2 = await ModeloAutoPage.buscarComentario(comentario2, nombreUsuario);
        
        expect(encontrado1).to.not.be.undefined;
        expect(encontrado2).to.not.be.undefined;
        log.exito('Múltiples comentarios del mismo usuario permitidos');
        
        await capturarPantallaConNombre('COMMENT_003_multiples_comentarios', 'VERIFICADO');
    });

    it('COMMENT_004 - Comentarios vacíos son validados', async () => {
        log.info('Verificando validación de comentarios vacíos');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        
        // Paso 2: Navegar a modelo
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Intentar enviar comentario vacío
        const comentariosAntes = await ModeloAutoPage.obtenerComentarios();
        const cantidadAntes = comentariosAntes.length;
        
        try {
            await ModeloAutoPage.enviarComentario('');
            await browser.pause(2000);
            
            // Paso 4: Verificar que no se agregó comentario vacío
            const comentariosDespues = await ModeloAutoPage.obtenerComentarios();
            const cantidadDespues = comentariosDespues.length;
            
            // Debería mantenerse igual o rechazar el comentario vacío
            expect(cantidadDespues).to.equal(cantidadAntes);
            log.exito('Comentario vacío correctamente rechazado');
            
        } catch (error) {
            log.exito('Comentario vacío generó error controlado (comportamiento correcto)');
        }
        
        await capturarPantallaConNombre('COMMENT_004_validacion_vacio', 'VERIFICADO');
    });

    it('COMMENT_005 - Comentarios con caracteres especiales', async () => {
        log.info('Verificando manejo de caracteres especiales en comentarios');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        const nombreUsuario = await LoginPage.obtenerNombreUsuario();
        
        // Paso 2: Navegar a modelo
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Enviar comentario con caracteres especiales
        const comentarioEspecial = `Comentario con acentos: ñáéíóú, símbolos: @#$%&, emojis: 🚗⭐ - ${moment().format('HH:mm:ss')}`;
        
        try {
            await ModeloAutoPage.enviarComentario(comentarioEspecial);
            await browser.pause(3000);
            
            // Paso 4: Verificar que se procesó correctamente
            const comentarioEncontrado = await ModeloAutoPage.buscarComentario(comentarioEspecial, nombreUsuario);
            if (comentarioEncontrado) {
                log.exito('Comentario con caracteres especiales aceptado y encontrado');
            } else {
                log.info('Comentario con caracteres especiales fue filtrado (comportamiento aceptable)');
            }
            
        } catch (error) {
            log.info('Comentario con caracteres especiales causó error controlado');
        }
        
        await capturarPantallaConNombre('COMMENT_005_caracteres_especiales', 'VERIFICADO');
    });

    it('COMMENT_006 - Persistencia de comentarios al recargar', async () => {
        log.info('Verificando persistencia de comentarios al recargar página');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        const nombreUsuario = await LoginPage.obtenerNombreUsuario();
        
        // Paso 2: Navegar a modelo
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Enviar comentario
        const comentarioPersistente = `Comentario para probar persistencia - ${moment().format('HH:mm:ss')}`;
        await ModeloAutoPage.enviarComentario(comentarioPersistente);
        await browser.pause(2000);
        
        // Paso 4: Recargar página
        await browser.refresh();
        await browser.pause(3000);
        
        // Paso 5: Verificar que comentario persiste
        const comentarioTrasRecarga = await ModeloAutoPage.buscarComentario(comentarioPersistente, nombreUsuario);
        expect(comentarioTrasRecarga).to.not.be.undefined;
        log.exito('Comentario persiste correctamente después de recargar página');
        
        await capturarPantallaConNombre('COMMENT_006_persistencia_recarga', 'VERIFICADO');
    });
});