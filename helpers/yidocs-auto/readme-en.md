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

For the actual effect, please browse [https://doc.yicode.tech](https://doc.yicode.tech) to view.

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
