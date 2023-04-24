import os from 'os';
import path from 'path';

const dynamicImport = new Function('m', 'return import(m)');

export function slash(p) {
    return p.replace(/\\/g, '/');
}

export function normalizePath(id) {
    let key = path.posix.normalize(isWindows ? slash(id) : id);
    if (key.charCodeAt(0) === 0) {
        key = key.substring(1);
    }
    return key;
}
export const isWindows = os.platform() === 'win32';

export async function resolveEntry(name, root) {
    const { resolvePackageEntry, resolvePackageData } = await dynamicImport('vite');
    return resolvePackageEntry(name, resolvePackageData(name, root, true), true, {
        isBuild: true,
        isProduction: process.env.NODE_ENV === 'production',
        isRequire: false,
        root,
        preserveSymlinks: false,
        mainFields: [],
        conditions: []
        // extensions: []
    });
}
