let monolageConfig = {
    private: false,
    publishConfig: {
        access: 'public'
    },
    author: 'chensuiyi <bimostyle@qq.com>',
    repository: {
        type: 'git',
        url: 'https://github.com/chenbimo/yicode.git'
    },
    homepage: 'https://yicode.tech',
    packages: {
        '@yicode-tool/monolage': {
            description: 'monorepo 多仓库 package.json 字段检测与补全工具'
        }
    }
};
export { monolageConfig };
