// 内部模块
import fs from 'node:fs';
import path from 'node:path';
// 外部模块
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import micromatch from 'micromatch';
import {
    //
    startsWith as _startsWith,
    uniq as _uniq,
    concat as _concat,
    find as _find,
    omit as _omit
} from 'lodash-es';
// 配置文件
import { appConfig } from '../config/appConfig.js';
import { codeConfig } from '../config/codeConfig.js';
import { cacheData } from '../config/cacheData.js';
import { sysConfig } from '../config/sysConfig.js';
import { fnRouterPath, fnApiParamsCheck, fnClearLogData } from '../utils/index.js';
// 插件定义
async function plugin(fastify, opts) {
    await fastify.register(fastifyJwt, {
        secret: appConfig.jwt.secret,
        decoratorName: 'session',
        decode: {
            complete: true
        },
        sign: {
            algorithm: 'HS256',
            expiresIn: appConfig.jwt.expiresIn
        },
        verify: {
            algorithms: ['HS256']
        }
    });

    fastify.addHook('preHandler', async (req, res) => {
        try {
            let pureUrl = fnRouterPath(req.url);
            // 如果是收藏图标，则直接通过
            if (pureUrl === 'favicon.ico') return;

            /* --------------------------------- 接口禁用检测 --------------------------------- */
            let isMatchBlackApi = micromatch.isMatch(pureUrl, appConfig.blackApis);
            if (isMatchBlackApi === true) {
                res.send(codeConfig.API_DISABLED);
                return;
            }

            /* --------------------------------- 自由接口判断 --------------------------------- */
            let isMatchFreeApi = micromatch.isMatch(pureUrl, appConfig.freeApis);
            // 如果是自由通行的接口，则直接返回
            if (isMatchFreeApi === true) return;

            /* --------------------------------- 请求资源判断 --------------------------------- */
            if (pureUrl.indexOf('.') !== -1) {
                if (fs.existsSync(path.join(sysConfig.appDir, 'public', pureUrl)) === true) {
                    return;
                } else {
                    // 文件不存在
                    res.send(codeConfig.NO_FILE);
                    return;
                }
            }

            /* --------------------------------- 接口存在性判断 -------------------------------- */
            let allApiNames = await fastify.redisGet(cacheData.apiNames);

            if (allApiNames.includes(pureUrl) === false) {
                res.send(codeConfig.NO_API);
                return;
            }

            /* --------------------------------- 接口登录检测 --------------------------------- */
            try {
                await req.jwtVerify();
            } catch (err) {
                res.send({
                    ...codeConfig.NOT_LOGIN,
                    detail: 'token 验证失败'
                });
                return;
            }

            /* ---------------------------------- 日志记录 ---------------------------------- */
            /**
             * 如果请求的接口不是文档地址
             * 才进行日志记录
             * 减少无意义的日志
             */
            fastify.log.warn(
                fnClearLogData({
                    apiPath: req?.url,
                    body: _omit(req?.body || {}, appConfig.reqParamsFilter),
                    session: req?.session,
                    reqId: req?.id
                })
            );

            /* --------------------------------- 上传参数检测 --------------------------------- */
            if (appConfig.paramsCheck !== false) {
                await fnApiParamsCheck(req);
            }

            /* ---------------------------------- 白名单判断 --------------------------------- */
            // 从缓存获取白名单接口
            let dataApiWhiteLists = await fastify.redisGet(cacheData.apiWhiteLists);
            let whiteApis = dataApiWhiteLists?.map((item) => item.value);
            let allWhiteApis = _uniq(_concat(appConfig.whiteApis, whiteApis || []));

            // 是否匹配白名单
            let isMatchWhiteApi = micromatch.isMatch(pureUrl, allWhiteApis);

            if (isMatchBlackApi === true) return;

            /* ---------------------------------- 角色接口权限判断 --------------------------------- */
            // 如果接口不在白名单中，则判断用户是否有接口访问权限
            let userApis = await fastify.getUserApis(req.session);
            let hasApi = _find(userApis, { value: pureUrl.replace('/api/', '/') });

            if (!hasApi) {
                res.send({
                    ...codeConfig.FAIL,
                    msg: `您没有 [ ${req?.routeSchema?.summary || pureUrl} ] 接口的操作权限`
                });
                return;
            }
        } catch (err) {
            fastify.log.error(err);
            res.send({
                ...codeConfig.FAIL,
                msg: err.msg || '认证异常',
                other: err.other || ''
            });
            return res;
        }
    });
}
export default fp(plugin, { name: 'auth', dependencies: ['cors', 'mysql', 'tool'] });
