const mailConfig = {
    host: 'smtp.qq.com',
    port: 465,
    pool: true,
    secure: true,
    // qq 邮箱
    user: 'demo@qq.com',
    pass: '',
    from: {
        name: 'test',
        address: 'demo@qq.com'
    }
};
export { mailConfig };
