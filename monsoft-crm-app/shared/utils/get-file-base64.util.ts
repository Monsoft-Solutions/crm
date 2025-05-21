/**
 * Get the base64 content string from a File object using FileReader.
 * @param file The File to get the base64 content from.
 * @returns A promise that resolves to the base64 content string.
 */
export async function getFileBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                const { result } = reader;

                const base64 = result.split(',')[1];

                resolve(base64);
            } else {
                reject(new Error('FileReader result is not a string.'));
            }
        };

        reader.onerror = (error) => {
            reject(new Error('Error reading file', { cause: error }));
        };
    });
}
