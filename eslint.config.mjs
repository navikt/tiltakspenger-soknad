import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintReact from "@eslint-react/eslint-plugin";
import css from "@eslint/css";
import globals from "globals";

export default tseslint.config(
    {
        ignores: [
            ".next/",
            "out/",
            "node_modules/",
            "next.config.js",
            ".prettierrc.js",
            "eslint.config.mjs",
        ],
    },
    {
        files: ["**/*.{js,mjs,ts,tsx}"],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        ...eslintReact.configs["recommended-typescript"],
    },
    {
        files: ['src/**/*.css'],
        plugins: {
            css,
        },
        language: 'css/css',
        rules: {
            ...css.configs.recommended.rules,
            'css/no-invalid-at-rules': 'off',
            // Aksel design tokens (CSS custom properties) er definert utenfor prosjektet,
            // skrur dermed av regelen for ukjent variabler for å unngå falske positiver.
            'css/no-invalid-properties': 'off',
        },
    },
);
