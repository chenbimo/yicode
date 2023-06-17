# yihtml-cli (易页面)

`yihtml-cli` 是一个基于 `gulp` 的传统 `html`, `css`, `js` 静态多页面打包工具。

## 特点

1. 默认支持公共 `html` 模板，避免写重复的 `html`
2. 默认支持 `css` 的 `scss` 写法（不支持 `less`,`stylus` 等）
3. 默认支持 `js` 的 `babel` 转译,可以使用 `ES6` 语法
4. 修改代码，自动刷新网页
5. 一键生成页面的 `html` 、`css`、`js` 文件模板
6. 一键删除页面的 `html` 、`css`、`js` 文件
7. 支持开关控制是否进行 `js` 转译和 `source-map` 生成

## 如何使用

`yihtml-cli` 自带了一个简单的项目开发模板，请基于此模板进行自己的想开发和改造，否则 `yihtml-cli` 将会无法使用。

## 安装 `yitool-cli`

> yitool-cli 是 [易编程科技](https://yicode.tech) 旗下软件开发生态下的一个专门用于生态内项目模板下载、git 提交统计、npm 镜像切换等功能的命令行工具。

```bash
# npm安装方式
npm install -g @yicode/yitool-cli

# pnpm 安装方式
pnpm add -g @yicode/yitool-cli
```

## 下载 `yihtml-template` 项目模板

> 安装 `@yicode/yitool-cli` 完毕后，创建项目文件，进入到该目录下，直接运行 `yitool` 命令，选择 `template` 指令，回车。

```shell
PS D:\codes\git\chensuiyi\yihtml-cli\test> yitool
? 请选择一个命令
  git          git提交数据可视化
  npm          切换npm源地址
❯ template     下载项目模板
  zip          创建压缩包
  version      查看版本信息
```

> 选择 `静态原生模板 yihtml` ，回车。

```shell
PS D:\codes\git\chensuiyi\yihtml-cli\test> yitool
? 请选择一个命令 template     下载项目模板
? 请选择要下载的模板
  接口模板                           (yiapi-free)
  uniapp模板                       (yiuni-vue3)
  uniapp模板                       (yiuni-vue2)
❯ 静态原生模板                         (yihtml)
  基础模板                           (yibase-vue2)
  基础模板                           (yibase-vue3)
  后台模板                           (yiadmin-vue2)
```

> 下载成功后，提示如下

```shell
PS D:\codes\git\chensuiyi\yihtml-cli\test> yitool
? 请选择一个命令 template     下载项目模板
? 请选择要下载的模板 静态原生模板                         (yihtml)
✔ 下载成功
```

## 运行项目

> 下载项目使用的是 `@yicode/yitool-cli` 工具，运行项目使用 `@yicode/yihtml-cli` （易网页） 静态多页面开发脚手架。

```bash
# npm安装方式
npm install -g @yicode/yihtml-cli

# pnpm 安装方式
pnpm add -g @yicode/yihtml-cli
```

> 安装 `@yicode/yihtml-cli` 完毕后，在项目下执行 `yihtml`，查看命令帮助

```shell
PS D:\codes\git\chensuiyi\yihtml-cli\test> yihtml
使用说明: yihtml-cli [选项] [命令]

选项:
  -v, --version  显示yihtml版本
  -h, --help     显示帮助信息

命令:
  new [选项]       自动生成指令
  del [选项]       自动删除指令
  build          发布环境打包
  dev [选项]       启动开发环境
  help [命令]      显示命令帮助
```

> 使用 `yihtml dev` 运行项目

```shell
PS D:\codes\git\chensuiyi\yihtml-cli\test> yihtml dev
开发环境启动中
开发环境启动完毕
[Browsersync] Access URLs:
 -------------------------------------
       Local: http://localhost:3000
    External: http://172.24.240.1:3000
 -------------------------------------
          UI: http://localhost:3001
 UI External: http://localhost:3001
 -------------------------------------
[Browsersync] Serving files from: D:\codes\git\chensuiyi\yihtml-cli\test\dist
```

按住 `ctrl` 键，鼠标单机 `Local` 处的链接，就会通过默认浏览器打开项目，此时修改项目代码，浏览器会自动刷新。

## 项目架构介绍

```bash
├───📁 css/ # 跟页面一一对应的css文件
│   ├───📄 index.scss
│   └───📄 test1.scss
├───📁 images/
│   └───📁 1/
├───📁 js/ # 跟页面一一对应的js文件
│   ├───📄 index.js
│   └───📄 test1.js
├───📁 public/ # 页面的公共css js 文件
│   ├───📁 css/
│   ├───📁 fonts/
│   └───📁 js/
├───📁 static/ # 静态文件，不进行任何预编译和转译操作，存放jquery等第三方库
│   └───📁 js/
├───📁 styles/ # scss变量文件，使用yihtml new 页面名称，对应的css会自动导入此变量文件
│   └───📄 variable.scss
├───📁 tpls/ # 页面的公共html部分
│   ├───📄 head.html
│   └───📄 script.html
├───📄 index.html # index.html页面
└───📄 test1.html # test.html 页面
```

## 打包项目

> 使用 `yihtml build` 即可，默认打包后的文件放在 `dist` 目录中，打包完毕，上传到服务器即可

```shell
PS D:\codes\git\chensuiyi\yihtml-cli\test> yihtml build
发布环境资源构建中，请耐心等待...
发布环境资源打包完毕
```

## 创建新页面

> 使用 `yihtml new -p 页面名称`，即可创建 `css/news.scss`、`js/news.js`、`news.html` 三个配套的文件，且`news.html` 页面会自动导入对应的 `css` 和 `js` 文件。

```shell
PS D:\codes\git\chensuiyi\yihtml-cli\test> yihtml new -p news
news 页面创建成功
```

## 删除页面

> 使用 `yihtml del -p 页面名称`，将会自动删除对应的 `css/news.scss`、`js/news.js`、`news.html` 文件。

```shell
PS D:\codes\git\chensuiyi\yihtml-cli\test> yihtml del -p news
news 页面删除成功
```

## 仓库地址

> [gitee https://gitee.com/yicode-team/yihtml-cli](https://gitee.com/yicode-team/yihtml-cli)

> [github https://github.com/yicode-team/yihtml-cli](https://github.com/yicode-team/yihtml-cli)

## 代码贡献

为了防止潜在的版权纠纷问题，本仓库不接受任何人的代码 `PR`，但是非常欢迎任何人的，有效的建议和反馈。

如有功能问题，设计问题等，请提 `issur` 或者联系作者，由其本人修复问题，实现功能。

## 作者简介

| 属性     | 值                                                    |
| -------- | ----------------------------------------------------- |
| 姓名     | `陈随易`                                              |
| 微信     | `c91374286` 或 `nolimitluandou`                       |
| 扣扣     | `24323626(用得少)`                                    |
| 邮箱     | `bimostyle@qq.com`                                    |
| 知乎     | [知乎陈随易](https://www.zhihu.com/people/chensuiyi)  |
| 掘金     | [掘金陈随易](https://juejin.im/user/1239904846873326) |
| 码云     | [码云陈随易](https://gitee.com/banshiweichen)         |
| github   | [github 陈随易](https://github.com/chenbimo)          |
| 交流探讨 | 创建了 `全球顶级程序员微信交流群`，加入交流请加我微信 |

## 作者时间线

一个在折腾路上狂奔的程序员。

-   出生于 1993 年，男，身高数尺，日食三餐
-   2011 年高二，重点高中转职高，学计算机
-   2015 年大二读完挂 8 科，退学，益阳 PHP 实习
-   2016 年独立负责整个项目前后端，步入全栈
-   2017 年做前端线下讲师，教学方式无人懂
-   2018 年开发游戏，凌晨 1，2 点下班
-   2019 年做前端线上讲师，下半年远程顾问
-   2020 年创业、加班、熬夜、开源
-   2021 年回老家全职接单，月入 2000
-   2022 年继续接单，月入 1 万 5 以上，业余写开源项目
-   2023 年，注册公司，产品 + 文章，收入甚微，饥肠辘辘

忠告！！！年轻人，一定要多读书！

至少拿个本科文凭再出来混！不然会损失很多机会！

## 对新人的建议

1. 不要躺平
2. 提高自身能力
3. 多结交有实力的朋友
4. 业余探索副业收入
5. 减少抱怨
6. 多思考如何脱离困境

## 赞助作者

支付宝赞赏码

![支付宝](https://static.chensuiyi.com/alipay-qrcode.png)

微信赞赏码

![微信收款码](https://static.chensuiyi.com/wepay-qrcode.png)

## 版权说明

`yiapi(易接口)` 使用 `Apache 2.0` 协议开源

> 一句话总结：开源不等于放弃版权，不可侵犯原作者版权，改动处要做说明，可以闭源使用。

拥有版权（Copyright）意味着你对你开发的软件及其源代码拥有著作权，所有权和其他法定权利，使用一个开源协议并不意味着放弃版权。

在 `Apache 2.0` 协议许可下，您可以：

-   **商业化使用**（这意味着，您可以出于商业目的使用这些源代码）
-   **再分发**（这意味着，您可以将源代码副本传输给其他任何人）
-   **修改**（这意味着，您可以修改源代码）
-   **专利使用**（这意味着，版权人明确声明授予您专利使用权）
-   **私人使用**（这意味着，您可以出于一切目的私下使用和修改源代码）

唯须遵守以下条款：

-   **协议和版权通知**（这意味着，软件中必须包含许可证和版权声明的副本）
-   **状态更改说明**（如果您更改软件，您应当提供适当的说明）

除此之外，该软件：

-   **提供责任限制**（版权人声明不对使用者造成的任何损失负责）
-   **限制商标使用** (不能使用版权人的商标)
-   **不提供任何担保**（版权人声明不为该软件的品质提供任何担保）

进一步说明：

1. 本软件又叫本 **作品**，可以是源码，也可以是编译或转换后的其他形式。**衍生作品** 是在本作品的基础上修改后的有原创性的工作成果。本作品的 **贡献者** 包括许可人和其他提交了贡献的人，以下统称 **我**。
2. 我授予你权利：你可以免费复制、使用、修改、再许可、分发本作品及衍生作品（可以不用公开源码）。
3. 如果本软件涉及我的专利（或潜在专利），我在此授予你专利许可，你可以永久性地免费使用此专利，用于制作、使用、出售、转让本作品。如果你哪天居然告本作品侵权，你的专利许可在你告我那天被收回。
4. 你在复制和分发本作品或衍生作品时，要满足以下条件。

    - 带一份本许可证。
    - 如果你修改了什么，要在改动的文件中有明显的修改声明。
    - 如果你以源码形式分发，你必须保留本作品的版权、专利、商标和归属声明。
    - 如果本作品带了 **NOTICE** 文件，你就得带上 **NOTICE** 文件中包含的归属声明。即便你的发布是不带源码的，你也得带上此文件，并在作品某处予以展示。
    - 你可以对自己的修改添加版权说明。对于你的修改或者整个衍生作品，你可以使用不同的许可，但你对本作品的使用、复制和分发等，必须符合本许可证规定。

5. 你提交贡献就表明你默认遵守本许可的条款和条件。当然，你可以和我签订另外的专门的条款。
6. 你不许使用我的商品名、商标、服务标志或产品名。
7. 本作品是 **按原样**（AS IS）提供的，没有任何保证啊，你懂的。
8. 我可不负任何责任。除非我书面同意，或者法律有这样的要求（例如对故意和重大过失行为负责）。
9. 你可以向别人提供保证，你可以向别人收费，但那都是你的事，别给我惹麻烦。

注意以上的 **我**，既包含了许可人，也包含了每位 **贡献者**。
