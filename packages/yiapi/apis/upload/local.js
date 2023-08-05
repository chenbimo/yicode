// 内部模块
import { format } from 'date-fns';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
// 外部模块
import { ensureDirSync, ensureFileSync } from 'fs-extra';
// 工具函数
import { fnApiInfo, fnUUID } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
let apiInfo = await fnApiInfo(import.meta.url);
// 传参验证
export let apiSchema = {
    summary: `文件上传到本地`,
    tags: [apiInfo.parentDirName],
    body: {
        title: '文件上传到本地接口',
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
    }
};
// 处理函数
export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let data = req.body.file;

                let extname = data.mimetype.split('/')[1];

                let buffer = await data.toBuffer();

                let year = format(new Date(), 'yyyy');
                let month = format(new Date(), 'MM');

                let dir = req.body.dir.value ? `${req.body.dir.value}/${year}-${month}` : `${year}-${month}`;
                let name = `${fnUUID()}.${extname}`;
                let path = `${dir}/${name}`;

                let localDir = resolve(sysConfig.appDir, appConfig.upload.dir || 'public', dir);
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
}
