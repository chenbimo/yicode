## yibase - （yite-cli + vue3）基础模板

基于 yite-cli驱动的 vite + vue3 项目基础开发模板

## 自动导入

<details>
<summary>arco-design-vue</summary>

需要安装好以下依赖

-   @arco-design/web-vue
-   @arco-plugins/vite-vue

```javascript
// yite.config.js 配置文件

import { vitePluginForArco } from '@arco-plugins/vite-vue';
export const yiteConfig = {
    devtool: false,
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
    // webpack 配置
    viteConfig: {
        plugins: [
            vitePluginForArco({
                style: 'css'
            })
        ],
        optimizeDeps: {
            include: [
                //
                'lodash-es',
                'vue-i18n',
                'axios',
                '@arco-design/web-vue'
            ]
        }
    }
};
```

</details>

<details>
<summary>element-plus</summary>

需要安装好以下依赖

-   element-plus

```javascript
// yite.config.js 配置文件

export const yiteConfig = {
    devtool: false,
    // 自动导入解析
    autoImport: {
        resolvers: [
            {
                name: 'ElementPlusResolver',
                options: {}
            }
        ]
    },
    // 自动组件解析
    autoComponent: {
        resolvers: [
            {
                name: 'ElementPlusResolver',
                options: {}
            }
        ]
    },
    // webpack 配置
    viteConfig: {
        optimizeDeps: {
            include: [
                //
                'lodash-es',
                'vue-i18n',
                'axios',
                'element-plus',
                'element-plus/es'
            ]
        }
    }
};
```

</details>
