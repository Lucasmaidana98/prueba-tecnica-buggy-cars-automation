module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        mocha: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    globals: {
        browser: 'readonly',
        expect: 'readonly',
        testData: 'readonly',
        usuarios: 'readonly',
        waitForElement: 'readonly',
        safeClick: 'readonly',
        safeSetValue: 'readonly',
        verificarElementoVisible: 'readonly',
        verificarTexto: 'readonly',
        esperarYVerificar: 'readonly',
        esperarUnPoco: 'readonly',
        navegarA: 'readonly',
        debug: 'readonly',
        capturarPantalla: 'readonly',
        capturarPantallaDebugging: 'readonly'
    },
    rules: {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
        'no-console': 'off',
        'no-debugger': 'warn',
        'no-multiple-empty-lines': ['error', { 'max': 2 }],
        'eol-last': 'error',
        'comma-dangle': ['error', 'never'],
        'space-before-function-paren': ['error', 'never'],
        'keyword-spacing': 'error',
        'space-before-blocks': 'error',
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never']
    }
};