let monolageConfig = {
    private: false,
    publishConfig: {
        access: 'public'
    },
    type: 'module',
    author: 'chensuiyi <bimostyle@qq.com>',
    repository: {
        type: 'git',
        url: 'https://github.com/yicode-team/yicode.git'
    },

    homepage: 'https://yicode.tech',
    packages: {
        '@yicode-tool/monolage': {
            description: 'monorepo 多仓库 package.json 字段检测与补全工具',
            // 依赖相关的字段不会被覆盖
            dependencies: []
        },
        '@yicode-template/yiuni': {
            type: 'commonjs'
        }
    }
};
export { monolageConfig };
