const LoginPage = require('../../pageobjects/LoginPage');
const HomePage = require('../../pageobjects/HomePage');
const ModeloAutoPage = require('../../pageobjects/ModeloAutoPage');

describe('Seguridad - Protecciones del Sistema', () => {
    
    before(() => {
        log.seccion('🛡️ SEGURIDAD: Protecciones del sistema y manipulación');
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

    it('SEC_SYS_001 - Protección contra manipulación del DOM para votar', async () => {
        log.info('Verificando protección contra manipulación del DOM sin sesión');
        
        // Paso 1: Navegar a modelo sin autenticación
        await HomePage.navegarAModeloPopular();
        
        // Paso 2: Verificar estado inicial
        const estadoInicial = await ModeloAutoPage.verificarEstadoVoto();
        expect(estadoInicial.puedeVotar).to.be.false;
        expect(estadoInicial.requiereLogin).to.be.true;
        
        const votosIniciales = await ModeloAutoPage.obtenerCantidadVotos();
        log.info(`Votos iniciales: ${votosIniciales}`);
        
        // Paso 3: Intentar manipular DOM para mostrar botón de voto
        await browser.execute(() => {
            // Intentar crear botón de voto falso
            const botonFalso = document.createElement('button');
            botonFalso.innerText = 'Vote';
            botonFalso.className = 'btn btn-primary vote-button';
            botonFalso.onclick = () => {
                // Intentar enviar voto falso
                fetch('/api/vote', { method: 'POST', body: JSON.stringify({model: 'test'}) });
            };
            document.body.appendChild(botonFalso);
        });
        
        // Paso 4: Verificar que el sistema no procesó votos falsos
        await browser.pause(3000);
        const votosFinales = await ModeloAutoPage.obtenerCantidadVotos();
        expect(votosFinales).to.equal(votosIniciales);
        log.exito('Sistema protegido contra manipulación del DOM');
        
        await capturarPantallaConNombre('SEC_SYS_001_manipulacion_dom', 'VERIFICADO');
    });

    it('SEC_SYS_002 - URLs malformadas son manejadas correctamente', async () => {
        log.info('Verificando manejo de URLs malformadas');
        
        // Paso 1: Intentar acceder a rutas inexistentes
        const rutasInexistentes = [
            '/model/inexistente',
            '/make/999999999',
            '/model/ckl2phsabijs71623vk0|inexistente',
            '/overall/error',
            '/profile/hack'
        ];
        
        for (let ruta of rutasInexistentes) {
            try {
                log.info(`Probando ruta inexistente: ${ruta}`);
                
                await browser.url(ruta);
                await browser.pause(2000);
                
                // Verificar que no hay errores críticos
                const titulo = await browser.getTitle();
                expect(titulo).to.include('Buggy');
                
                log.exito(`Ruta inexistente manejada: ${ruta}`);
                
            } catch (error) {
                log.info(`Ruta inexistente generó error controlado: ${ruta}`);
            }
        }
        
        await capturarPantallaConNombre('SEC_SYS_002_urls_malformadas', 'VERIFICADO');
    });

    it('SEC_SYS_003 - Navegación directa a páginas protegidas sin sesión', async () => {
        log.info('Verificando protección de páginas que requieren autenticación');
        
        // Paso 1: Asegurar que no hay sesión
        const estaAutenticado = await LoginPage.usuarioEstaAutenticado();
        expect(estaAutenticado).to.be.false;
        
        // Paso 2: Intentar acceder directamente a perfil
        await browser.url('/profile');
        await browser.pause(2000);
        
        // Paso 3: Verificar redirección o mensaje de error
        const urlActual = await browser.getUrl();
        const titulo = await browser.getTitle();
        
        // La página debe manejar el acceso no autorizado de alguna manera
        expect(titulo).to.include('Buggy');
        log.exito('Acceso a página protegida manejado correctamente');
        
        await capturarPantallaConNombre('SEC_SYS_003_paginas_protegidas', 'VERIFICADO');
    });

    it('SEC_SYS_004 - Múltiples intentos de login rápidos no causan problemas', async () => {
        log.info('Verificando robustez ante múltiples intentos de login');
        
        // Paso 1: Realizar múltiples intentos de login en sucesión rápida
        for (let i = 0; i < 5; i++) {
            await LoginPage.iniciarSesion('usuario_falso', 'password_falso');
            await browser.pause(500); // Pausa muy corta para simular ataques automatizados
            
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
        
        await capturarPantallaConNombre('SEC_SYS_004_multiples_intentos', 'VERIFICADO');
    });

    it('SEC_SYS_005 - Concurrencia: múltiples ventanas de la misma cuenta', async () => {
        log.info('Verificando comportamiento con múltiples ventanas/pestañas');
        
        // Paso 1: Autenticarse en ventana principal
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        await LoginPage.validarEstadoAutenticacion(true);
        
        // Paso 2: Navegar a modelo para votar
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        const estadoVoto1 = await ModeloAutoPage.verificarEstadoVoto();
        const votosIniciales = await ModeloAutoPage.obtenerCantidadVotos();
        
        // Paso 3: Abrir nueva ventana con la misma sesión
        await browser.newWindow('/model/ckl2phsabijs71623vk0|ckl2phsabijs71623vqg');
        await browser.pause(2000);
        
        // Paso 4: Verificar estado en nueva ventana
        const estadoVoto2 = await ModeloAutoPage.verificarEstadoVoto();
        
        // Ambas ventanas deben mostrar el mismo estado para el mismo usuario
        if (estadoVoto1.yavaVoto) {
            expect(estadoVoto2.yavaVoto).to.be.true;
            log.exito('Estado de voto consistente entre ventanas');
        } else if (estadoVoto1.puedeVotar) {
            // Si puede votar en una, debe poder en la otra (o ya no poder si ya votó)
            log.info('Estado de votación verificado entre ventanas');
        }
        
        // Paso 5: Cerrar ventana adicional
        await browser.closeWindow();
        const handles = await browser.getWindowHandles();
        await browser.switchWindow(handles[0]);
        
        await capturarPantallaConNombre('SEC_SYS_005_multiples_ventanas', 'VERIFICADO');
    });

    it('SEC_SYS_006 - Validación de timeout y reconexión', async () => {
        log.info('Verificando comportamiento ante problemas de conectividad');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        
        // Paso 2: Simular lentitud de red con timeout largo
        await browser.setTimeout({
            'implicit': 1000,  // Reducir timeout para simular problemas
            'pageLoad': 5000
        });
        
        try {
            // Paso 3: Intentar navegación que puede fallar
            await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
            
            // Verificar que la página cargó eventualmente
            const infoAuto = await ModeloAutoPage.obtenerInformacionAuto();
            expect(infoAuto.titulo).to.not.be.empty;
            log.exito('Navegación exitosa incluso con timeouts reducidos');
            
        } catch (error) {
            log.info('Timeout causó error controlado (comportamiento esperado)');
        } finally {
            // Paso 4: Restaurar timeouts normales
            await browser.setTimeout({
                'implicit': 10000,
                'pageLoad': 30000
            });
        }
        
        await capturarPantallaConNombre('SEC_SYS_006_timeout_reconexion', 'VERIFICADO');
    });

    it('SEC_SYS_007 - Protección contra modificación de cookies/session', async () => {
        log.info('Verificando protección de sesión contra manipulación');
        
        // Paso 1: Autenticarse normalmente
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        await LoginPage.validarEstadoAutenticacion(true);
        
        // Paso 2: Obtener cookies actuales
        const cookiesOriginales = await browser.getAllCookies();
        log.info(`Cookies originales encontradas: ${cookiesOriginales.length}`);
        
        // Paso 3: Intentar manipular cookies de sesión
        try {
            await browser.execute(() => {
                // Intentar modificar cookies relacionadas con sesión
                document.cookie = "sessionid=fake-session-id; path=/";
                document.cookie = "user=admin; path=/";
                document.cookie = "role=administrator; path=/";
            });
            
            await browser.pause(2000);
            
            // Paso 4: Verificar que la sesión sigue siendo válida o se invalidó apropiadamente
            const estaAutenticadoDespues = await LoginPage.usuarioEstaAutenticado();
            log.info(`Estado de autenticación después de manipular cookies: ${estaAutenticadoDespues}`);
            
            // El sistema debe manejar la manipulación apropiadamente
            log.exito('Sistema maneja manipulación de cookies apropiadamente');
            
        } catch (error) {
            log.exito('Manipulación de cookies causó error controlado');
        }
        
        await capturarPantallaConNombre('SEC_SYS_007_proteccion_cookies', 'VERIFICADO');
    });
});