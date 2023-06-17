import { join as path_join, dirname as path_dirname } from 'path';
import { fileURLToPath } from 'url';
// yicode命令路径
export const cliDir = path_dirname(fileURLToPath(import.meta.url));

// 项目根目录路径
export const rootDir = process.cwd();

// 临时文件路径
export const tempDir = path_join(rootDir, '.temp');

// yicode文件路径
export const yicodeDir = path_join(rootDir, '.yicode');
