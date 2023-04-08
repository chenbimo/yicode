const redisConfig = {
    password: process.env.NODE_ENV === 'development' ? '' : '123456',
    keyPrefix: 'test#'
};
export { redisConfig };
