import { defineConfig } from 'vite';

import fs from 'fs';

import reactPlugin from '@vitejs/plugin-react';
import tsrPlugin from '@tanstack/router-plugin/vite';
import tailwindcssPlugin from '@tailwindcss/vite';

// import { sentryVitePlugin } from '@sentry/vite-plugin';

import path from 'path';

import { devWebPort } from '../dev/constants';
import { z } from 'zod';

const tsConfigFile = '../../tsconfig.json';

const tsConfigContent = fs.readFileSync(tsConfigFile, 'utf-8');

// read tsconfig.json
const tsconfig = JSON.parse(tsConfigContent);

// regex to match alias assigments
const aliasRegex = /^@[a-zA-Z]+\/\*$/;

// get alias dir names from alias assigments
const tsPaths = Object.entries(tsconfig.compilerOptions.paths)
    .filter(([key]) => aliasRegex.test(key))
    .map(([key, value]) => {
        const parsedValue = z
            .string()
            .array()
            .safeParse(value)
            .data?.at(0)
            ?.slice(0, -1);

        return parsedValue
            ? ([key.replace(/[@/.\*]/g, ''), parsedValue] as const)
            : undefined;
    })
    .filter((item) => item !== undefined);

// create vite.resolve.alias object
const alias = Object.fromEntries(
    tsPaths.map(([key, value]) => [
        `@${key}`,
        path.resolve(__dirname, `../../${value}`),
    ]),
);

// react plugin options
const reactOptions = reactPlugin({
    jsxImportSource: 'react',
});

// tanstack router plugin options
const tsrOptions = tsrPlugin({
    routesDirectory: '../../routes',
    generatedRouteTree: './routeTree.gen.ts',
    addExtensions: true,
});

// tailwindcss plugin options
const tailwindcssOptions = tailwindcssPlugin();

// sentry plugin options
// const sentryPlugin = sentryVitePlugin({
//     org: 'monsoft-solutions',
//     project: 'monsoft-crm-app',
// });

export default defineConfig({
    plugins: [
        reactOptions,
        tsrOptions,
        tailwindcssOptions,
        // sentryPlugin
    ],

    resolve: {
        alias,
    },

    // specify the public directory to serve static assets
    publicDir: '../../theme/public',

    build: {
        chunkSizeWarningLimit: 5000,
    },

    envPrefix: 'MSS_CLIENT_',

    server: {
        port: devWebPort,

        // allow serving files from node modules
        fs: {
            allow: ['.', '../../node_modules', '../../../node_modules'],
        },
    },
});
