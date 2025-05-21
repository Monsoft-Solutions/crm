import fs from 'fs';

// write the file
// input: array of lines to write
export const writeFileLines = (filePath: string, lines: string[]) => {
    const fileContent = lines.join('\n');

    fs.writeFileSync(filePath, fileContent);
};
