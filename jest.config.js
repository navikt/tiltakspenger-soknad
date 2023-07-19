const tsConfig = require('./tsconfig.json');
const { pathsToModuleNameMapper } = require('ts-jest');

const compilerOptions = tsConfig.compilerOptions;

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    },
};
