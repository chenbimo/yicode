export const yiteConfig = {
    // eslint参数
    eslint: {},
    viteZip: {},
    chunkSplit: {},
    // 自动导入解析
    autoImport: {
        resolvers: [
            {
                name: 'ArcoResolver',
                options: {}
            }
        ],
        imports: [
            {
                '@arco-design/web-vue': [
                    //
                    'Message',
                    'Modal',
                    'Notification',
                    'Drawer'
                ]
            }
        ]
    },
    // 自动组件解析
    autoComponent: {
        resolvers: [
            {
                name: 'ArcoResolver',
                options: {
                    sideEffect: true
                }
            }
        ]
    },
    // webpack配置
    viteConfig: {
        optimizeDeps: {
            include: [
                //
                'lodash-es',
                'vue-i18n',
                'axios',
                '@yicode/yidash',
                'date-fns',
                'date-fns/locale'
            ]
        }
    }
};
