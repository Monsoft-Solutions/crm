import { buildImage } from '@dist/providers/built-image.provider';
import { runImage } from '@dist/providers/run-image.script';

const imageName = 'playground-image';
const containerName = 'playground-container';

function main() {
    buildImage({ imageName: imageName });

    runImage({ imageName: imageName, containerName: containerName });
}

main();
