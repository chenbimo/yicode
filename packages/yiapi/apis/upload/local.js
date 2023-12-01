// 内部模块
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
// 外部模块
import { ensureDirSync, ensureFileSync } from 'fs-extra';
import { format } from 'date-fns';
// 工具函数
import { fnRoute, fnUUID } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '文件上传到本地';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                file: {
                    type: 'object',
                    title: '文件',
                    properties: {
                        type: {
                            title: '文件内容',
                            type: 'string',
                            enum: ['file']
                        }
                    }
                },
                dir: {
                    type: 'object',
                    title: '目录',
                    properties: {
                        value: {
                            title: '目录名称',
                            type: 'string',
                            pattern: '^[a-z][a-z0-9_-]*$'
                        }
                    }
                }
            },
            required: ['file']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const data = req.body.file;

                const extname = data.mimetype.split('/')[1];

                const buffer = await data.toBuffer();

                const year = format(new Date(), 'yyyy');
                const month = format(new Date(), 'MM');

                const dir = req.body.dir.value ? `${req.body.dir.value}/${year}-${month}` : `${year}-${month}`;
                const name = `${fnUUID()}.${extname}`;
                const path = `${dir}/${name}`;

                const localDir = resolve(sysConfig.appDir, appConfig.upload.dir || 'public', dir);
                await ensureDirSync(localDir);
                await writeFileSync(`${localDir}/${name}`, buffer);

                return {
                    ...codeConfig.SUCCESS,
                    name: name,
                    url: path
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.FAIL;
            }
        }
    });
};
