// 初始化用到的字典配置，请勿改动
const dictionaryConfig = {
    资讯分类: {
        name: '资讯分类',
        value: '',
        describe: '资讯分类',
        code: 'newsCategory',
        children: [
            {
                code: 'lawNews',
                name: '法律法规',
                value: ''
            },
            {
                code: 'productNews',
                name: '产品资讯',
                value: ''
            },
            {
                code: 'localNews',
                name: '本地资讯',
                value: ''
            }
        ]
    }
};

export { dictionaryConfig };
