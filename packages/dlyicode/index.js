#!/usr/bin/env node
import fs from 'node:fs';
import got from 'got';
import inquirer from 'inquirer';
import pacote from 'pacote';
import logSymbols from 'log-symbols';

// 仓库地址配置
let registryConfig = {
    'npmmirror.com': 'https://registry.npmmirror.com',
    'npmjs.com': 'https://registry.npmjs.com'
};

async function main() {
    try {
        let promptData = {};

        console.log(logSymbols.info, '开发者：随易科技（https://yicode.tech）');
        console.log('-----------------------------------------');

        // 判断是否为空目录
        let dirData = fs.readdirSync('.');
        if (dirData.length > 0) {
            console.log(logSymbols.error('当前目录不为空，无法下载'));
            return;
        }

        // 从哪里下载
        let { registry } = await inquirer.prompt({
            type: 'list',
            name: 'registry',
            message: '选择从哪里下载',
            default: 'npmmirror.com',
            choices: [
                {
                    name: '淘宝仓库 - npmmirror.com',
                    value: 'npmmirror.com'
                },
                {
                    name: '官方仓库 - npmjs.com',
                    value: 'npmjs.com'
                }
            ]
        });

        promptData.registry = registry;

        // 下载什么内容
        let { template } = await inquirer.prompt({
            type: 'list',
            name: 'template',
            message: '选择要下载的包',
            default: '@yicode-template/base-vue3',
            choices: [
                {
                    name: 'yite + vue3 基础项目开发模板',
                    value: '@yicode-template/base-vue3'
                },
                {
                    name: 'yite + vue3 后台项目开发模板',
                    value: '@yicode-template/admin-vue3'
                },
                {
                    name: 'uniapp + vue3 基础项目开发模板',
                    value: '@yicode-template/uni-vue3'
                },
                {
                    name: 'yidocs 易文档基础模板',
                    value: '@yicode-template/yidocs'
                }
            ]
        });

        promptData.template = template;

        // 下载什么版本
        let { version } = await inquirer.prompt({
            type: 'input',
            name: 'version',
            message: '输入要下载的版本（默认下载最新版本）',
            default: 'latest'
        });

        promptData.version = version;

        try {
            const metaData = await got.get(`${registryConfig[promptData.registry]}/${promptData.template}/${promptData.version}`).json();
            let downMeta = await pacote.extract(metaData.dist.tarball, '.', {});
            console.log(logSymbols.success, '资源已下载成功!');
        } catch (error) {
            console.log(logSymbols.error, '资源错误或不存在，请检查包名或版本是否正确!');
        }
    } catch (err) {
        process.exit();
        console.log('🚀 ~ file: dlnpm.js:66 ~ main ~ err:', err);
    }
}

main();
