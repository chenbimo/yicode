import * as yiapi from '@yicode/yiapi';

const apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);

export const apiSchema = {};

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: '获取手机网页支付参数',
            tags: [apiInfo.parentDirName],
            description: `${apiInfo.apiPath}`
        },

        handler: async function (req, res) {}
    });
}
