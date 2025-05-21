// server entry point

import path from 'path';

import { createExpressMiddleware } from '@trpc/server/adapters/express';

import { createProxyMiddleware } from 'http-proxy-middleware';

import express from 'express';
import cors from 'cors';

import { toNodeHandler } from 'better-auth/node';

import { apiPath } from '@api/constants';
import { apiContext } from '@api/providers/server';

import { apiRoot } from '@api/providers/server/api-root.provider';

import { definedEnv } from '@env/constants/defined-env.constant';

import { appInnerPort, appUrl } from '@dist/constants';

import { devWebPort } from '@dev/constants';

import { authServer } from '../auth/providers/server';

import { authPath } from '@auth/constants';

export * from '@app/hub';

const { MSS_WEB_SOURCE } = definedEnv;

// create trpc middleware
const trpcMiddleware = createExpressMiddleware({
    router: apiRoot,
    createContext: apiContext,

    responseMeta: () => ({
        status: 200,
    }),
});

// create express app
const server = express();

// enable cors
server.use(cors());

// add trpc middleware
server.use(apiPath, trpcMiddleware);

server.all(`${authPath}/*`, (req, res) => {
    void toNodeHandler(authServer)(req, res);
});

// source of web files:
// bin: already built as distribution files, to be served statically
// dev: dynamically generated and served by Vite dev server

// if web files built for distribution
if (MSS_WEB_SOURCE === 'bin') {
    // web static files directory
    const staticDir = path.resolve(__dirname, `../web`);

    // serve web static files
    server.use(express.static(staticDir));

    // Redirect all unmatched routes to index.html
    server.get('*', (req, res) => {
        res.sendFile(path.join(staticDir, 'index.html'));
    });
}
// if web files served by Vite dev server
else {
    // proxy to Vite dev server
    server.get('*', (req, res) => {
        // check whether it's a WebSocket connection or HTTP request
        // HTTP requests are used for retrieving static files, e.g. HTML, CSS, JS, etc.
        // WS connections are used for Hot Module Replacement
        const isWebSocket = req.headers.upgrade?.toLowerCase() === 'websocket';

        // choose appropriate scheme
        const scheme = isWebSocket ? 'ws' : 'http';

        // proxy request to Vite dev server
        void createProxyMiddleware({
            target: `${scheme}://localhost:${devWebPort.toString()}`,
            changeOrigin: true,
            ws: isWebSocket,
        })(req, res);
    });
}

console.log(`App available at ${appUrl}`);

// start server
server.listen(appInnerPort);
