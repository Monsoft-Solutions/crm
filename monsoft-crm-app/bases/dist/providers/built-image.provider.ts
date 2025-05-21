import { execSync } from 'child_process';
import { exit } from 'process';

const envAssignments = Object.entries(process.env)
    .map(([key, value]) =>
        key.startsWith('MSS_') && value ? `${key}='${value}'` : undefined,
    )
    .filter((item) => item !== undefined);

const appFolder = process.env.MSS_APP_FOLDER;

if (!appFolder) {
    console.error('missing MSS_APP_FOLDER environment variable');
    exit(1);
}

// Build and tag the Docker image
export const buildImage = ({ imageName }: { imageName: string }) => {
    const buildArgs = envAssignments
        .map((item) => `--build-arg ${item}`)
        .join(' ');

    try {
        console.log('Building Docker image...');
        execSync(
            `docker build --progress=plain --squash ${buildArgs} -t ${imageName} -f ${appFolder}/bases/dist/docker/Dockerfile .`,
            {
                cwd: '../',
                stdio: 'inherit',
            },
        );
    } catch (error) {
        console.error('Error building Docker image:', error);
        process.exit(1);
    }
};
