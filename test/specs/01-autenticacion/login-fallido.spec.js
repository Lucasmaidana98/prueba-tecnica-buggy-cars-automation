const LoginPage = require('../../pageobjects/LoginPage');

describe('Autenticación - Login Fallido', () => {
    
    before(() => {
        log.seccion('🔐 AUTENTICACIÓN: Validación de credenciales incorrectas');
    });

    beforeEach(async () => {
        await browser.url('/');
        await browser.maximizeWindow();
        
        // Asegurar estado sin autenticación
        try {
            if (await LoginPage.usuarioEstaAutenticado()) {
                await LoginPage.cerrarSesion();
            }
        } catch (error) {
            // Continuar si no hay sesión
        }
    });

    it('LOGIN_FAIL_001 - Credenciales incorrectas son rechazadas', async () => {
        log.info('Verificando rechazo de credenciales incorrectas');
        
        // Paso 1: Intentar login con credenciales incorrectas
        await LoginPage.iniciarSesion(credenciales.invalidas.email, credenciales.invalidas.password);
        await browser.pause(3000);
        
        // Paso 2: Verificar que NO se autenticó
        const estaAutenticado = await LoginPage.usuarioEstaAutenticado();
        expect(estaAutenticado).to.be.false;
        log.exito('Usuario correctamente NO autenticado con credenciales incorrectas');
        
        // Paso 3: Verificar que el formulario de login sigue visible
        const formularioVisible = await LoginPage.formularioLoginVisible();
        expect(formularioVisible).to.be.true;
        log.exito('Formulario de login sigue disponible después de intento fallido');
        
        await capturarPantallaConNombre('LOGIN_FAIL_001_credenciales_incorrectas', 'VERIFICADO');
    });

    it('LOGIN_FAIL_002 - Email vacío no permite autenticación', async () => {
        log.info('Verificando validación de email vacío');
        
        // Paso 1: Intentar login con email vacío
        await LoginPage.iniciarSesion('', credenciales.validas.password);
        await browser.pause(2000);
        
        const autenticadoEmailVacio = await LoginPage.usuarioEstaAutenticado();
        expect(autenticadoEmailVacio).to.be.false;
        log.exito('Login correctamente rechazado con email vacío');
        
        await capturarPantallaConNombre('LOGIN_FAIL_002_email_vacio', 'VERIFICADO');
    });

    it('LOGIN_FAIL_003 - Password vacío no permite autenticación', async () => {
        log.info('Verificando validación de password vacío');
        
        // Paso 1: Limpiar y intentar con password vacío
        await LoginPage.limpiarFormulario();
        await LoginPage.iniciarSesion(credenciales.validas.email, '');
        await browser.pause(2000);
        
        const autenticadoPasswordVacio = await LoginPage.usuarioEstaAutenticado();
        expect(autenticadoPasswordVacio).to.be.false;
        log.exito('Login correctamente rechazado con password vacío');
        
        await capturarPantallaConNombre('LOGIN_FAIL_003_password_vacio', 'VERIFICADO');
    });

    it('LOGIN_FAIL_004 - Ambos campos vacíos no permiten autenticación', async () => {
        log.info('Verificando validación de ambos campos vacíos');
        
        // Paso 1: Intentar con ambos campos vacíos
        await LoginPage.limpiarFormulario();
        await LoginPage.iniciarSesion('', '');
        await browser.pause(2000);
        
        const autenticadoAmbosVacios = await LoginPage.usuarioEstaAutenticado();
        expect(autenticadoAmbosVacios).to.be.false;
        log.exito('Login correctamente rechazado con ambos campos vacíos');
        
        await capturarPantallaConNombre('LOGIN_FAIL_004_campos_vacios', 'VERIFICADO');
    });

    it('LOGIN_FAIL_005 - Múltiples intentos fallidos son manejados', async () => {
        log.info('Verificando robustez ante múltiples intentos fallidos');
        
        // Paso 1: Realizar múltiples intentos de login en sucesión
        for (let i = 0; i < 3; i++) {
            await LoginPage.iniciarSesion('usuario_falso', 'password_falso');
            await browser.pause(1000);
            
            const estaAutenticado = await LoginPage.usuarioEstaAutenticado();
            expect(estaAutenticado).to.be.false;
        }
        
        log.exito('Sistema resistente a múltiples intentos de login fallidos');
        
        // Paso 2: Verificar que después se puede hacer login normal
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        await browser.pause(2000);
        
        const loginNormalExitoso = await LoginPage.usuarioEstaAutenticado();
        expect(loginNormalExitoso).to.be.true;
        log.exito('Login normal funciona después de múltiples intentos fallidos');
        
        await capturarPantallaConNombre('LOGIN_FAIL_005_multiples_intentos', 'VERIFICADO');
    });
});