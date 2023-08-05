import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cwd } from 'node:process';

// 系统路径
let __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(dirname(__filename));

export let sysConfig = {
    appDir: cwd(),
    yiapiDir: __dirname
    // 内置表字段定义
};
