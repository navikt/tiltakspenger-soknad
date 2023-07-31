const tsConfig = require('./tsconfig.json');
const { pathsToModuleNameMapper } = require('ts-jest');

const compilerOptions = tsConfig.compilerOptions;

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
        '@navikt/ds-css': '<rootDir>/styleMock.js',
        '^.+\\.(css|svg)$': '<rootDir>/styleMock.js',
        jose: 'identity-obj-proxy',
        '@unleash/nextjs': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                babelConfig: '<rootDir>/babel.test.config.js',
            },
        ],
    },
};
