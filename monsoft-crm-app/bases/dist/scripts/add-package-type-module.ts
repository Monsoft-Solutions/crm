// script used to add the `"type": "module"` line to the package.json file

import { readFileLines } from '@dist/providers/read-file-lines';

import { writeFileLines } from '@dist/providers/write-file-lines';

import { typeModuleLine } from '@dist/constants/type-module-line';

const packageJsonPath = 'package.json';

// get the package.json lines
const packageJsonLines = readFileLines(packageJsonPath);

const [openBracket, ...restPackageJsonLines] = packageJsonLines;

// add the `"type": "module"` line to the package.json file
// just after the open bracket
const packageWithTypeModuleLines = openBracket
    ? [openBracket, typeModuleLine, ...restPackageJsonLines]
    : [];

// update the package.json file, adding the `"type": "module"` line
writeFileLines(packageJsonPath, packageWithTypeModuleLines);
