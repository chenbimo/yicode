import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { system } from '../system.js';

export const fnImportAppConfig = async (name, defaultValue = {}) => {
    try {
        const absolutePath = resolve(system.appDir, 'config', name + '.js');
        const data = await import(pathToFileURL(absolutePath));
        return data;
    } catch (err) {
        console.log('🚀 ~ fnImport ~ err:', err);
        return {
            [name]: defaultValue
        };
    }
};
