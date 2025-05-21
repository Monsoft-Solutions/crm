import { execSync } from 'child_process';

import { appInnerPort } from '@dist/constants';

const envAssignments = Object.entries(process.env)
    .map(([key, value]) =>
        key.startsWith('MSS_') && value ? `${key}='${value}'` : undefined,
    )
    .filter((item) => item !== undefined);

// Run the Docker container
export const runImage = ({
    imageName,
    containerName,
}: {
    imageName: string;
    containerName: string;
}) => {
    const runArgs = envAssignments.map((item) => `-e ${item}`).join(' ');

    try {
        execSync(`docker rm -f ${containerName} 2>/dev/null`, {
            stdio: 'inherit',
        });

        console.log('Running Docker container...');
        execSync(
            `docker run ${runArgs} -d -p ${appInnerPort.toString()}:${appInnerPort.toString()} --name ${containerName} ${imageName} `,
            { stdio: 'inherit' },
        );
    } catch (error) {
        console.error('Error running Docker container:', error);
        process.exit(1);
    }
};
