import fs from 'fs';

// read the file
// return: array of lines
export const readFileLines = (filePath: string) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const fileLines = fileContent.split('\n');

    return fileLines;
};
