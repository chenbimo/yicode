<template>
    <div class="home-more">
        <div class="git-repo">
            <a class="gitee" href="https://gitee.com/yicode-team/yicode" target="_blank">
                <img src="https://gitee.com/yicode-team/yicode/widgets/widget_card.svg?colors=4183c4,ffffff,ffffff,e3e9ed,666666,9b9b9b" />
            </a>
        </div>

        <div class="panel product">
            <div class="wrapper">
                <div class="common-title">
                    <div class="inner">
                        <div class="name">自研产品</div>
                        <div class="describe">用心做产品，专心写软件</div>
                    </div>
                </div>

                <div class="group-box">
                    <div class="box">
                        <div class="box-inner">
                            <div class="thumbnail">易待办</div>
                            <div class="describe">简单好用的待办事项管理工具</div>
                            <div class="status">
                                <!-- <img class="img" alt="npm" src="https://img.shields.io/badge/版本-3.3.1-brightgreen" /> -->
                                <a class="doc" target="_blank" href="https://yicode.tech/1-产品/1-易待办/1-基本简介.html">文档</a>
                            </div>
                        </div>
                    </div>
                    <div class="box">
                        <div class="box-inner">
                            <div class="thumbnail">易导航</div>
                            <div class="describe">简单好用的网址管理</div>
                            <div class="status">
                                <a class="doc" target="_blank" href="https://yicode.tech/1-产品/3-易导航/1-使用教程.html">文档</a>
                            </div>
                        </div>
                    </div>
                    <div class="box"></div>
                </div>
            </div>
        </div>
        <!-- <div class="panel document">
            <div class="wrapper">
                <div class="common-title">
                    <div class="inner">
                        <div class="name">教程手册</div>
                        <div class="describe">编程教程，产品手册，技术文章等</div>
                    </div>
                </div>

                <div class="group-box">
                    <div class="box">
                        <div class="box-inner">
                            <div class="thumbnail">vscode简明手册</div>
                            <div class="describe">官方教程的汉化版</div>
                            <div class="status">
                                <a class="doc" target="_blank" href="https://yicode.tech/3-小册/5-vscode简明手册/1-写在前面/1-文档说明.html">文档</a>
                            </div>
                        </div>
                    </div>
                    <div class="box">
                        <div class="box-inner">
                            <div class="thumbnail">nodejs实践指南</div>
                            <div class="describe">实践是学习编程的最好方式</div>
                            <div class="status">
                                <a class="doc" target="_blank" href="https://yicode.tech/3-小册/1-nodejs实践指南/1-前言/1-作者简介.html">文档</a>
                            </div>
                        </div>
                    </div>
                    <div class="box">
                        <div class="box-inner">
                            <div class="thumbnail">编程提效指南</div>
                            <div class="describe">工具善其事，必先利其器</div>
                            <div class="status">
                                <a class="doc" target="_blank" href="https://yicode.tech/3-小册/2-编程提效指南/1-vscode精选扩展.html">文档</a>
                            </div>
                        </div>
                    </div>
                    <div class="box">
                        <div class="box-inner">
                            <div class="thumbnail">编程案例实践</div>
                            <div class="describe">动起手来，不要留在脑海里</div>
                            <div class="status">
                                <a class="doc" target="_blank" href="https://yicode.tech/3-小册/3-编程案例实践/1-贪吃蛇.html">文档</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
        <div class="panel opensource">
            <div class="wrapper">
                <div class="common-title">
                    <div class="inner">
                        <div class="name">自研开源</div>
                        <div class="describe">随易科技自 2019 年以来的所有开源作品</div>
                    </div>
                </div>
                <div class="common-sub-title">核心开源</div>
                <div class="common-sub-describe">随易科技的核心开源作品</div>
                <div class="group-box">
                    <div class="box">
                        <div class="box-inner">
                            <div class="thumbnail">yite-cli</div>
                            <div class="describe">专业的 vite + vue3 项目脚手架</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode/yite-cli?label=版本" />
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode/yite-cli?label=下载" />
                                <a class="doc" target="_blank" href="https://yicode.tech/2-开源/1-yite-cli/1-基本简介/1-基本介绍.html">文档</a>
                            </div>
                        </div>
                    </div>

                    <div class="box">
                        <div class="box-inner">
                            <div class="thumbnail">yidash</div>
                            <div class="describe">好用的 js 业务函数库</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode/yidash?label=版本" />
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode/yidash?label=下载" />
                                <a class="doc" target="_blank" href="#">文档</a>
                            </div>
                        </div>
                    </div>

                    <div class="box">
                        <div class="box-inner">
                            <div class="thumbnail">dlnpm</div>
                            <div class="describe">好用的 npm 资源下载工具</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode/dlnpm?label=版本" />
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode/dlnpm?label=下载" />
                                <a class="doc" target="_blank" href="#">文档</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="common-sub-title">模板开源</div>
                <div class="common-sub-describe">基于核心开源之上的一些官方模板，下载就可以用</div>
                <div class="group-box">
                    <div class="box">
                        <div class="box-inner">
                            <div class="thumbnail">yibase</div>
                            <div class="describe">好用的 vue3 项目基础模板</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-template/yibase?label=版本" />
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-template/yibase?label=下载" />
                                <a class="doc" target="_blank" href="#">文档</a>
                            </div>
                        </div>
                    </div>
                    <div class="box">
                        <div class="box-inner">
                            <div class="thumbnail">yiuni</div>
                            <div class="describe">好用的 uniapp 项目模板</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-template/yiuni?label=版本" />
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-template/yiuni?label=下载" />
                                <a class="doc" target="_blank" href="#">文档</a>
                            </div>
                        </div>
                    </div>
                    <div class="box">
                        <div class="box-inner">
                            <div class="thumbnail">yidocs</div>
                            <div class="describe">好用的 vitepress 文档模板</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-template/yidocs?label=版本" />
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-template/yidocs?label=下载" />
                                <a class="doc" target="_blank" href="https://yicode.tech/2-开源/2-yidocs/1-说明文档.html">文档</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="common-sub-title">辅助开源</div>
                <div class="common-sub-describe">用来给核心开源等做辅助的项目，可以说是核心开源的一部分，这部分没有使用文档，因为不适用于其他场景</div>
                <div class="group-line">
                    <div class="line">
                        <div class="line-inner">
                            <div class="thumbnail">yidocs-auto</div>
                            <div class="describe">好用的 vitepress 侧边栏和导航栏自动生成工具</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-helper/yidocs-auto?label=版本" />
                                <div class="w-10px"></div>
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-helper/yidocs-auto?label=下载" />
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <div class="line-inner">
                            <div class="thumbnail">yiapi-env</div>
                            <div class="describe">yiapi内置的环境变量插件</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-helper/yiapi-env?label=版本" />
                                <div class="w-10px"></div>
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-helper/yiapi-env?label=下载" />
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <div class="line-inner">
                            <div class="thumbnail">yite-i18n</div>
                            <div class="describe">yite-cli 内置的 i18n 插件</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-helper/yite-i18n?label=版本" />
                                <div class="w-10px"></div>
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-helper/yite-i18n?label=下载" />
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <div class="line-inner">
                            <div class="thumbnail">yite-qrcode</div>
                            <div class="describe">yite-cli 内置的二维码插件</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-helper/yite-qrcode?label=版本" />
                                <div class="w-10px"></div>
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-helper/yite-qrcode?label=下载" />
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <div class="line-inner">
                            <div class="thumbnail">yite-router</div>
                            <div class="describe">yite-cli 内置的路由插件</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-helper/yite-router?label=版本" />
                                <div class="w-10px"></div>
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-helper/yite-router?label=下载" />
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <div class="line-inner">
                            <div class="thumbnail">yite-html</div>
                            <div class="describe">yite-cli 内置的打包环境切换插件</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-helper/yite-html?label=版本" />
                                <div class="w-10px"></div>
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-helper/yite-html?label=下载" />
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <div class="line-inner">
                            <div class="thumbnail">yite-chunk</div>
                            <div class="describe">yite-cli 内置的代码分割策略插件</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-helper/yite-html?label=版本" />
                                <div class="w-10px"></div>
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-helper/yite-html?label=下载" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="common-sub-title">工具开源</div>
                <div class="common-sub-describe">独立的工具项目，有趣，好玩，有用</div>
                <div class="group-line">
                    <div class="line">
                        <div class="line-inner">
                            <div class="thumbnail">gitlook</div>
                            <div class="describe">git提交信息统计查看工具</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-tool/gitlook?label=版本" />
                                <div class="w-10px"></div>
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-tool/gitlook?label=下载" />
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <div class="line-inner">
                            <div class="thumbnail">monolage</div>
                            <div class="describe">monorepo 单体仓库子项目 package.json 配置统一设置工具</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-tool/monolage?label=版本" />
                                <div class="w-10px"></div>
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-tool/monolage?label=下载" />
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <div class="line-inner">
                            <div class="thumbnail">dlnpm</div>
                            <div class="describe">下载 npm 包工具</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-tool/dlnpm?label=版本" />
                                <div class="w-10px"></div>
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-tool/dlnpm?label=下载" />
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <div class="line-inner">
                            <div class="thumbnail">dlyicode</div>
                            <div class="describe">下载随易科技官方 npm 包工具</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-tool/dlyicode?label=版本" />
                                <div class="w-10px"></div>
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-tool/dlyicode?label=下载" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="common-sub-title">其他开源</div>
                <div class="common-sub-describe">其他开源，可有可无，可用可不用</div>
                <div class="group-line">
                    <div class="line">
                        <div class="line-inner">
                            <div class="thumbnail">commander</div>
                            <div class="describe">好用的 commander 汉化版</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-other/commander?label=版本" />
                                <div class="w-10px"></div>
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-other/commander?label=下载" />
                            </div>
                        </div>
                    </div>
                    <div class="line">
                        <div class="line-inner">
                            <div class="thumbnail">minimist</div>
                            <div class="describe">minimist ES6 版本</div>
                            <div class="status">
                                <img class="img" alt="npm" src="https://img.shields.io/npm/v/@yicode-other/minimist?label=版本" />
                                <div class="w-10px"></div>
                                <img class="img" alt="npm" src="https://img.shields.io/npm/dm/@yicode-other/minimist?label=下载" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup></script>
