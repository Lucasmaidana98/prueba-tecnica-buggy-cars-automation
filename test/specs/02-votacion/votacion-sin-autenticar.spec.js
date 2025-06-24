const LoginPage = require('../../pageobjects/LoginPage');
const HomePage = require('../../pageobjects/HomePage');
const ModeloAutoPage = require('../../pageobjects/ModeloAutoPage');

describe('Votación - Usuario No Autenticado', () => {
    
    before(() => {
        log.seccion('🗳️ VOTACIÓN: Restricciones para usuarios no autenticados');
    });

    beforeEach(async () => {
        await browser.url('/');
        await browser.maximizeWindow();
        
        // Asegurar que no hay sesión activa
        try {
            if (await LoginPage.usuarioEstaAutenticado()) {
                await LoginPage.cerrarSesion();
            }
        } catch (error) {
            // Continuar si no hay sesión
        }
    });

    it('VOTE_NOAUTH_001 - Botón de votar oculto sin autenticación', async () => {
        log.info('Verificando que botón de votar esté oculto sin autenticación');
        
        // Paso 1: Verificar estado sin autenticación
        const estaAutenticado = await LoginPage.usuarioEstaAutenticado();
        expect(estaAutenticado).to.be.false;
        log.exito('Usuario correctamente NO autenticado');
        
        // Paso 2: Navegar a modelo sin sesión
        await HomePage.navegarAModeloPopular();
        
        // Paso 3: Verificar estado del voto
        const estadoVoto = await ModeloAutoPage.verificarEstadoVoto();
        expect(estadoVoto.puedeVotar).to.be.false;
        expect(estadoVoto.requiereLogin).to.be.true;
        log.exito('Botón de votar correctamente oculto sin sesión');
        
        await capturarPantallaConNombre('VOTE_NOAUTH_001_boton_oculto', 'VERIFICADO');
    });

    it('VOTE_NOAUTH_002 - Mensaje informativo mostrado sin sesión', async () => {
        log.info('Verificando mensaje informativo para usuarios no autenticados');
        
        // Paso 1: Navegar a modelo sin autenticación
        await HomePage.navegarAModeloPopular();
        
        // Paso 2: Verificar mensaje informativo
        const estadoVoto = await ModeloAutoPage.verificarEstadoVoto();
        expect(estadoVoto.requiereLogin).to.be.true;
        expect(estadoVoto.mensaje).to.include('logged in');
        log.exito('Mensaje informativo mostrado: ' + estadoVoto.mensaje);
        
        await capturarPantallaConNombre('VOTE_NOAUTH_002_mensaje_informativo', 'VERIFICADO');
    });

    it('VOTE_NOAUTH_003 - Formulario de login visible sin sesión', async () => {
        log.info('Verificando que formulario de login esté disponible');
        
        // Paso 1: Navegar a modelo
        await HomePage.navegarAModeloPopular();
        
        // Paso 2: Verificar que formulario de login está visible
        const formularioVisible = await LoginPage.formularioLoginVisible();
        expect(formularioVisible).to.be.true;
        log.exito('Formulario de login disponible para usuarios no autenticados');
        
        await capturarPantallaConNombre('VOTE_NOAUTH_003_formulario_login', 'VERIFICADO');
    });

    it('VOTE_NOAUTH_004 - Información del auto disponible sin sesión', async () => {
        log.info('Verificando que información del auto esté disponible sin autenticación');
        
        // Paso 1: Navegar a modelo
        await HomePage.navegarAModeloPopular();
        
        // Paso 2: Obtener información del auto
        const infoAuto = await ModeloAutoPage.obtenerInformacionAuto();
        
        // Paso 3: Verificar que información básica está disponible
        expect(infoAuto.titulo).to.not.be.empty;
        expect(infoAuto.cantidadVotos).to.be.a('number');
        expect(infoAuto.cantidadVotos).to.be.at.least(0);
        expect(infoAuto.imagenVisible).to.be.true;
        
        log.exito(`Información disponible: ${infoAuto.titulo} con ${infoAuto.cantidadVotos} votos`);
        
        await capturarPantallaConNombre('VOTE_NOAUTH_004_informacion_disponible', 'VERIFICADO');
    });

    it('VOTE_NOAUTH_005 - Transición correcta al autenticarse', async () => {
        log.info('Verificando transición de estado al autenticarse');
        
        // Paso 1: Navegar sin autenticación
        await HomePage.navegarAModeloPopular();
        
        // Paso 2: Verificar estado inicial
        const estadoSinAuth = await ModeloAutoPage.verificarEstadoVoto();
        expect(estadoSinAuth.puedeVotar).to.be.false;
        expect(estadoSinAuth.requiereLogin).to.be.true;
        
        // Paso 3: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        await browser.pause(2000);
        
        // Paso 4: Verificar cambio de estado
        const estadoConAuth = await ModeloAutoPage.verificarEstadoVoto();
        expect(estadoConAuth.requiereLogin).to.be.false;
        expect(estadoConAuth.puedeVotar || estadoConAuth.yavaVoto).to.be.true;
        
        log.exito('Transición de estado correcta después de autenticación');
        
        await capturarPantallaConNombre('VOTE_NOAUTH_005_transicion_auth', 'VERIFICADO');
    });

    it('VOTE_NOAUTH_006 - Navegación funcional sin restricciones', async () => {
        log.info('Verificando que navegación funciona sin autenticación');
        
        // Paso 1: Navegar por diferentes secciones sin autenticación
        await HomePage.abrirPaginaPrincipal();
        await browser.pause(1000);
        
        await HomePage.navegarAMarcaPopular();
        await browser.pause(1000);
        
        await HomePage.navegarAModeloPopular();
        await browser.pause(1000);
        
        // Paso 2: Verificar que cada navegación fue exitosa
        const urlActual = await browser.getUrl();
        expect(urlActual).to.include('justtestit.org');
        
        // Paso 3: Verificar que información sigue disponible
        const infoAuto = await ModeloAutoPage.obtenerInformacionAuto();
        expect(infoAuto.titulo).to.not.be.empty;
        
        log.exito('Navegación funcional sin restricciones para usuarios no autenticados');
        
        await capturarPantallaConNombre('VOTE_NOAUTH_006_navegacion_libre', 'VERIFICADO');
    });
});