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
import { httpConfig } from '../config/httpConfig.js';
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
            const pureUrl = fnRouterPath(req.url);
            // 如果是收藏图标，则直接通过
            if (pureUrl === 'favicon.ico') return;

            /* --------------------------------- 接口禁用检测 --------------------------------- */
            const isMatchBlackApi = micromatch.isMatch(pureUrl, appConfig.blackApis);
            if (isMatchBlackApi === true) {
                res.send(httpConfig.API_DISABLED);
                return;
            }

            /* --------------------------------- 解析用户登录参数 --------------------------------- */
            const isAuthFail = false;
            try {
                await req.jwtVerify();
            } catch (err) {
                isAuthFail = true;
            }

            /* --------------------------------- 自由接口判断 --------------------------------- */
            const isMatchFreeApi = micromatch.isMatch(pureUrl, appConfig.freeApis);
            // 如果是自由通行的接口，则直接返回
            if (isMatchFreeApi === true) return;

            /* --------------------------------- 请求资源判断 --------------------------------- */
            if (pureUrl.indexOf('.') !== -1) {
                if (fs.existsSync(path.join(sysConfig.appDir, 'public', pureUrl)) === true) {
                    return;
                } else {
                    // 文件不存在
                    res.send(httpConfig.NO_FILE);
                    return;
                }
            }

            /* --------------------------------- 接口存在性判断 -------------------------------- */
            const allApiNames = await fastify.redisGet('cacheData:apiNames');

            if (allApiNames.includes(pureUrl) === false) {
                res.send(httpConfig.NO_API);
                return;
            }

            /* --------------------------------- 接口登录检测 --------------------------------- */
            if (isAuthFail === true) {
                res.send({
                    ...httpConfig.NOT_LOGIN,
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
            fastify.log.warn({
                apiPath: req?.url,
                body: _omit(req?.body || {}, appConfig.reqParamsFilter),
                session: req?.session,
                reqId: req?.id
            });

            /* --------------------------------- 上传参数检测 --------------------------------- */
            if (appConfig.paramsCheck !== false) {
                await fnApiParamsCheck(req);
            }

            /* ---------------------------------- 白名单判断 --------------------------------- */
            // 从缓存获取白名单接口
            const dataApiWhiteLists = await fastify.redisGet('cacheData:apiWhiteLists');
            const whiteApis = dataApiWhiteLists?.map((item) => item.value);
            const allWhiteApis = _uniq(_concat(appConfig.whiteApis, whiteApis || []));

            // 是否匹配白名单
            const isMatchWhiteApi = micromatch.isMatch(pureUrl, allWhiteApis);

            if (isMatchBlackApi === true) return;

            /* ---------------------------------- 角色接口权限判断 --------------------------------- */
            // 如果接口不在白名单中，则判断用户是否有接口访问权限
            const userApis = await fastify.getUserApis(req.session);
            const hasApi = _find(userApis, { value: pureUrl.replace('/api/', '/') });

            if (!hasApi) {
                res.send({
                    ...httpConfig.FAIL,
                    msg: `您没有 [ ${req?.routeOptions?.schema?.summary || pureUrl} ] 接口的操作权限`
                });
                return;
            }
        } catch (err) {
            fastify.log.error(err);
            res.send({
                ...httpConfig.FAIL,
                msg: err.msg || '认证异常',
                other: err.other || ''
            });
            return res;
        }
    });
}
export default fp(plugin, { name: 'auth', dependencies: ['cors', 'mysql', 'tool'] });
