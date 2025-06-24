const LoginPage = require('../../pageobjects/LoginPage');
const HomePage = require('../../pageobjects/HomePage');

describe('Autenticación - Login Exitoso', () => {
    
    before(() => {
        log.seccion('🔐 AUTENTICACIÓN: Login con credenciales válidas');
    });

    beforeEach(async () => {
        await browser.url('/');
        await browser.maximizeWindow();
        
        // Asegurar estado limpio
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
            // Ignorar errores de limpieza
        }
    });

    it('LOGIN_001 - Usuario puede autenticarse con credenciales válidas', async () => {
        log.info('Verificando login exitoso con credenciales correctas');
        
        // Paso 1: Intentar login con credenciales válidas
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        await browser.pause(2000);
        
        // Paso 2: Verificar que se autenticó correctamente
        const estaAutenticado = await LoginPage.usuarioEstaAutenticado();
        expect(estaAutenticado).to.be.true;
        log.exito('Usuario correctamente autenticado');
        
        // Paso 3: Verificar que el nombre de usuario aparece
        const nombreUsuario = await LoginPage.obtenerNombreUsuario();
        expect(nombreUsuario).to.not.be.empty;
        log.exito(`Nombre de usuario mostrado: ${nombreUsuario}`);
        
        // Paso 4: Verificar redirección correcta
        const urlActual = await browser.getUrl();
        expect(urlActual).to.include('justtestit.org');
        log.exito('Redirección post-login correcta');
        
        await capturarPantallaConNombre('LOGIN_001_autenticacion_exitosa', 'VERIFICADO');
    });

    it('LOGIN_002 - Sesión persiste al navegar por la aplicación', async () => {
        log.info('Verificando persistencia de sesión durante navegación');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        await LoginPage.validarEstadoAutenticacion(true);
        
        // Paso 2: Navegar a diferentes secciones
        await HomePage.navegarAMarcaPopular();
        await browser.pause(2000);
        
        let autenticadoEnMarca = await LoginPage.usuarioEstaAutenticado();
        expect(autenticadoEnMarca).to.be.true;
        log.exito('Sesión mantenida en página de marca');
        
        // Paso 3: Navegar a modelo específico
        await HomePage.navegarAModeloPopular();
        await browser.pause(2000);
        
        let autenticadoEnModelo = await LoginPage.usuarioEstaAutenticado();
        expect(autenticadoEnModelo).to.be.true;
        log.exito('Sesión mantenida en página de modelo');
        
        // Paso 4: Regresar al home
        await HomePage.regresarAlHome();
        await browser.pause(2000);
        
        let autenticadoEnHome = await LoginPage.usuarioEstaAutenticado();
        expect(autenticadoEnHome).to.be.true;
        log.exito('Sesión mantenida al regresar al home');
        
        await capturarPantallaConNombre('LOGIN_002_persistencia_sesion', 'VERIFICADO');
    });

    it('LOGIN_003 - Logout funciona correctamente', async () => {
        log.info('Verificando funcionalidad de logout');
        
        // Paso 1: Autenticarse primero
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        await LoginPage.validarEstadoAutenticacion(true);
        
        // Paso 2: Realizar logout
        await LoginPage.cerrarSesion();
        await browser.pause(2000);
        
        // Paso 3: Verificar que la sesión se cerró
        const estaAutenticado = await LoginPage.usuarioEstaAutenticado();
        expect(estaAutenticado).to.be.false;
        log.exito('Sesión cerrada correctamente');
        
        // Paso 4: Verificar que formulario de login está disponible
        const formularioVisible = await LoginPage.formularioLoginVisible();
        expect(formularioVisible).to.be.true;
        log.exito('Formulario de login disponible después de logout');
        
        await capturarPantallaConNombre('LOGIN_003_logout_exitoso', 'VERIFICADO');
    });

    it('LOGIN_004 - Información de usuario se muestra correctamente', async () => {
        log.info('Verificando información de usuario autenticado');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        
        // Paso 2: Obtener y validar información de usuario
        const nombreUsuario = await LoginPage.obtenerNombreUsuario();
        expect(nombreUsuario).to.not.be.empty;
        expect(nombreUsuario).to.be.a('string');
        log.exito(`Usuario autenticado: ${nombreUsuario}`);
        
        // Paso 3: Verificar que la información es consistente
        const nombreUsuario2 = await LoginPage.obtenerNombreUsuario();
        expect(nombreUsuario2).to.equal(nombreUsuario);
        log.exito('Información de usuario consistente');
        
        await capturarPantallaConNombre('LOGIN_004_informacion_usuario', 'VERIFICADO');
    });
});