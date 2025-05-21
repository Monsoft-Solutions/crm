import { exit } from 'process';
import { exec } from 'child_process';

import { appScheme, appHost, appInnerPort } from '@dist/constants';

import { connectionEnv } from '@env/constants/connection-env.constant';

const { MSS_FQDN } = connectionEnv;

function connect() {
    if (appHost === 'localhost' && appScheme === 'http') {
        console.log('using direct connection to localhost');
        return;
    }

    if (appHost.includes('ngrok') && appScheme === 'https') {
        console.log('using ngrok tunnel');

        exec(
            `ngrok http ${appInnerPort.toString()} --domain=${appHost}`,
            (err) => {
                if (err)
                    console.error(
                        `Error running ngrok: ${JSON.stringify(err)}`,
                    );
            },
        );

        return;
    }

    console.error(
        `Failed to establish dev server connection !\nFQDN (${MSS_FQDN}) does not conform to any of the allowed options:\n * http://localhost:<port> -> direct localhost connection\n * https://<ngrok-subdomain>:<port> ngrok tunnel through a subdomain you have access to\n`,
    );

    exit(1);
}

connect();
