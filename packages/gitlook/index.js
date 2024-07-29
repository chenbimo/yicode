#!/usr/bin/env node
import path from 'path';
import { select } from '@inquirer/prompts';

import { statistics } from './scripts/statistics.js';

// 提示参数收集
const promptParams = {
    // 执行命令
    executeCommand: 'statistics'
};

async function gitlookPrompt() {
    promptParams.executeCommand = await select({
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
    });

    if (promptParams.executeCommand === 'statistics') {
        await statistics(promptParams);
    }
}

gitlookPrompt();
