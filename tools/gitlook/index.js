#!/usr/bin/env node
import path from 'path';
import { merge as _merge } from 'lodash-es';
import inquirer from 'inquirer';
import ora from 'ora';
import { fileURLToPath } from 'url';

import { statistics } from './scripts/statistics.js';

// 提示参数收集
let promptParams = {
    // 执行命令
    executeCommand: 'statistics'
};

async function gitlookPrompt() {
    const _executeCommand = await inquirer.prompt([
        {
            type: 'list',
            name: 'executeCommand',
            message: '请选择一个命令',
            loop: false,
            default: promptParams.executeCommand,
            choices: [
                {
                    name: '数据统计',
                    value: 'statistics',
                    describe: '数据提交统计'
                }
            ]
        }
    ]);

    _merge(promptParams, _executeCommand);

    if (promptParams.executeCommand === 'statistics') {
        await statistics(promptParams);
    }
}

gitlookPrompt();
