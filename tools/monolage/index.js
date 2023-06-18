import { resolve } from 'node:path';
import { getPackagesSync } from '@manypkg/get-packages';
import * as colors from 'colorette';
import fs from 'fs-extra';
import prettier from 'prettier';
import {
    //
    omit as _omit,
    forOwn as _forOwn,
    find as _find,
    merge as _merge,
    isPlainObject as _isPlainObject
} from 'lodash-es';

// prettier配置
const prettierConfig = {
    trailingComma: 'none',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    printWidth: 1024,
    bracketSpacing: true,
    useTabs: false,
    arrowParens: 'always',
    parser: 'json'
};

// 全局排除字段
const globalExcludes = [
    //
    'name',
    'version',
    'description',
    'keywords',
    'files',
    'scripts',
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'peerDependenciesMeta',
    'bundleDependencies',
    'optionalDependencies',
    'packages'
];

// 局部排除字段
const scopeExcludes = [
    //
    'version',
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'peerDependenciesMeta',
    'bundleDependencies',
    'optionalDependencies'
];

// 获取配置数据
async function getMonolageConfig(_path) {
    try {
        if (_path.startsWith('file:') !== true) {
            _path = 'file:///' + _path.replace(/\\+/gi, '/');
        }
        let { monolageConfig } = await import(_path);
        return monolageConfig;
    } catch (err) {
        return {};
    }
}

let monolageConfig = await getMonolageConfig(resolve(process.cwd(), 'monolage.config.js'));

if (_isPlainObject(monolageConfig) === false) {
    console.log(`${colors.red('[ 类型错误 ]')} monolage.config.js 配置文件必须返回一个对象类型`);
    process.exit();
}
if (monolageConfig.packages === undefined) {
    monolageConfig.packages = {};
}
if (_isPlainObject(monolageConfig.packages) === false) {
    console.log(`${colors.red('[ 类型错误 ]')} monolage.config.js 文件的 packages 字段必须为对象类型`);
    process.exit();
}

// 全局字段
let globalFields = _omit(monolageConfig, globalExcludes);

// 获取 monorepo 包信息
const { tool, packages, rootPackage, rootDir } = getPackagesSync(process.cwd());

packages.forEach((project) => {
    if (!project?.packageJson?.name) {
        console.log(`${colors.red('[ 配置错误 ]')}  ${colors.blue(project?.dir)} 必须设置 name 字段`);
        return;
    }
    let scopeFields = _omit(monolageConfig.packages[project?.packageJson?.name] || {}, scopeExcludes);
    let resultFields = _merge(project.packageJson, _merge(globalFields, scopeFields));
    fs.writeJsonSync(resolve(project.dir, 'package.json'), prettier.format(JSON.stringify(resultFields), prettierConfig));
    console.log(`${colors.green('[ 对齐成功 ]')}  ${colors.blue(project?.packageJson?.name)} 已处理完毕`);
});
