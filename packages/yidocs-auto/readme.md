# yidocs-auto

## 作用

vitepress 导航和侧边栏自动生成工具

## 效果

实际效果，请浏览 [易文档 https://doc.yicode.tech](https://doc.yicode.tech) 查看。

本文档的顶部导航和左侧目录，均为自动生成。

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
    outDir: '../dist',
    srcDir: '../markdown',
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
        nav: navBar,
        sidebar: sideBar
    }
});
```

## 结构

必需按照按照如下文件结构组织文档才可自动生成，所有文档和目录，都要以 `数字-文件名称` 的形式！！！

```bash
.
├── markdown
│   ├── 1-开源
│   │   ├── 1-yivite-cli
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
