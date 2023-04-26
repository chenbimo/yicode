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

import { systemConfig } from '../system.js';
import { jwtConfig } from '../config/jwt.js';
import { appConfig } from '../config/app.js';
import { cacheConfig } from '../config/cache.js';
import { constantConfig } from '../config/constant.js';
import { fnRouterPath, fnApiParamsCheck, fnClearLogData } from '../utils/index.js';

async function plugin(fastify, opts) {
    await fastify.register(fastifyJwt, {
        secret: jwtConfig.secret,
        decoratorName: 'session',
        decode: {
            complete: true
        },
        sign: {
            algorithm: jwtConfig.algorithm,
            expiresIn: jwtConfig.expiresIn
        },
        verify: {
            algorithms: [jwtConfig.algorithm]
        }
    });

    fastify.addHook('preHandler', async (req, res) => {
        try {
            // 如果是收藏图标，则直接通过
            if (res.url === 'favicon.ico') return;
            /* --------------------------------- 自由接口判断 --------------------------------- */

            let isMatchFreeApi = micromatch.isMatch(req.url, appConfig.freeApis);
            // 如果是自由通行的接口，则直接返回
            if (isMatchFreeApi) return;

            /* --------------------------------- 请求资源判断 --------------------------------- */
            if (req.url.indexOf('.') !== -1) {
                if (fs.existsSync(path.join(systemConfig.appDir, 'public', req.url)) === true) {
                    return;
                } else {
                    // 文件不存在
                    res.send(constantConfig.code.NO_FILE);
                    return;
                }
            }

            /* --------------------------------- 接口存在性判断 -------------------------------- */
            let allApiNames = await fastify.redisGet(cacheConfig.cacheData_apiNames, 'json');

            if (allApiNames.includes(req.url) === false) {
                res.send(constantConfig.code.API_NOT_FOUND);
                return;
            }

            /* --------------------------------- 接口禁用检测 --------------------------------- */
            if (req.routeConfig.isDisalbed === true) {
                res.send(constantConfig.code.API_DISABLED);
                return;
            }

            /* --------------------------------- 接口登录检测 --------------------------------- */
            if (req.routeConfig.isLogin !== false) {
                try {
                    let jwtData = await req.jwtVerify();
                } catch (err) {
                    res.send({
                        ...constantConfig.code.NOT_LOGIN,
                        detail: 'token 验证失败'
                    });
                    return;
                }
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
            let dataApiWhiteLists = await fastify.redisGet(cacheConfig.cacheData_apiWhiteLists, 'json');
            let whiteApis = dataApiWhiteLists?.map((item) => item.value);
            let allWhiteApis = _uniq(_concat(appConfig.whiteApis, whiteApis || []));

            // 是否匹配白名单
            let isMatchWhiteApi = micromatch.isMatch(req.url, allWhiteApis);

            // 如果接口不在白名单中，则判断用户是否有接口访问权限
            if (isMatchWhiteApi === false) {
                let userApis = await fastify.getUserApis(req.session);
                let hasApi = _find(userApis, { value: req.url });

                /**
                 * 如果当前请求的路由，不在用户许可内
                 * 如果会话有 ID，则表示用户已登录，没有权限
                 * 如果没有会话 ID，则表示用户未登录
                 * 如果有接口权限，则判断接口本身是否需要登录
                 */
                if (hasApi === false) {
                    // 如果没有接口权限
                    if (req.session.id) {
                        // 判断是否登录，登录了就返回没有接口权限
                        res.send({
                            ...constantConfig.code.FAIL,
                            msg: `您没有 [ ${req?.routeSchema?.summary || req.url} ] 接口的操作权限`
                        });
                        return;
                    } else {
                        // 如果没登录，则返回未登录
                        res.send({
                            ...constantConfig.code.NOT_LOGIN,
                            detail: '没有接口权限'
                        });
                        return;
                    }
                }
            }
        } catch (err) {
            fastify.log.error(err);
            res.send({
                ...constantConfig.code.FAIL,
                msg: err.msg || '认证异常',
                other: err.other || ''
            });
            return res;
        }
    });
}
export default fp(plugin, { name: 'auth', dependencies: ['cors', 'mysql', 'tool'] });
