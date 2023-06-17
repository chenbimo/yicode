import { getPackages, getPackagesSync } from '@manypkg/get-packages';
const { tool, packages, rootPackage, rootDir } = getPackagesSync(process.cwd());
console.log('🚀 ~ file: monolage.js:3 ~ rootDir:', rootDir);
console.log('🚀 ~ file: monolage.js:3 ~ rootPackage:', rootPackage);
console.log('🚀 ~ file: monolage.js:3 ~ tool:', tool);
console.log('🚀 ~ file: monolage.js:3 ~ packages:', packages);
