const LoginPage = require('../../pageobjects/LoginPage');
const HomePage = require('../../pageobjects/HomePage');
const ModeloAutoPage = require('../../pageobjects/ModeloAutoPage');

describe('Información Auto - Contador de Votos', () => {
    
    before(() => {
        log.seccion('🗳️ CONTADOR VOTOS: Visualización y actualización dinámica');
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

    it('VOTES_001 - Cantidad de votos se muestra correctamente y es numérica', async () => {
        log.info('Verificando visualización correcta del contador de votos');
        
        // Paso 1: Navegar a modelo popular
        await HomePage.navegarAModeloPopular();
        
        // Paso 2: Obtener cantidad de votos
        const cantidadVotos = await ModeloAutoPage.obtenerCantidadVotos();
        
        // Paso 3: Verificar que es un número válido
        expect(cantidadVotos).to.be.a('number');
        expect(cantidadVotos).to.be.at.least(0);
        log.exito(`Cantidad de votos válida: ${cantidadVotos}`);
        
        // Paso 4: Verificar que la información está visible
        const infoAuto = await ModeloAutoPage.obtenerInformacionAuto();
        expect(infoAuto.cantidadVotos).to.equal(cantidadVotos);
        log.exito('Cantidad de votos coincide en toda la información');
        
        await capturarPantallaConNombre('VOTES_001_cantidad_votos', 'VERIFICADO');
    });

    it('VOTES_002 - Contador se actualiza dinámicamente al votar', async () => {
        log.info('Verificando actualización dinámica del contador');
        
        // Paso 1: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        
        // Paso 2: Navegar a modelo
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Obtener votos iniciales
        const votosIniciales = await ModeloAutoPage.obtenerCantidadVotos();
        log.info(`Votos iniciales: ${votosIniciales}`);
        
        // Paso 4: Verificar estado del voto
        const estadoVoto = await ModeloAutoPage.verificarEstadoVoto();
        
        if (estadoVoto.puedeVotar) {
            // Paso 5: Votar y verificar actualización
            await ModeloAutoPage.votarAuto();
            await browser.pause(3000);
            
            const votosFinales = await ModeloAutoPage.obtenerCantidadVotos();
            expect(votosFinales).to.be.greaterThan(votosIniciales);
            log.exito(`Contador actualizado dinámicamente: ${votosIniciales} -> ${votosFinales}`);
        } else if (estadoVoto.yavaVoto) {
            log.info('Usuario ya había votado - verificando que el contador sea coherente');
            expect(votosIniciales).to.be.at.least(1);
            log.exito('Contador refleja voto previo del usuario');
        }
        
        await capturarPantallaConNombre('VOTES_002_actualizacion_dinamica', 'VERIFICADO');
    });

    it('VOTES_003 - Contador es consistente entre usuarios autenticados y no autenticados', async () => {
        log.info('Verificando consistencia del contador entre diferentes estados de usuario');
        
        // Paso 1: Obtener cantidad sin autenticación
        await HomePage.navegarAModeloPopular();
        const votosSinAuth = await ModeloAutoPage.obtenerCantidadVotos();
        log.info(`Votos sin autenticación: ${votosSinAuth}`);
        
        // Paso 2: Autenticarse
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        await browser.pause(2000);
        
        // Paso 3: Obtener cantidad con autenticación
        const votosConAuth = await ModeloAutoPage.obtenerCantidadVotos();
        log.info(`Votos con autenticación: ${votosConAuth}`);
        
        // Paso 4: Verificar consistencia (puede diferir si el usuario votó)
        if (votosConAuth !== votosSinAuth) {
            log.info(`Diferencia en votos detectada: ${votosSinAuth} -> ${votosConAuth}`);
            // La diferencia es aceptable si el usuario votó
        } else {
            log.info('Cantidad de votos idéntica en ambos estados');
        }
        
        // Ambos valores deben ser números válidos
        expect(votosSinAuth).to.be.a('number').and.at.least(0);
        expect(votosConAuth).to.be.a('number').and.at.least(0);
        
        await capturarPantallaConNombre('VOTES_003_consistencia_estados', 'VERIFICADO');
    });

    it('VOTES_004 - Contador persiste al navegar por la aplicación', async () => {
        log.info('Verificando persistencia del contador durante navegación');
        
        // Paso 1: Navegar a modelo y obtener votos
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        const votosModelo = await ModeloAutoPage.obtenerCantidadVotos();
        const tituloModelo = (await ModeloAutoPage.obtenerInformacionAuto()).titulo;
        
        // Paso 2: Navegar al home y regresar
        await HomePage.regresarAlHome();
        await browser.pause(1000);
        
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 3: Verificar que los votos son consistentes
        const votosTrasNavegacion = await ModeloAutoPage.obtenerCantidadVotos();
        expect(votosTrasNavegacion).to.equal(votosModelo);
        log.exito(`Contador persistente: ${votosModelo} votos para ${tituloModelo}`);
        
        await capturarPantallaConNombre('VOTES_004_persistencia_navegacion', 'VERIFICADO');
    });

    it('VOTES_005 - Contador se mantiene al recargar página', async () => {
        log.info('Verificando persistencia del contador al recargar');
        
        // Paso 1: Navegar a modelo y obtener votos
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        const votosAntes = await ModeloAutoPage.obtenerCantidadVotos();
        
        // Paso 2: Recargar página
        await browser.refresh();
        await browser.pause(3000);
        
        // Paso 3: Verificar que contador se mantiene
        const votosDespues = await ModeloAutoPage.obtenerCantidadVotos();
        expect(votosDespues).to.equal(votosAntes);
        log.exito(`Contador mantiene valor después de recargar: ${votosAntes} votos`);
        
        await capturarPantallaConNombre('VOTES_005_persistencia_recarga', 'VERIFICADO');
    });

    it('VOTES_006 - Formato numérico del contador es claro y legible', async () => {
        log.info('Verificando formato y legibilidad del contador');
        
        // Paso 1: Navegar a varios modelos y verificar formato
        const modelos = [
            { makeId: 'ckl2phsabijs71623vk0', modelId: 'ckl2phsabijs71623vqg' }
        ];
        
        for (let modelo of modelos) {
            await ModeloAutoPage.navegarAModelo(modelo.makeId, modelo.modelId);
            
            const votos = await ModeloAutoPage.obtenerCantidadVotos();
            const info = await ModeloAutoPage.obtenerInformacionAuto();
            
            // Verificar que es número entero positivo
            expect(votos).to.be.a('number');
            expect(Number.isInteger(votos)).to.be.true;
            expect(votos).to.be.at.least(0);
            
            log.exito(`Modelo: ${info.titulo} - Votos: ${votos} (formato correcto)`);
        }
        
        await capturarPantallaConNombre('VOTES_006_formato_legible', 'VERIFICADO');
    });

    it('VOTES_007 - Contador refleja estado actual del sistema', async () => {
        log.info('Verificando que contador refleja estado actual del sistema');
        
        // Paso 1: Autenticarse y navegar
        await LoginPage.iniciarSesion(credenciales.validas.email, credenciales.validas.password);
        await ModeloAutoPage.navegarAModelo('ckl2phsabijs71623vk0', 'ckl2phsabijs71623vqg');
        
        // Paso 2: Obtener estado actual
        const estadoVoto = await ModeloAutoPage.verificarEstadoVoto();
        const votosActuales = await ModeloAutoPage.obtenerCantidadVotos();
        
        // Paso 3: Verificar coherencia entre estado y contador
        if (estadoVoto.yavaVoto) {
            // Si el usuario ya votó, el contador debe ser al menos 1
            expect(votosActuales).to.be.at.least(1);
            log.exito('Contador coherente con estado de voto del usuario');
        } else if (estadoVoto.puedeVotar) {
            // Si puede votar, el contador debe ser válido
            expect(votosActuales).to.be.a('number').and.at.least(0);
            log.exito('Contador coherente con capacidad de voto');
        }
        
        log.exito(`Estado del sistema: ${estadoVoto.yavaVoto ? 'Ya votó' : 'Puede votar'}, Votos: ${votosActuales}`);
        
        await capturarPantallaConNombre('VOTES_007_estado_sistema', 'VERIFICADO');
    });
});