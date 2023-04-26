/**
 * 生成index.js文件
 * 导出所有lib中的模块
 */
import { readdirSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
let files = readdirSync('./lib');
let fileData = [];
let libNames = [];
files.forEach((file) => {
    let fileName = basename(file, '.js');
    libNames.push(`${fileName}`);
    fileData.push(`export { ${fileName} } from './lib/${file}';\r\n`);
});
writeFileSync('./index.js', fileData.join(''));
writeFileSync('./yidashLibNames.js', `export const yidashLibNames = ${JSON.stringify(libNames)}`);
console.log('数据生成完毕');
