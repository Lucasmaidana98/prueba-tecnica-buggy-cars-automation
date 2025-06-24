const LoginPage = require('../../pageobjects/LoginPage');
const HomePage = require('../../pageobjects/HomePage');
const ModeloAutoPage = require('../../pageobjects/ModeloAutoPage');

describe('Votación - Usuario Autenticado', () => {
    
    before(() => {
        log.seccion('🗳️ VOTACIÓN: Funcionalidad para usuarios autenticados');
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

    it('VOTE_AUTH_001 - Usuario autenticado puede votar exitosamente', async () => {
        log.info('Verificando votación exitosa con usuario autenticado');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        await LoginPage.validarEstadoAutenticacion(true);
        
        // Paso 2: Navegar a modelo específico
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Obtener información inicial del auto
        const infoInicial = await ModeloAutoPage.obtenerInformacionAuto();
        const votosIniciales = infoInicial.cantidadVotos;
        log.info(`Auto: ${infoInicial.titulo}, Votos iniciales: ${votosIniciales}`);
        
        // Paso 4: Verificar estado del botón de voto
        const estadoVoto = await ModeloAutoPage.verificarEstadoVoto();
        
        if (estadoVoto.puedeVotar) {
            // Paso 5: Enviar voto
            await ModeloAutoPage.votarAuto();
            await browser.pause(3000);
            
            // Paso 6: Verificar confirmación
            const confirmacion = await ModeloAutoPage.verificarConfirmacionVoto();
            expect(confirmacion.mensaje).to.include('Thank you for your vote');
            log.exito('Confirmación de voto recibida: ' + confirmacion.mensaje);
            
            // Paso 7: Verificar actualización del contador
            const votosFinales = await ModeloAutoPage.obtenerCantidadVotos();
            expect(votosFinales).to.be.greaterThan(votosIniciales);
            log.exito(`Contador actualizado: ${votosIniciales} -> ${votosFinales}`);
            
        } else if (estadoVoto.yavaVoto) {
            log.info('Usuario ya había votado previamente - comportamiento correcto');
            expect(estadoVoto.mensaje).to.include('Thank you for your vote');
        }
        
        await capturarPantallaConNombre('VOTE_AUTH_001_votacion_exitosa', 'VERIFICADO');
    });

    it('VOTE_AUTH_002 - Estado post-votación se mantiene', async () => {
        log.info('Verificando persistencia del estado de votación');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        
        // Paso 2: Navegar a modelo
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Verificar estado actual
        const estadoVoto = await ModeloAutoPage.verificarEstadoVoto();
        
        if (estadoVoto.yavaVoto) {
            log.info('Usuario ya votó - verificando persistencia del estado');
            
            // Paso 4: Recargar página
            await browser.refresh();
            await browser.pause(3000);
            
            // Paso 5: Verificar que el estado se mantiene
            const estadoDespuesRecarga = await ModeloAutoPage.verificarEstadoVoto();
            expect(estadoDespuesRecarga.yavaVoto).to.be.true;
            log.exito('Estado de voto persiste después de recargar página');
            
        } else {
            log.info('Usuario no ha votado - el test de persistencia se ejecutará después de votar');
        }
        
        await capturarPantallaConNombre('VOTE_AUTH_002_persistencia_estado', 'VERIFICADO');
    });

    it('VOTE_AUTH_003 - Botón de voto visible para usuario autenticado', async () => {
        log.info('Verificando visibilidad del botón de voto para usuario autenticado');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        
        // Paso 2: Navegar a diferentes modelos y verificar botón
        const modelos = [
            { makeId: 'ckl2phsabijs71623vk0', modelId: 'ckl2phsabijs71623vqg' }
        ];
        
        for (let modelo of modelos) {
            await ModeloAutoPage.navegarAModelo(modelo.makeId, modelo.modelId);
            
            const estadoVoto = await ModeloAutoPage.verificarEstadoVoto();
            
            // El botón debe estar visible (puede votar) o mostrar que ya votó
            expect(estadoVoto.puedeVotar || estadoVoto.yavaVoto).to.be.true;
            expect(estadoVoto.requiereLogin).to.be.false;
            
            if (estadoVoto.puedeVotar) {
                log.exito('Botón de voto visible y disponible');
            } else if (estadoVoto.yavaVoto) {
                log.exito('Estado post-voto mostrado correctamente');
            }
        }
        
        await capturarPantallaConNombre('VOTE_AUTH_003_boton_visible', 'VERIFICADO');
    });

    it('VOTE_AUTH_004 - Información del auto permanece durante votación', async () => {
        log.info('Verificando que información del auto no se pierde durante votación');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        
        // Paso 2: Navegar a modelo y obtener información
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        const infoAntes = await ModeloAutoPage.obtenerInformacionAuto();
        
        // Paso 3: Verificar estado de voto
        const estadoVoto = await ModeloAutoPage.verificarEstadoVoto();
        
        if (estadoVoto.puedeVotar) {
            // Paso 4: Realizar votación
            await ModeloAutoPage.votarAuto();
            await browser.pause(2000);
        }
        
        // Paso 5: Verificar que información básica se mantiene
        const infoDespues = await ModeloAutoPage.obtenerInformacionAuto();
        
        expect(infoDespues.titulo).to.equal(infoAntes.titulo);
        expect(infoDespues.descripcion).to.equal(infoAntes.descripcion);
        expect(infoDespues.especificaciones).to.equal(infoAntes.especificaciones);
        expect(infoDespues.imagenVisible).to.equal(infoAntes.imagenVisible);
        
        log.exito('Información del auto preservada durante proceso de votación');
        
        await capturarPantallaConNombre('VOTE_AUTH_004_informacion_preservada', 'VERIFICADO');
    });
});