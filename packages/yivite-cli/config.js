import path from 'path';
import { fnDirname } from './utils.js';

export const appDir = process.cwd();
export const cliDir = path.join(fnDirname(import.meta.url));
export const srcDir = path.join(appDir, 'src');
export const yicodeDir = path.join(appDir, '.yicode');
export const cacheDir = path.join(appDir, '.cache');
