// 内部模块
import { resolve, extname } from 'node:path';
import { writeFileSync } from 'node:fs';
// 外部模块
import { ensureDirSync } from 'fs-extra';
import { format } from 'date-fns';
// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { fnUUID } from '../../utils/fnUUID.js';
// 配置文件
import { system } from '../../system.js';
import { appConfig } from '../../config/app.js';
import { httpConfig } from '../../config/http.js';
import { schemaHelperConfig } from '../../config/schemaHelper.js';
// 接口元数据
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
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
            required: ['file', 'dir']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const data = req.body.file;

                const extname = extname(data.filename);

                const buffer = await data.toBuffer();

                const year = format(new Date(), 'yyyy');
                const month = format(new Date(), 'MM');

                const dir = `${req.body.dir.value}/${year}-${month}`;
                const name = `${fnUUID()}${extname}`;
                const path = `${dir}/${name}`;

                const localDir = resolve(system.appDir, appConfig.upload.dir || 'public', dir);
                await ensureDirSync(localDir);
                await writeFileSync(`${localDir}/${name}`, buffer);

                return {
                    ...httpConfig.SUCCESS,
                    name: name,
                    url: path
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.FAIL;
            }
        }
    });
};
