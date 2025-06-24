const LoginPage = require('../../pageobjects/LoginPage');
const HomePage = require('../../pageobjects/HomePage');
const ModeloAutoPage = require('../../pageobjects/ModeloAutoPage');

describe('CA02 - Ocultar Elementos Sin Sesión', () => {
    
    before(() => {
        log.seccion('CA02 - CRITERIO: Ocultar botón de votar y campo de comentario cuando no haya sesión activa');
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
            // Si ya no hay sesión, continuar
        }
    });

    it('CA02.1 - Botón de votar no visible para usuario sin sesión', async () => {
        log.info('Verificando que botón de votar esté oculto sin sesión');
        
        // Paso 1: Verificar que no hay sesión activa
        const estaAutenticado = await LoginPage.usuarioEstaAutenticado();
        expect(estaAutenticado).to.be.false;
        log.exito('Usuario no autenticado confirmado');
        
        // Paso 2: Navegar a un modelo de auto
        await HomePage.navegarAModeloPopular();
        
        // Paso 3: Verificar que el botón de votar NO está visible
        const puedeVotar = await ModeloAutoPage.puedeVotar();
        expect(puedeVotar).to.be.false;
        log.exito('Botón de votar correctamente oculto');
        
        // Paso 4: Verificar estado del voto
        const estadoVoto = await ModeloAutoPage.verificarEstadoVoto();
        expect(estadoVoto.puedeVotar).to.be.false;
        expect(estadoVoto.requiereLogin).to.be.true;
        log.exito('Estado de voto correcto: requiere login');
        
        await capturarPantallaConNombre('CA02_1_boton_votar_oculto', 'VERIFICADO');
    });

    it('CA02.2 - Campo de comentario no visible para usuario sin sesión', async () => {
        log.info('Verificando que campo de comentario esté oculto sin sesión');
        
        // Paso 1: Confirmar ausencia de sesión
        const estaAutenticado = await LoginPage.usuarioEstaAutenticado();
        expect(estaAutenticado).to.be.false;
        
        // Paso 2: Navegar a un modelo
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Verificar que el campo de comentario NO está visible
        const puedeComentarar = await ModeloAutoPage.puedeComentarar();
        expect(puedeComentarar).to.be.false;
        log.exito('Campo de comentario correctamente oculto');
        
        await capturarPantallaConNombre('CA02_2_campo_comentario_oculto', 'VERIFICADO');
    });

    it('CA02.3 - Mensaje informativo mostrado cuando no hay sesión activa', async () => {
        log.info('Verificando mensaje informativo para usuarios sin sesión');
        
        // Paso 1: Asegurar que no hay sesión
        await LoginPage.validarEstadoAutenticacion(false);
        
        // Paso 2: Navegar a página de modelo
        await HomePage.navegarAModeloPopular();
        
        // Paso 3: Verificar mensaje de requerimiento de login
        const estadoVoto = await ModeloAutoPage.verificarEstadoVoto();
        expect(estadoVoto.requiereLogin).to.be.true;
        expect(estadoVoto.mensaje).to.include('logged in');
        log.exito(`Mensaje correcto mostrado: ${estadoVoto.mensaje}`);
        
        await capturarPantallaConNombre('CA02_3_mensaje_informativo', 'VERIFICADO');
    });

    it('CA02.4 - Formulario de login visible cuando no hay sesión', async () => {
        log.info('Verificando que formulario de login esté visible sin sesión');
        
        // Paso 1: Ir a home sin sesión
        await HomePage.abrirPaginaPrincipal();
        
        // Paso 2: Verificar formulario de login visible
        const formularioVisible = await LoginPage.formularioLoginVisible();
        expect(formularioVisible).to.be.true;
        log.exito('Formulario de login visible');
        
        // Paso 3: Verificar elementos del formulario
        const elementos = await LoginPage.verificarElementosFormulario();
        expect(elementos.campoLogin).to.be.true;
        expect(elementos.campoPassword).to.be.true;
        expect(elementos.botonLogin).to.be.true;
        expect(elementos.enlaceRegistro).to.be.true;
        log.exito('Todos los elementos del formulario presentes');
        
        await capturarPantallaConNombre('CA02_4_formulario_login_visible', 'VERIFICADO');
    });

    it('CA02.5 - Información del auto visible sin afectar funcionalidad de votación', async () => {
        log.info('Verificando que información del auto esté disponible sin sesión');
        
        // Paso 1: Navegar sin sesión
        await HomePage.navegarAModeloPopular();
        
        // Paso 2: Verificar que la información del auto está disponible
        const infoAuto = await ModeloAutoPage.obtenerInformacionAuto();
        expect(infoAuto.titulo).to.not.be.empty;
        expect(infoAuto.cantidadVotos).to.be.at.least(0);
        expect(infoAuto.imagenVisible).to.be.true;
        log.exito(`Información disponible: ${infoAuto.titulo} con ${infoAuto.cantidadVotos} votos`);
        
        // Paso 3: Verificar descripción y especificaciones
        await ModeloAutoPage.validarInformacionCompleta();
        log.exito('Descripción y especificaciones disponibles');
        
        // Paso 4: Verificar que solo la votación está restringida
        const estadoVoto = await ModeloAutoPage.verificarEstadoVoto();
        expect(estadoVoto.puedeVotar).to.be.false;
        expect(estadoVoto.requiereLogin).to.be.true;
        log.exito('Solo funcionalidad de votación restringida');
        
        await capturarPantallaConNombre('CA02_5_info_auto_disponible', 'VERIFICADO');
    });

    it('CA02.6 - Tabla de comentarios visible pero sin capacidad de agregar comentarios', async () => {
        log.info('Verificando acceso de solo lectura a comentarios sin sesión');
        
        // Paso 1: Navegar a modelo sin sesión
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 2: Verificar que la tabla de comentarios está visible
        const verificacionTabla = await ModeloAutoPage.verificarTablaComentarios();
        expect(verificacionTabla.tablaPresente).to.be.true;
        expect(verificacionTabla.encabezadosCorrecto).to.be.true;
        log.exito('Tabla de comentarios visible con estructura correcta');
        
        // Paso 3: Verificar que puede leer comentarios existentes
        const comentarios = await ModeloAutoPage.obtenerComentarios();
        log.info(`Comentarios existentes encontrados: ${comentarios.length}`);
        
        // Paso 4: Verificar que NO puede agregar comentarios
        const puedeComentarar = await ModeloAutoPage.puedeComentarar();
        expect(puedeComentarar).to.be.false;
        log.exito('Capacidad de agregar comentarios correctamente restringida');
        
        await capturarPantallaConNombre('CA02_6_comentarios_solo_lectura', 'VERIFICADO');
    });

    it('CA02.7 - Navegación funcional sin restricciones para usuario sin sesión', async () => {
        log.info('Verificando navegación libre sin sesión');
        
        // Paso 1: Verificar navegación en home
        await HomePage.abrirPaginaPrincipal();
        await HomePage.validarPaginaPrincipalCargada();
        
        // Paso 2: Navegar a diferentes secciones
        await HomePage.navegarAMarcaPopular();
        await browser.pause(1000);
        
        await HomePage.regresarAlHome();
        await browser.pause(1000);
        
        await HomePage.navegarARatingGeneral();
        await browser.pause(1000);
        
        // Paso 3: Verificar que todas las navegaciones funcionaron
        const urlActual = await browser.getUrl();
        expect(urlActual).to.include('overall');
        log.exito('Navegación funcional sin restricciones');
        
        await capturarPantallaConNombre('CA02_7_navegacion_libre', 'VERIFICADO');
    });

    it('CA02.8 - Transición correcta de estado al iniciar sesión', async () => {
        log.info('Verificando cambio de estado al autenticarse');
        
        // Paso 1: Verificar estado inicial sin sesión
        await HomePage.navegarAModeloPopular();
        
        const estadoSinSesion = await ModeloAutoPage.verificarEstadoVoto();
        expect(estadoSinSesion.puedeVotar).to.be.false;
        expect(estadoSinSesion.requiereLogin).to.be.true;
        log.exito('Estado inicial sin sesión verificado');
        
        // Paso 2: Iniciar sesión en la misma página
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        await browser.pause(2000);
        
        // Paso 3: Verificar cambio de estado
        const estadoConSesion = await ModeloAutoPage.verificarEstadoVoto();
        expect(estadoConSesion.requiereLogin).to.be.false;
        
        // Debe poder votar o ya haber votado
        const puedeVotar = estadoConSesion.puedeVotar || estadoConSesion.yavaVoto;
        expect(puedeVotar).to.be.true;
        log.exito('Transición de estado exitosa después del login');
        
        await capturarPantallaConNombre('CA02_8_transicion_estado', 'VERIFICADO');
    });
});