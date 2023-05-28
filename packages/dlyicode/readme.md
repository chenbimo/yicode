# dlyicode - （download npm）- 下载 npm 包

## 用途

下载对应的 `npm` 资源到当前目录的 `npm-package` 目录下，而不是通过 `npm install` 安装的方式下载到 `node_modules` 目录下。

将代码、模板、项目托管到 `npm` 仓库中，使用本工具下载对应资源，解决需要自行搭建下载服务器、购买带宽、购买存储等问题。

## 使用

全局安装 `dlyicode` 包。

注：

-   随易科技 `编程开发` 包均已 `@yicode` 为前缀
-   随易科技 `完整项目` 包均已 `@yicode-project` 为前缀
-   随易科技 `模板案例` 包均已 `@yicode-template` 为前缀

```bash
pnpm add -g @yicode/dlyicode
```

安装完毕后，直接在命令行输入 `dlyicode` 并回车，按提示操作即可。

```bash
> dlyicode

ℹ 开发者：随易科技（https://yicode.tech）
-----------------------------------------
? 选择下载类型 官方资源
? 选择从哪里下载 淘宝仓库 - npmmirror.com
? 选择要下载的包 yite + vue3 基础项目开发模板
? 输入要下载的版本（默认下载最新版本） latest
✔ 资源已下载到默认的 npm-package 目录，请移动到正确的目录!
```

## 其他

本包提供 `2` 种 `npm` 资源包下载体验形式

1. 随易科技官方 `npm` 资源包（使用选择包名方式，简单方便）
2. 其他任意 `npm` 资源包（使用输入包名的方式，下载任意资源）

## 作者简介

| 属性         | 值                                                           |
| ------------ | ------------------------------------------------------------ |
| 姓名         | 陈随易                                                       |
| 性别         | 男                                                           |
| 出生年月     | 1993 年 10 月                                                |
| 职业         | 基层小码农                                                   |
| 就业时间     | 2015 年 9 月                                                 |
| 性格         | 喜欢安静，喜欢分享，喜欢钻研                                 |
| 身份         | 前端吹水专家，高级劝退师                                     |
| 爱好         | 敲代码，写小说，看电影，算命                                 |
| 微信         | c91374286                                                    |
| 扣扣         | 24323626                                                     |
| 邮箱         | bimostyle@qq.com                                             |
| 知乎         | [知乎陈随易](https://www.zhihu.com/people/chensuiyi)         |
| 掘金         | [掘金陈随易](https://juejin.im/user/1239904846873326)        |
| 码云         | [码云陈随易](https://gitee.com/banshiweichen)                |
| github       | [github 陈随易](https://github.com/chenbimo)                 |
| 支付宝赞助码 | ![支付宝](https://static.chensuiyi.com/alipay-qrcode.png)    |
| 微信赞助码   | ![微信收款码](https://static.chensuiyi.com/wepay-qrcode.png) |