<style lang="scss">
.home-more {
    overflow-x: hidden;
    .wrapper {
        margin: 0 auto;
        max-width: 1152px;
    }
    .git-repo {
        display: flex;
        justify-content: center;
        padding: 0 15px;
        .gitee {
            display: flex;
            justify-content: center;
        }
    }

    .doc {
        font-size: 12px;
        background-color: #999;
        color: #fff;
        padding: 0 10px;
        border-radius: 4px;
        word-break: keep-all;
        white-space: nowrap;
        height: 20px;
        line-height: 20px;
    }

    .panel {
        margin-top: 10px;
        .wrapper {
        }
        .common-title {
            display: flex;
            justify-content: center;
            margin: 50px 0 50px;
            padding: 0 15px;
            .inner {
                background-color: #6e8894;
                padding: 15px 50px;
                border-radius: 6px;
                max-width: 500px;
                width: 100%;
                //
                display: inline-block;
                vertical-align: middle;
                -webkit-transform: perspective(1px) translateZ(0);
                transform: perspective(1px) translateZ(0);
                box-shadow: 0 0 1px rgba(0, 0, 0, 0);
                position: relative;
                &::before {
                    pointer-events: none;
                    position: absolute;
                    z-index: -1;
                    content: '';
                    border-style: solid;
                    -webkit-transition-duration: 0.3s;
                    transition-duration: 0.3s;
                    -webkit-transition-property: transform;
                    transition-property: transform;
                    left: calc(50% - 10px);
                    bottom: 0;
                    border-width: 10px 10px 0 10px;
                    border-color: #6e8894 transparent transparent transparent;
                    transform: translateY(10px);
                }
            }
            .name {
                text-align: center;
                font-size: 22px;
                color: #fff;
            }
            .describe {
                text-align: center;
                color: #ffeb3b;
                font-size: 14px;
                margin-top: 4px;
            }
        }

        .common-sub-title {
            text-align: center;
            padding: 15px 15px 5px;
            font-size: 18px;
            font-weight: bold;
        }

        .common-sub-describe {
            font-size: 14px;
            color: #999;
            text-align: center;
            margin-bottom: 20px;
            padding: 0 15px;
        }
        &.document {
            .group-box {
                .box {
                    flex: 0 0 25%;
                }
            }
        }
        .group-box {
            display: flex;
            flex-wrap: wrap;
            padding: 0 5px;
            .describe {
                font-size: 16px;
                color: #999;
                text-align: center;
                margin-bottom: 30px;
            }
            .box {
                flex: 0 0 33.333333%;
                padding: 10px 10px;
                .box-inner {
                    background-color: #f7f7f7;
                    border: 4px solid transparent;
                    transition: all 0.2s;
                    padding: 30px 10px;
                    border-radius: 6px;
                    &:hover {
                        border: 4px solid #eee;
                    }
                }

                .thumbnail {
                    font-size: 20px;
                    font-weight: bold;
                    text-align: center;
                    color: #004eff;
                }
                .describe {
                    margin: 6px 0;
                    color: #999;
                    font-size: 14px;
                    height: 40px;
                    line-height: 20px;
                    overflow: hidden;
                }
                .status {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .img,
                    .link {
                        margin-right: 6px;
                    }
                }
            }
        }
        .group-line {
            .describe {
                font-size: 16px;
                color: #999;
                text-align: left;
            }
            .w-10px {
                width: 10px;
                min-width: 10px;
            }
            .line {
                padding: 0 15px;
                .line-inner {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 6px 0;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-radius: 4px;
                    &:hover {
                        background-color: #f7f7f7;
                        padding-left: 15px;
                        padding-right: 15px;
                    }
                }

                .thumbnail {
                    flex: 0 0 auto;
                    min-width: 200px;
                    font-size: 20px;
                    font-weight: bold;
                    color: #004eff;
                }
                .describe {
                    flex: 1 1 100%;
                    font-size: 14px;
                }
                .status {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                }
            }
        }
    }

    @media screen and (max-width: 800px) {
        .panel {
            &.document {
                .group-box {
                    .box {
                        flex: 0 0 100%;
                        width: 100%;
                    }
                }
            }
            .group-box {
                .box {
                    flex: 0 0 100%;
                    width: 100%;
                }
            }
            .group-line {
                .line {
                    margin-bottom: 10px;
                    .line-inner {
                        display: block;
                        .thumbnail {
                            width: 100%;
                            text-align: center;
                        }
                        .describe {
                            width: 100%;
                            text-align: center;
                            margin-bottom: 6px;
                        }
                        .status {
                            justify-content: center;
                        }
                    }
                }
            }
        }
    }
}
</style>
