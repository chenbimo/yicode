#!/usr/bin/env node
import * as commander from '@yicode/commander';
import * as colors from 'yoctocolors';
import path from 'path';
import fs from 'fs-extra';
// yicode相关
import { appDir, cliDir, srcDir } from './config.js';
import { fnFileProtocolPath, fnGetEnvNames } from './utils.js';

const pkg = fs.readJSONSync('./package.json');

// 主程序
const program = new commander.Command();

program //
    .command('dev')
    .summary('运行开发环境')
    .requiredOption(
        '-e,--env-file <环境变量文件名>',
        '指定环境变量',
        function (value, options) {
            let envFiles = fnGetEnvNames();
            if (envFiles.includes(value) === false) {
                throw new commander.InvalidArgumentError(`环境变量值为 ${envFiles} 其中之一`);
            } else {
                return value;
            }
        },
        'development'
    )
    .action(async (options) => {
        let execFile = fnFileProtocolPath(path.resolve(cliDir, 'scripts', 'dev.js'));
        let { main } = await import(execFile);
        main(options);
    });

program //
    .command('build')
    .summary('项目编译打包')
    .requiredOption(
        '-e,--env-file <环境变量文件名>',
        '指定环境变量',
        function (value, options) {
            let envFiles = fnGetEnvNames();
            if (envFiles.includes(value) === false) {
                throw new commander.InvalidArgumentError(`环境变量值为 ${envFiles} 其中之一`);
            } else {
                return value;
            }
        },
        'production'
    )
    .action(async (options) => {
        let execFile = fnFileProtocolPath(path.resolve(cliDir, 'scripts', 'build.js'));
        let { main } = await import(execFile);
        main(options);
    });

program //
    .name(colors.red('yivite'))
    .usage(colors.red('[命令]'))
    .version(`${pkg.version}`, '-v --version', '显示版本');

program.addHelpText(
    'beforeAll',
    `

${colors.green('包名')}：${colors.magenta('@yicode/yite-cli')}
${colors.green('官网')}：${colors.blue('https://yicode.tech')}
${colors.green('作者')}：${colors.blue('https://chensuiyi.com')}
${colors.green('开源')}：${colors.blue('https://gitee.com/yicode-team')}
${colors.green('简介')}：${colors.white('yivite-cli为 yicode 生态下专注于vite + vue3的项目开发脚手架')}
`
);
program.addHelpText(
    'after',
    `
`
);

program.parse();
