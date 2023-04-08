import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cwd } from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const systemConfig = {
    appDir: cwd(),
    yiapiDir: __dirname
};

export { systemConfig };
