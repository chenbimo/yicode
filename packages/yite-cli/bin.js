#!/usr/bin/env node
import path from 'node:path';
import * as colors from 'colorette';
import fs from 'fs-extra';
import logSymbols from 'log-symbols';
import { minimist } from './libs/minimist.js';
// yicode相关
import { appDir, cliDir, srcDir } from './config.js';
import { fnFileProtocolPath, fnGetEnvNames, sysConfig } from './utils.js';

// 命令行参数2
const options = minimist(process.argv.slice(2));
const docSite = `${colors.green('[ 使用文档请访问网址 ]')} ${colors.white('https://yicode.tech')}`;

if (['dev', 'build', 'update'].includes(options['command']) === false) {
    console.log(`${colors.red('[ 命令错误 ]')} 只能为 dev 或 build，如：--command=dev`);
    console.log(docSite);
    process.exit();
}

if (['dev', 'build'].includes(options['command']) === true) {
    if (options['envfile']) {
        const envFiles = fnGetEnvNames();
        if (envFiles.includes(options['envfile']) === false) {
            console.log(`${colors.red('[ 环境名错误 ]')} 只能为 ${envFiles.join(',')} 之一，如：--envfile=development`);
            console.log(docSite);
            process.exit();
        }
    } else {
        options['envfile'] = 'development';
    }
}

if (['update'].includes(options['command']) === true) {
    const projectTypes = ['yiadmin'];
    if (['yiadmin'].includes(options['project-type']) === false) {
        console.log(`${colors.red('[ 项目类型错误 ]')} 只能为 ${projectTypes.join(',')} 之一，如：--project-type=yiadmin`);
        console.log(docSite);
        process.exit();
    }
}

if (options['command'] === 'dev') {
    const execFile = fnFileProtocolPath(path.resolve(cliDir, 'scripts', 'dev.js'));
    const { mainDev } = await import(execFile);

    mainDev(options);
}

if (options['command'] === 'build') {
    const execFile = fnFileProtocolPath(path.resolve(cliDir, 'scripts', 'build.js'));
    const { mainBuild } = await import(execFile);
    mainBuild(options);
}

if (options['command'] === 'update') {
    const execFile = fnFileProtocolPath(path.resolve(cliDir, 'scripts', 'update.js'));
    const { mainUpdate } = await import(execFile);
    mainUpdate(options);
}
