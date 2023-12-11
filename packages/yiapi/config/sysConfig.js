import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cwd } from 'node:process';

// 系统路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

export const sysConfig = {
    appDir: cwd(),
    yiapiDir: __dirname
};
