import fs from 'node:fs';
import path from 'node:path';
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

import { appConfig } from '../config/appConfig.js';
import { fnRouterPath, fnApiParamsCheck, fnClearLogData } from '../utils/index.js';

async function plugin(fastify, opts) {
    await fastify.register(fastifyJwt, {
        secret: appConfig.jwt.secret,
        decoratorName: 'session',
        decode: {
            complete: true
        },
        sign: {
            algorithm: appConfig.jwt.algorithm,
            expiresIn: appConfig.jwt.expiresIn
        },
        verify: {
            algorithms: [appConfig.jwt.algorithm]
        }
    });

    fastify.addHook('preHandler', async (req, res) => {
        try {
            // 如果是收藏图标，则直接通过
            if (res.url === 'favicon.ico') return;
            /* --------------------------------- 自由接口判断 --------------------------------- */

            let isMatchFreeApi = micromatch.isMatch(req.url, appConfig.freeApis);
            // 如果是自由通行的接口，则直接返回
            if (isMatchFreeApi === true) return;

            /* --------------------------------- 请求资源判断 --------------------------------- */
            if (req.url.indexOf('.') !== -1) {
                if (fs.existsSync(path.join(sysConfig.appDir, 'public', req.url)) === true) {
                    return;
                } else {
                    // 文件不存在
                    res.send(appConfig.httpCode.NO_FILE);
                    return;
                }
            }

            /* --------------------------------- 接口存在性判断 -------------------------------- */
            let allApiNames = await fastify.redisGet(appConfig.cacheData.apiNames, true);

            if (allApiNames.includes(req.url) === false) {
                res.send(appConfig.httpCode.API_NOT_FOUND);
                return;
            }

            /* --------------------------------- 接口禁用检测 --------------------------------- */
            let isMatchBlackApi = micromatch.isMatch(req.url, appConfig.blackApis);
            if (isMatchBlackApi === true) {
                res.send(appConfig.httpCode.API_DISABLED);
                return;
            }

            /* --------------------------------- 接口登录检测 --------------------------------- */
            try {
                let jwtData = await req.jwtVerify();
            } catch (err) {
                res.send({
                    ...appConfig.httpCode.NOT_LOGIN,
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
            if (_startsWith(req.url, '/docs') === false) {
                fastify.log.warn(
                    fnClearLogData({
                        apiPath: req?.url,
                        body: _omit(req?.body || {}, appConfig.reqParamsFilter),
                        session: req?.session,
                        reqId: req?.id
                    })
                );
            }

            /* --------------------------------- 上传参数检测 --------------------------------- */
            if (appConfig.authCheck !== false) {
                await fnApiParamsCheck(req);
            }

            /* ---------------------------------- 白名单判断 --------------------------------- */
            // 从缓存获取白名单接口
            let dataApiWhiteLists = await fastify.redisGet(appConfig.cacheData.apiWhiteLists, true);
            let whiteApis = dataApiWhiteLists?.map((item) => item.value);
            let allWhiteApis = _uniq(_concat(appConfig.whiteApis, whiteApis || []));

            // 是否匹配白名单
            let isMatchWhiteApi = micromatch.isMatch(req.url, allWhiteApis);

            // 如果接口不在白名单中，则判断用户是否有接口访问权限
            if (isMatchWhiteApi === false) {
                let userApis = await fastify.getUserApis(req.session);
                let hasApi = _find(userApis, { value: req.url });

                if (hasApi === false) {
                    res.send({
                        ...appConfig.httpCode.FAIL,
                        msg: `您没有 [ ${req?.routeSchema?.summary || req.url} ] 接口的操作权限`
                    });
                    return;
                }
            }
        } catch (err) {
            fastify.log.error(err);
            res.send({
                ...appConfig.httpCode.FAIL,
                msg: err.msg || '认证异常',
                other: err.other || ''
            });
            return res;
        }
    });
}
export default fp(plugin, { name: 'auth', dependencies: ['cors', 'mysql', 'tool'] });
