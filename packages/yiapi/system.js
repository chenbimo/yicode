import { dirname } from 'node:path';
import { cwd } from 'node:process';

export const system = {
    appDir: cwd(),
    yiapiDir: dirname(import.meta.filename)
};
