# yidocs-auto

[english doc](./readme-en.md)

## 作用

vitepress 导航栏和侧边栏自动生成工具

无需手写侧边栏和顶部导航栏配置！！！

## 谁开发的

[官网 https://yicode.tech](https://yicode.tech)

yicode（易编程）系列软件开发生态，全部由陈随易自 2019 年维护至今。

致力于为中小企业、外包公司、软件工作室和个人开发者，提供技术规范、项目模板、效率工具等。

## 效果

实际效果，请浏览 [易文档 https://yicode.tech](https://yicode.tech) 查看。

本文档的 `顶部导航` 和 `左侧目录`，均为自动生成。

## 截图

![随易科技](assets/1.png)

![随易科技](assets/2.png)

## 安装

以下方式，根据自己的情况，任选一种

```bash
npm install @yicode/yidocs-auto -D
pnpm add @yicode/yidocs-auto -D
yarn add @yicode/yidocs-auto -D
```

## 使用

参考如下案例即可

```javascript
import { defineConfig } from 'vitepress';

import { docsAuto } from '@yicode/yidocs-auto';

let { sideBar, navBar } = docsAuto();

export default defineConfig({
    base: '/',
    title: '易文档 - 随易科技',
    description: '何以解忧，唯有代码。',
    lastUpdated: true,
    markdown: {
        theme: 'material-theme-palenight',
        lineNumbers: true
    },
    outDir: './dist',
    srcDir: './markdown',
    titleTemplate: false,
    head: [
        //
        [
            //
            'link',
            {
                rel: 'stylesheet',
                href: 'https://static.yicode.tech/vitepress/vitepress.css'
            }
        ],
        [
            'link',
            {
                rel: 'shortcut icon',
                href: '/favicon.ico'
            }
        ]
    ],
    themeConfig: {
        logo: '/logo.png',
        lastUpdatedText: '更新时间',
        siteTitle: '易文档',
        outline: 'deep',
        outlineTitle: '大纲',
        socialLinks: [
            //
            { icon: 'github', link: 'https://github.com/chenbimo' }
        ],
        footer: {
            message: '随易科技 - 用心做软件',
            copyright: 'Copyright © 2019-present 随易科技'
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        nav: navBar, // 注意：这里不需要手动配置了
        sidebar: sideBar // 注意：这里不需要手动配置了
    }
});
```

## 结构

```bash
.
├── markdown
│   ├── 1-开源
│   │   ├── 1-yite-cli
│   │   │   ├── 1-基本简介
│   │   │   │   ├── 1-基本介绍.md
│   │   │   │   └── 2-快速体验.md
│   │   │   └── 2-项目架构
│   │   │       └── 1-目录含义.md
│   │   ├── 2-yibase-vue3
│   │   │   └── 1-基本介绍
│   │   │       └── 1-基本介绍.md
│   │   └── 3-yiapi
│   │       ├── 1-基本简介
│   │       │   ├── 1-基本介绍.md
│   │       │   └── 2-快速体验.md
│   │       └── 2-项目架构
│   │           └── 1-目录含义.md
│   ├── 2-关于
│   │   └── 1-站长信息
│   │       ├── 1-关于站长.md
│   │       └── 2-程序人生.md
│   ├── public
│   │   ├── favicon.ico
│   │   └── logo.png
│   └── index.md
└── package.json
```

## 要求

1. 必需按照按照如上文件结构组织文档才可自动生成
2. 文件必须放到 `markdown` 目录中
3. 所有文档和目录，都要以 `数字-文件名称` 的形式！！！
4. 最多支持 `4` 级文件结构！！！
5. 注意 `.vitepress` 和 `markdown` 目录的位置

## 版权

`yidocs` 请任意使用，无任何额外要求，保留原作者信息即可。

## 反馈

-   作者微信：c91374286
-   作者邮箱：bimostyle@qq.com

## 其他

-   **@yicode/yite-cli**（基于 `vite` 进行深度封装的 `vue3` 项目开发脚手架）
-   **@yicode/yiapi**（基于 `fastify` 进行深度封装的 `nodejs` 项目接口开发框架）
-   **@yicode/dlnpm**（`yicode` 软件生态下载工具）
-   **@yicode/commander**（`commander v10` 汉化，更符合国人使用）
-   **@yicode/yidash**（类 `lodash` 的业务方法库）
-   **@yicode-helper/yidocs-auto**（`vitepress` 侧边栏和导航栏自动生成工具，避免手动配置）
-   **@yicode-helper/yite-html**（给基于 `vite` 项目开发提供不同环境下的入口文件）
-   **@yicode-helper/yite-qrcode**（开发时显示手机调试二维码，避免手动输入地址）
-   **@yicode-helper/yite-router**（简单、粗暴、方便的路由自动化方案）
-   **@yicode-helper/yite-i18n**（轻量级国际化语言数据生成插件）
-   **@yicode-helper/yite-chunk**（代码自动分割方案）
-   **@yicode-template/base-vue3**（基本且完整的 `vue3` 项目开发模板）
-   **@yicode-template/yidocs**（具备自动化侧边栏和导航栏的 `vitepress` 文档项目模板）
-   **@yicode-template/uni-vue3**（具备最新的依赖和项目组织的`uniapp vue3`项目模板）
-   **@yicode-template/admin-vue3**（`arco-design + vue3` 研发的后台管理模板）
-   **@yicode-template/yiapi-free**（`yiapi` 接口开发项目模板）

---

# yidocs-auto

[中文文档](./readme-en.md)

## what?

`vitepress` Navbar and sidebar auto-generation tool

No need to manually write sidebar and top navigation bar configuration！！！

## who developed it

[official website https://yicode.tech](https://yicode.tech)

The yicode (easy programming) series of software development ecology, all maintained by Chen Suiyi since 2019.

Committed to providing technical specifications, project templates, efficiency tools, etc. for small and medium-sized enterprises, outsourcing companies, software studios and individual developers.

## Effect

For the actual effect, please browse [https://yicode.tech](https://yicode.tech) to view.

The `Top Navigation` and `Left Table of Contents` of this document are automatically generated. .

## screenshot

![随易科技](assets/1.png)

![随易科技](assets/2.png)

## Install

Choose one of the following methods according to your own situation

```bash
npm install @yicode/yidocs-auto -D
pnpm add @yicode/yidocs-auto -D
yarn add @yicode/yidocs-auto -D
```

## use

Just refer to the following case

```javascript
import { defineConfig } from 'vitepress';

import { docsAuto } from '@yicode/yidocs-auto';

let { sideBar, navBar } = docsAuto();

export default defineConfig({
    base: '/',
    title: '易文档 - 随易科技',
    description: '何以解忧，唯有代码。',
    lastUpdated: true,
    markdown: {
        theme: 'material-theme-palenight',
        lineNumbers: true
    },
    outDir: './dist',
    srcDir: './markdown',
    titleTemplate: false,
    head: [
        //
        [
            //
            'link',
            {
                rel: 'stylesheet',
                href: 'https://static.yicode.tech/vitepress/vitepress.css'
            }
        ],
        [
            'link',
            {
                rel: 'shortcut icon',
                href: '/favicon.ico'
            }
        ]
    ],
    themeConfig: {
        logo: '/logo.png',
        lastUpdatedText: '更新时间',
        siteTitle: '易文档',
        outline: 'deep',
        outlineTitle: '大纲',
        socialLinks: [
            //
            { icon: 'github', link: 'https://github.com/chenbimo' }
        ],
        footer: {
            message: '随易科技 - 用心做软件',
            copyright: 'Copyright © 2019-present 随易科技'
        },
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        nav: navBar, // Note: No manual configuration is required here
        sidebar: sideBar // Note: No manual configuration is required here
    }
});
```

## structure

```bash
.
├── markdown
│   ├── 1-开源
│   │   ├── 1-yite-cli
│   │   │   ├── 1-基本简介
│   │   │   │   ├── 1-基本介绍.md
│   │   │   │   └── 2-快速体验.md
│   │   │   └── 2-项目架构
│   │   │       └── 1-目录含义.md
│   │   ├── 2-yibase-vue3
│   │   │   └── 1-基本介绍
│   │   │       └── 1-基本介绍.md
│   │   └── 3-yiapi
│   │       ├── 1-基本简介
│   │       │   ├── 1-基本介绍.md
│   │       │   └── 2-快速体验.md
│   │       └── 2-项目架构
│   │           └── 1-目录含义.md
│   ├── 2-关于
│   │   └── 1-站长信息
│   │       ├── 1-关于站长.md
│   │       └── 2-程序人生.md
│   ├── public
│   │   ├── favicon.ico
│   │   └── logo.png
│   └── index.md
└── package.json
```

## Require

1. Documents must be organized according to the above file structure to be automatically generated
2. Files must be placed in the `markdown` directory
3. All documents and directories must be in the form of `number-filename`! ! !
4. Up to `4` level file structure is supported! ! !
5. Note the location of the `.vitepress` and `markdown` directories

## copyright

`yidocs-auto` Please use it arbitrarily, without any additional requirements, just keep the original author information.

## feedback

-   Author WeChat：c91374286
-   Author Email：bimostyle@qq.com

## others

-   **@yicode/yite-cli** (Deeply encapsulated `vue3` project development scaffolding based on `vite`)
-   **@yicode/yiapi** (Deeply encapsulated `nodejs` project interface development framework based on `fastify`)
-   **@yicode/dlnpm** (`yicode` software ecological download tool)
-   **@yicode/commander** (`commander v10` Chinese, more suitable for Chinese people)
-   **@yicode/yidash** (business method library for class `lodash`)
-   **@yicode-helper/yidocs-auto** (`vitepress` sidebar and navigation bar automatic generation tool, avoid manual configuration)
-   **@yicode-helper/yite-html** (provide entry files in different environments for project development based on `vite`)
-   **@yicode-helper/yite-qrcode** (during development, display the mobile phone debugging QR code, avoid manually entering the address)
-   **@yicode-helper/yite-router** (simple, brutal and convenient routing automation solution)
-   **@yicode-helper/yite-i18n** (lightweight internationalization language data generation plugin)
-   **@yicode-helper/yite-chunk** (code automatic segmentation scheme)
-   **@yicode-template/base-vue3** (basic and complete `vue3` project development template)
-   **@yicode-template/yidocs** (`vitepress` documentation project template with automated sidebar and navbar)
-   **@yicode-template/uni-vue3** (`uniapp vue3` project template with latest dependencies and project organization)
-   **@yicode-template/admin-vue3** (background admin template developed by `arco-design + vue3`)
-   **@yicode-template/yiapi-free** (`yiapi` interface development project template)
