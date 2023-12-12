export const callbackConfig = {
    // 微信消息回调
    weixinMessage(fastify, options) {
        console.log('🚀 ~ file: callback.js:2 ~ messageCallback ~ options:', options);
    }
};
