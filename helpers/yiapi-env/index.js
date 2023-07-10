import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import fs from 'node:fs';
import path from 'node:path';
import { merge, forOwn, startsWith, snakeCase, toUpper } from 'lodash-es';

// 设置当前模式
const mode = process.env.NODE_ENV;
// 要遍历的文件
const envFiles = [
    //
    `.env`,
    `.env.local`,
    `.env.${mode}`,
    `.env.${mode}.local`
];
// 所有自定义环境变量
let envVars = {};
envFiles.forEach((value) => {
    let filePath = path.resolve(process.cwd(), 'env', value);

    if (fs.statSync(filePath, { throwIfNoEntry: false })?.isFile() === true) {
        let data = dotenv.parse(fs.readFileSync(filePath));
        envVars = merge(envVars, data);
    }
});

// 所有有效的环境变量
let envVars2 = {};
forOwn(envVars, (value, key) => {
    if (startsWith(key, 'YIAPI_')) {
        envVars2[toUpper(snakeCase(key))] = value;
    }
});

dotenvExpand.expand({
    parsed: envVars2
});
