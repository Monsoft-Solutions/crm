// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

import prettierConfig from 'eslint-config-prettier';

import react from 'eslint-plugin-react';

// @ts-expect-error eslint-plugin-react-hooks has no type-defs yet
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,

    prettierConfig,

    // typescript
    {
        // parser
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },

        rules: {
            // type definitions
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

            // unbound methods
            '@typescript-eslint/unbound-method': 'off',

            // unused vars
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    varsIgnorePattern: '^_',
                },
            ],

            // throw anything
            '@typescript-eslint/only-throw-error': 'off',

            // restrict template expressions
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowNumber: true,
                },
            ],

            // exhaustive switch
            '@typescript-eslint/switch-exhaustiveness-check': 'error',
        },
    },

    // react
    {
        plugins: {
            // @ts-expect-error eslint-plugin-react
            react,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            'react-hooks': reactHooks,
        },

        settings: {
            react: {
                version: 'detect',
            },
        },

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        rules: {
            ...react.configs.flat.recommended.rules,
            ...react.configs.flat['jsx-runtime'].rules,

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ...reactHooks.configs.recommended.rules,
            'react-hooks/exhaustive-deps': 'error',
        },
    },

    // ignores
    {
        ignores: [
            // build
            '**/node_modules/*',
            'bin',

            // prettier
            'prettier*',

            // vite
            '**/vite.config.*',

            // tailwind
            '**/postcss.config.*',
            '**/tailwind.config.*',
        ],
    },
);
