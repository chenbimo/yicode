#!/usr/bin/env node
import fs from 'node:fs';
import got from 'got';
import inquirer from 'inquirer';
import pacote from 'pacote';
import logSymbols from 'log-symbols';

// 仓库地址配置
const registryConfig = {
    'npmmirror.com': 'https://registry.npmmirror.com',
    'npmjs.com': 'https://registry.npmjs.com'
};

async function main() {
    try {
        const promptData = {};

        console.log(logSymbols.info, '开发者：随易科技（https://yicode.tech）');
        console.log('-----------------------------------------');

        // 下载类型
        const { type } = await inquirer.prompt({
            type: 'list',
            name: 'type',
            message: '选择下载类型',
            default: 'yicode',
            choices: [
                {
                    name: '官方资源',
                    value: 'yicode'
                },
                {
                    name: '其他资源',
                    value: 'other'
                }
            ]
        });
        promptData.type = type;

        // 从哪里下载
        const { registry } = await inquirer.prompt({
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

        if (promptData.type === 'yicode') {
            // 下载什么内容
            const { template } = await inquirer.prompt({
                type: 'list',
                name: 'template',
                message: '选择要下载的包',
                default: '@yicode/yibase',
                choices: [
                    {
                        name: 'yiapi 接口开发模板',
                        value: '@yicode/yiapi-template'
                    },
                    {
                        name: 'yibase 基础项目开发模板',
                        value: '@yicode/yibase-template'
                    },
                    {
                        name: 'yiadmin 后台项目开发模板',
                        value: '@yicode/yiadmin-template'
                    },
                    {
                        name: 'yiuni 小程序项目开发模板',
                        value: '@yicode/yiuni-template'
                    },
                    {
                        name: 'yidocs 易文档基础模板',
                        value: '@yicode/yidocs-template'
                    }
                ]
            });

            promptData.template = template;
        }

        if (promptData.type === 'other') {
            // 下载什么内容
            const { template } = await inquirer.prompt({
                type: 'input',
                name: 'template',
                message: '请输入要下载的包名称',
                validate: function (value = '') {
                    const done = this.async();
                    if (!value.trim()) {
                        done('包名称不能为空');
                        return;
                    } else {
                        done(null, true);
                    }
                }
            });

            promptData.template = template;
        }

        // 下载什么版本
        const { version } = await inquirer.prompt({
            type: 'input',
            name: 'version',
            message: '输入要下载的版本（默认下载最新版本）',
            default: 'latest'
        });

        promptData.version = version;

        try {
            const metaData = await got.get(`${registryConfig[promptData.registry]}/${promptData.template}/${promptData.version}`).json();
            const downMeta = await pacote.extract(metaData.dist.tarball, './npm-package', {});
            console.log(logSymbols.success, '资源已下载到默认的 npm-package 目录，请移动到正确的目录!');
        } catch (error) {
            console.log(logSymbols.error, '资源错误或不存在，请检查包名或版本是否正确!');
        }
    } catch (err) {
        console.log('🚀 ~ file: dlnpm.js:66 ~ main ~ err:', err);
    }
}

main();
