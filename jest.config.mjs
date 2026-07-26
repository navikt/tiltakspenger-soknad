import nextJest from 'next/jest.js';

// next/jest setter opp SWC-transformasjon, tsconfig-aliaser (@/) og .env for oss.
const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
    clearMocks: true,
    coverageProvider: 'v8',
    // Rene funksjonstester slipper å betale for et DOM-miljø. Komponenttestene slår på jsdom
    // selv med en `@jest-environment jsdom`-docblock øverst i fila.
    testEnvironment: 'node',
    // .next/standalone inneholder en kopi av package.json som ellers kolliderer i jest-haste-map.
    modulePathIgnorePatterns: ['<rootDir>/.next/'],
};

export default createJestConfig(config);
