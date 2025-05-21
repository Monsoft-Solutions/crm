// script used to remove the `"type": "module"` line from the package.json file

import { readFileLines } from '@dist/providers/read-file-lines';

import { writeFileLines } from '@dist/providers/write-file-lines';

import { typeModuleLine } from '@dist/constants/type-module-line';

const packageJsonPath = 'package.json';

// get the package.json lines
const packageJsonLines = readFileLines(packageJsonPath);

// filter out the `"type": "module"` line
const packageWithoutTypeModuleLines = packageJsonLines.filter(
    (line) => line !== typeModuleLine,
);

// update the package.json file, removing the `"type": "module"` line
writeFileLines(packageJsonPath, packageWithoutTypeModuleLines);
