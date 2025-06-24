const LoginPage = require('../../pageobjects/LoginPage');
const HomePage = require('../../pageobjects/HomePage');
const ModeloAutoPage = require('../../pageobjects/ModeloAutoPage');

describe('CA01 - Votación Usuario Autenticado', () => {
    
    before(() => {
        log.seccion('CA01 - CRITERIO: Se debe poder votar si el usuario se encuentra con la sesión activa');
    });

    beforeEach(async () => {
        await browser.url('/');
        await browser.maximizeWindow();
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

    it('CA01.1 - Usuario autenticado puede votar un auto exitosamente', async () => {
        log.info('Iniciando prueba de votación exitosa para usuario autenticado');
        
        // Paso 1: Iniciar sesión
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        await LoginPage.validarEstadoAutenticacion(true);
        
        // Paso 2: Navegar al modelo popular
        await HomePage.navegarAModeloPopular();
        
        // Paso 3: Verificar información del auto
        const infoAuto = await ModeloAutoPage.obtenerInformacionAuto();
        expect(infoAuto.titulo).to.not.be.empty;
        expect(infoAuto.cantidadVotos).to.be.at.least(0);
        log.exito(`Auto encontrado: ${infoAuto.titulo} con ${infoAuto.cantidadVotos} votos`);
        
        // Paso 4: Obtener cantidad de votos inicial
        const votosIniciales = await ModeloAutoPage.obtenerCantidadVotos();
        log.info(`Votos iniciales: ${votosIniciales}`);
        
        // Paso 5: Verificar que puede votar
        const puedeVotar = await ModeloAutoPage.puedeVotar();
        expect(puedeVotar).to.be.true;
        log.exito('Usuario puede votar - botón disponible');
        
        // Paso 6: Realizar votación
        const votoExitoso = await ModeloAutoPage.votarAuto();
        expect(votoExitoso).to.be.true;
        log.exito('Voto enviado exitosamente');
        
        // Paso 7: Verificar estado post-votación
        const estadoVoto = await ModeloAutoPage.verificarEstadoVoto();
        expect(estadoVoto.yavaVoto).to.be.true;
        expect(estadoVoto.mensaje).to.include(mensajes.votoExitoso);
        log.exito(`Estado post-voto verificado: ${estadoVoto.mensaje}`);
        
        // Paso 8: Verificar incremento en contador de votos
        const votosFinales = await ModeloAutoPage.obtenerCantidadVotos();
        expect(votosFinales).to.be.greaterThan(votosIniciales);
        log.exito(`Votos incrementados de ${votosIniciales} a ${votosFinales}`);
        
        // Capturar evidencia
        await capturarPantallaConNombre('CA01_1_votacion_exitosa', 'COMPLETADO');
    });

    it('CA01.2 - Usuario autenticado recibe confirmación después de votar', async () => {
        log.info('Verificando mensaje de confirmación post-votación');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        
        // Paso 2: Navegar a un modelo específico
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Verificar estado inicial
        const estadoInicial = await ModeloAutoPage.verificarEstadoVoto();
        
        if (estadoInicial.puedeVotar) {
            // Realizar voto si es posible
            await ModeloAutoPage.votarAuto();
            
            // Verificar mensaje de confirmación
            const estadoFinal = await ModeloAutoPage.verificarEstadoVoto();
            expect(estadoFinal.mensaje).to.include('Thank you for your vote!');
            log.exito('Mensaje de confirmación mostrado correctamente');
        } else if (estadoInicial.yavaVoto) {
            // Si ya votó, verificar que se muestra el mensaje correcto
            expect(estadoInicial.mensaje).to.include('Thank you for your vote!');
            log.exito('Usuario ya había votado - mensaje correcto mostrado');
        }
        
        await capturarPantallaConNombre('CA01_2_confirmacion_voto', 'VERIFICADO');
    });

    it('CA01.3 - Usuario autenticado mantiene sesión durante proceso de votación', async () => {
        log.info('Verificando persistencia de sesión durante votación');
        
        // Paso 1: Iniciar sesión
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        const nombreUsuarioInicial = await LoginPage.obtenerNombreUsuario();
        
        // Paso 2: Navegar por diferentes páginas
        await HomePage.navegarAMarcaPopular();
        await browser.pause(1000);
        
        await HomePage.navegarAModeloPopular();
        await browser.pause(1000);
        
        // Paso 3: Verificar que la sesión se mantiene
        const sigueAutenticado = await LoginPage.usuarioEstaAutenticado();
        expect(sigueAutenticado).to.be.true;
        
        const nombreUsuarioFinal = await LoginPage.obtenerNombreUsuario();
        expect(nombreUsuarioFinal).to.equal(nombreUsuarioInicial);
        log.exito('Sesión mantenida durante toda la navegación');
        
        // Paso 4: Intentar votar
        if (await ModeloAutoPage.puedeVotar()) {
            await ModeloAutoPage.votarAuto();
            
            // Verificar que sigue autenticado después del voto
            const sigueAutenticadoPostVoto = await LoginPage.usuarioEstaAutenticado();
            expect(sigueAutenticadoPostVoto).to.be.true;
            log.exito('Sesión mantenida después de votar');
        }
        
        await capturarPantallaConNombre('CA01_3_persistencia_sesion', 'VERIFICADO');
    });
});