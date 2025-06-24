const { config } = require('./wdio.config.js');

// Configuración específica para Docker
config.capabilities = [{
    maxInstances: 1,
    browserName: 'chrome',
    acceptInsecureCerts: true,
    'goog:chromeOptions': {
        args: [
            '--headless',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--window-size=1920,1080',
            '--disable-extensions',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--remote-debugging-port=9222',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
        ]
    }
}];

// Servicios para Docker
config.services = ['chromedriver'];

// Aumentar timeouts para Docker
config.waitforTimeout = 45000;
config.connectionRetryTimeout = 180000;

// Suites específicas para Docker (misma estructura reorganizada)
config.suites = {
    autenticacion: [
        './test/specs/01-autenticacion/**/*.js'
    ],
    votacion: [
        './test/specs/02-votacion/**/*.js'
    ],
    comentarios: [
        './test/specs/03-comentarios/**/*.js'
    ],
    informacion: [
        './test/specs/04-informacion-auto/**/*.js'
    ],
    seguridad: [
        './test/specs/05-seguridad/**/*.js'
    ],
    funcionalidad: [
        './test/specs/01-autenticacion/**/*.js',
        './test/specs/02-votacion/**/*.js',
        './test/specs/03-comentarios/**/*.js',
        './test/specs/04-informacion-auto/**/*.js'
    ],
    completa: [
        './test/specs/01-autenticacion/**/*.js',
        './test/specs/02-votacion/**/*.js',
        './test/specs/03-comentarios/**/*.js',
        './test/specs/04-informacion-auto/**/*.js',
        './test/specs/05-seguridad/**/*.js'
    ]
};

exports.config = config;