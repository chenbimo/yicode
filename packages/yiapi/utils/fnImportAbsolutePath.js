import { fileURLToPath, pathToFileURL } from 'node:url';

export const fnImportAbsolutePath = async (absolutePath, name, defaultValue) => {
    try {
        const data = await import(pathToFileURL(absolutePath));
        return data;
    } catch (err) {
        console.log('🚀 ~ fnImport ~ err:', err);
        return {
            [name]: defaultValue
        };
    }
};
