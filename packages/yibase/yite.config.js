export const yiteConfig = {
    devtool: false,
    // 自动导入解析
    autoImport: {
        resolvers: []
    },
    // 自动组件解析
    autoComponent: {
        resolvers: []
    },
    // webpack 配置
    viteConfig: {
        optimizeDeps: {
            include: [
                //
                'lodash-es',
                'vue-i18n',
                'axios',
                'store2'
            ]
        }
    }
};
