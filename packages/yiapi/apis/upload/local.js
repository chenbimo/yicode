import { format } from 'date-fns';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
import { ensureDirSync, ensureFileSync } from 'fs-extra';

import { fnApiInfo, fnUUID } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
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

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let data = req.body.file;

                let extname = data.mimetype.split('/')[1];

                let buffer = await data.toBuffer();

                let year = format(new Date(), 'YYYY');
                let month = format(new Date(), 'MM');

                let dir = req.body.dir.value ? `static/${req.body.dir.value}/${year}-${month}` : `static/${year}-${month}`;
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
