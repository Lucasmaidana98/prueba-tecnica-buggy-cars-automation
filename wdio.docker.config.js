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

exports.config = config;