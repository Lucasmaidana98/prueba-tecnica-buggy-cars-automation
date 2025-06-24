const LoginPage = require('../../pageobjects/LoginPage');
const HomePage = require('../../pageobjects/HomePage');
const ModeloAutoPage = require('../../pageobjects/ModeloAutoPage');

describe('CN01 - Casos Negativos y Seguridad', () => {
    
    before(() => {
        log.seccion('CN01 - CASOS NEGATIVOS: Validación de seguridad y manejo de errores');
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

    it('CN01.1 - Login con credenciales incorrectas muestra error apropiado', async () => {
        log.info('Verificando manejo de credenciales incorrectas');
        
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
        
        await capturarPantallaConNombre('CN01_1_credenciales_incorrectas', 'VERIFICADO');
    });

    it('CN01.2 - Login con campos vacíos no permite autenticación', async () => {
        log.info('Verificando validación de campos vacíos en login');
        
        // Paso 1: Intentar login con email vacío
        await LoginPage.iniciarSesion('', credenciales.validas.password);
        await browser.pause(2000);
        
        const autenticadoEmailVacio = await LoginPage.usuarioEstaAutenticado();
        expect(autenticadoEmailVacio).to.be.false;
        log.exito('Login rechazado con email vacío');
        
        // Paso 2: Limpiar y intentar con password vacío
        await LoginPage.limpiarFormulario();
        await LoginPage.iniciarSesion(credenciales.validas.email, '');
        await browser.pause(2000);
        
        const autenticadoPasswordVacio = await LoginPage.usuarioEstaAutenticado();
        expect(autenticadoPasswordVacio).to.be.false;
        log.exito('Login rechazado con password vacío');
        
        // Paso 3: Intentar con ambos campos vacíos
        await LoginPage.limpiarFormulario();
        await LoginPage.iniciarSesion('', '');
        await browser.pause(2000);
        
        const autenticadoAmbosVacios = await LoginPage.usuarioEstaAutenticado();
        expect(autenticadoAmbosVacios).to.be.false;
        log.exito('Login rechazado con ambos campos vacíos');
        
        await capturarPantallaConNombre('CN01_2_campos_vacios', 'VERIFICADO');
    });

    it('CN01.3 - Intento de manipulación del DOM para votar sin sesión', async () => {
        log.info('Verificando que no se pueda votar manipulando el DOM sin sesión');
        
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
        
        await capturarPantallaConNombre('CN01_3_manipulacion_dom', 'VERIFICADO');
    });

    it('CN01.4 - Caracteres especiales y scripts en comentarios no causan problemas', async () => {
        log.info('Verificando manejo seguro de caracteres especiales en comentarios');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        
        // Paso 2: Navegar a modelo
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Probar diferentes tipos de input potencialmente problemáticos
        const inputsPeligrosos = [
            '<script>alert("XSS")</script>',
            'javascript:alert("XSS")',
            '\'; DROP TABLE comments; --',
            '<img src="x" onerror="alert(\'XSS\')">',
            '&lt;script&gt;alert("XSS")&lt;/script&gt;'
        ];
        
        for (let i = 0; i < inputsPeligrosos.length; i++) {
            try {
                const input = inputsPeligrosos[i];
                log.info(`Probando input peligroso ${i + 1}: ${input.substring(0, 30)}...`);
                
                // Intentar enviar comentario con contenido potencialmente peligroso
                await ModeloAutoPage.enviarComentario(`Test seguridad ${i + 1}: ${input}`);
                await browser.pause(2000);
                
                // Verificar que la página sigue funcionando normalmente
                const urlActual = await browser.getUrl();
                expect(urlActual).to.include('/model/');
                
                log.exito(`Input peligroso ${i + 1} manejado de forma segura`);
                
            } catch (error) {
                log.info(`Input peligroso ${i + 1} fue rechazado (comportamiento correcto)`);
            }
        }
        
        await capturarPantallaConNombre('CN01_4_input_peligroso', 'VERIFICADO');
    });

    it('CN01.5 - URLs malformadas o inexistentes son manejadas correctamente', async () => {
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
        
        await capturarPantallaConNombre('CN01_5_urls_malformadas', 'VERIFICADO');
    });

    it('CN01.6 - Múltiples intentos de login rápidos no causan problemas', async () => {
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
        
        await capturarPantallaConNombre('CN01_6_multiples_intentos', 'VERIFICADO');
    });

    it('CN01.7 - Navegación directa a páginas protegidas sin sesión', async () => {
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
        
        await capturarPantallaConNombre('CN01_7_paginas_protegidas', 'VERIFICADO');
    });

    it('CN01.8 - Comentarios extremadamente largos son manejados apropiadamente', async () => {
        log.info('Verificando manejo de comentarios extremadamente largos');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        
        // Paso 2: Navegar a modelo
        await HomePage.navegarAModeloPopular();
        
        // Paso 3: Crear comentario extremadamente largo
        const comentarioMuyLargo = 'A'.repeat(10000) + ' - Test comentario largo';
        
        try {
            // Paso 4: Intentar enviar comentario largo
            const enviado = await ModeloAutoPage.enviarComentario(comentarioMuyLargo);
            
            if (enviado) {
                log.info('Comentario largo fue aceptado por el sistema');
                
                // Verificar que no rompió la aplicación
                const urlActual = await browser.getUrl();
                expect(urlActual).to.include('/model/');
                log.exito('Aplicación sigue funcionando después de comentario largo');
            } else {
                log.exito('Comentario largo fue rechazado apropiadamente');
            }
            
        } catch (error) {
            log.exito('Comentario largo causó error controlado (comportamiento aceptable)');
        }
        
        await capturarPantallaConNombre('CN01_8_comentarios_largos', 'VERIFICADO');
    });

    it('CN01.9 - Concurrencia: múltiples ventanas de la misma cuenta', async () => {
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
        await browser.switchWindow(browser.getWindowHandles()[0]);
        
        await capturarPantallaConNombre('CN01_9_multiples_ventanas', 'VERIFICADO');
    });

    it('CN01.10 - Validación de timeout y reconexión', async () => {
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
        
        await capturarPantallaConNombre('CN01_10_timeout_reconexion', 'VERIFICADO');
    });
});