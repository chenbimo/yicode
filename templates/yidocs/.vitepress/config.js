import { defineConfig } from 'vitepress';

import { docsAuto } from '@yicode-helper/yidocs-auto';

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
