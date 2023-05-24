// 跨域配置
export const crosConfig = {
    methods: ['GET', 'OPTIONS', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'authorization', 'token'],
    exposedHeaders: ['Content-Range', 'X-Content-Range', 'Authorization', 'authorization', 'token'],
    preflightContinue: false,
    strictPreflight: false,
    preflight: true,
    optionsSuccessStatus: 204,
    credentials: false
};
