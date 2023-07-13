# 网页扩展

Visual Studio Code 可以作为浏览器中的编辑器运行。 一个示例是在 GitHub 中浏览存储库或 Pull 请求时按"."（句点键）即可访问"github.dev"用户界面。 当 VS Code 在 Web 中使用时，安装的扩展将在浏览器中的扩展主机（称为"Web 扩展主机"）中运行。 可以在 Web 扩展主机中运行的扩展称为"Web 扩展"。

Web 扩展与常规扩展共享相同的结构，但考虑到不同的运行时，不要使用与为 Node.js 运行时编写的扩展相同的代码来运行。 Web 扩展仍然可以访问完整的 VS Code API，但不再可以访问 Node.js API 和模块加载。 相反，网络扩展受到浏览器沙箱的限制，因此与普通扩展相比具有[限制](#web-extension-main-file)。

VS Code 桌面版也支持 Web 扩展运行时。 如果您决定将扩展程序创建为 Web 扩展程序，则 [VS Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) 将支持该扩展程序（包括"vscode.dev"） 和 `github.dev`）以及桌面上和 [GitHub Codespaces](https://code.visualstudio.com/docs/remote/codespaces) 等服务中。

## Web 扩展剖析

Web 扩展[结构类似于常规扩展](https://code.visualstudio.com/api/get-started/extension-anatomy)。 扩展清单（`package.json`）定义扩展源代码的入口文件并声明扩展贡献。

对于 Web 扩展，[主入口文件](#web-extension-main-file) 由"browser"属性定义，而不是像常规扩展那样由"main"属性定义。

"contributes" 属性对于 Web 扩展和常规扩展的工作方式相同。

下面的示例显示了一个简单的 hello world 扩展的"package.json"，该扩展仅在 Web 扩展主机中运行（它只有一个"浏览器"入口点）：

```json
{
    "name": "helloworld-web-sample",
    "displayName": "helloworld-web-sample",
    "description": "HelloWorld example for VS Code in the browser",
    "version": "0.0.1",
    "publisher": "vscode-samples",
    "repository": "https://github.com/microsoft/vscode-extension-samples/helloworld-web-sample",
    "engines": {
        "vscode": "^1.74.0"
    },
    "categories": ["Other"],
    "activationEvents": [],
    "browser": "./dist/web/extension.js",
    "contributes": {
        "commands": [
            {
                "command": "helloworld-web-sample.helloWorld",
                "title": "Hello World"
            }
        ]
    },
    "scripts": {
        "vscode:prepublish": "npm run package-web",
        "compile-web": "webpack",
        "watch-web": "webpack --watch",
        "package-web": "webpack --mode production --devtool hidden-source-map"
    },
    "devDependencies": {
        "@types/vscode": "^1.59.0",
        "ts-loader": "^9.2.2",
        "webpack": "^5.38.1",
        "webpack-cli": "^4.7.0",
        "@types/webpack-env": "^1.16.0",
        "process": "^0.11.10"
    }
}
```

> **注意**：如果您的扩展面向 1.74 之前的 VS Code 版本，则必须在 `activationEvents` 中显式列出 `onCommand:helloworld-web-sample.helloWorld`。

仅具有"主"入口点但没有"浏览器"的扩展不是 Web 扩展。 它们会被 Web 扩展主机忽略，并且无法在扩展视图中下载。

![扩展视图](https://static.yicode.tech/images/vscode-docs/web-extensions/extensions-view-item-disabled.png)

仅具有声明性贡献的扩展（仅"contributes"，没有"main"或"browser"）可以是 Web 扩展。 它们可以在 [VS Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) 中安装和运行，无需扩展作者进行任何修改。 具有声明性贡献的扩展示例包括主题、语法和片段。

扩展可以同时具有"浏览器"和"主"入口点，以便在浏览器和 Node.js 运行时中运行。 [将现有扩展更新为 Web 扩展](#update-existing-extensions-to-web-extensions) 部分展示了如何迁移扩展以在两个运行时中工作。

[Web 扩展启用](#web-extension-enablement) 部分列出了用于决定扩展是否可以在 Web 扩展主机中加载的规则。

### Web 扩展主文件

Web 扩展的主文件由"browser"属性定义。 该脚本在 [浏览器 WebWorker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API) 环境中的 Web 扩展主机中运行。 它受到浏览器工作沙箱的限制，并且与 Node.js 运行时中运行的普通扩展相比具有局限性。

-   不支持导入或要求其他模块。 `importScripts` 也不可用。 因此，代码必须打包到单个文件中。
-   [VS Code API](https://code.visualstudio.com/api/references/vscode-api) 可以通过模式 `require('vscode')` 加载。 这将起作用，因为有一个用于"require"的垫片，但该垫片不能用于加载其他扩展文件或其他节点模块。 它仅适用于"require('vscode')"。
-   Node.js 全局变量和库（例如"process"、"os"、"setImmediate"、"path"、"util"、"url"）在运行时不可用。 但是，可以使用 webpack 等工具添加它们。 [webpack 配置](#webpack-configuration) 部分解释了这是如何完成的。
-   打开的工作区或文件夹位于虚拟文件系统上。 访问工作区文件需要通过 VS Code [文件系统](https://code.visualstudio.com/api/references/vscode-api#FileSystem) API，可通过"vscode.workspace.fs"访问。
-   [扩展上下文](https://code.visualstudio.com/api/references/vscode-api#ExtensionContext) 位置 (`ExtensionContext.extensionUri`) 和存储位置 (`ExtensionContext.storageUri`、`globalStorageUri`) 也是 在虚拟文件系统上，需要通过"vscode.workspace.fs"。
-   要访问网络资源，必须使用[Fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API) API。 访问的资源需要支持【跨域资源共享】(https://developer.mozilla.org/docs/Web/HTTP/CORS) (CORS)
-   无法创建子进程或运行可执行文件。 但是，可以通过 [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) API 创建 Web Worker。 这用于运行语言服务器，如 [Web 扩展中的语言服务器协议](#language-server-protocol-in-web-extensions) 部分所述。
-   与常规扩展一样，扩展的"激活/停用"功能需要通过"exports.activate = ..."模式导出。

## 开发一个网络扩展

值得庆幸的是，像 TypeScript 和 webpack 这样的工具可以隐藏许多浏览器运行时限制，并允许您像常规扩展一样编写 Web 扩展。 Web 扩展和常规扩展通常可以从相同的源代码生成。

例如，由 `yo code` [generator](https://www.npmjs.com/package/generator-code) 创建的 `Hello Web Extension` 仅在构建脚本上有所不同。 您可以像传统 Node.js 扩展一样运行和调试生成的扩展，方法是使用提供的启动配置（可使用 **调试：选择并开始调试** 命令访问）。

## 创建一个网络扩展

要构建新的 Web 扩展，请使用"yo code"并选择"新 Web 扩展"。 确保安装了最新版本的 [generator-code](https://www.npmjs.com/package/generator-code) (>=generator-code@1.6)。 要更新生成器和 yo，请运行"npm i -g yo 生成器代码"。

创建的扩展由扩展的源代码（显示 hello world 通知的命令）、package.json 清单文件和 webpack 配置文件组成。

-   `src/web/extension.ts` 是扩展的入口源代码文件。 它与常规的 hello 扩展相同。
-   `package.json` 是扩展清单。
    -   它使用"browser"属性指向入口文件。
    -   它提供了脚本：`compile-web`、`watch-web` 和 `package-web` 来编译、监视和打包。
-   `webpack.config.js` 是 webpack 配置文件，它将扩展源编译并捆绑到单个文件中。
-   `.vscode/launch.json` 包含运行 Web 扩展的启动配置以及使用 Web 扩展主机在 VS Code 桌面中进行的测试（不再需要设置 `extensions.webWorker`）。
-   `.vscode/task.json` 包含启动配置使用的构建任务。 它使用"npm run watch-web"并依赖于 webpack 特定的"ts-webpack-watch"问题匹配器。
-   `.vscode/extensions.json` 包含提供问题匹配器的扩展。 需要安装这些扩展才能使启动配置发挥作用。
-   `tsconfig.json` 定义与 `webworker` 运行时匹配的编译选项。

[helloworld-web-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-web-sample) 中的源代码与生成器创建的代码类似。

### Webpack 配置

webpack 配置文件是由 `yo code` 自动生成的。 它将扩展中的源代码捆绑到单个 JavaScript 文件中，以加载到 Web 扩展主机中。

[webpack.config.js](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-web-sample/webpack.config.js)

```js
const path = require('path');
const webpack = require('webpack');

/** @typedef {import('webpack').Configuration} WebpackConfig **/
/** @type WebpackConfig */
const webExtensionConfig = {
    mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
    target: 'webworker', // extensions run in a webworker context
    entry: {
        extension: './src/web/extension.ts', // source of the web extension main file
        'test/suite/index': './src/web/test/suite/index.ts' // source of the web extension test runner
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, './dist/web'),
        libraryTarget: 'commonjs',
        devtoolModuleFilenameTemplate: '../../[resource-path]'
    },
    resolve: {
        mainFields: ['browser', 'module', 'main'], // look for `browser` entry point in imported node modules
        extensions: ['.ts', '.js'], // support ts-files and js-files
        alias: {
            // provides alternate implementation for node module and source files
        },
        fallback: {
            // Webpack 5 no longer polyfills Node.js core modules automatically.
            // see https://webpack.js.org/configuration/resolve/#resolvefallback
            // for the list of Node.js core module polyfills.
            assert: require.resolve('assert')
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser' // provide a shim for the global `process` variable
        })
    ],
    externals: {
        vscode: 'commonjs vscode' // ignored because it doesn't exist
    },
    performance: {
        hints: false
    },
    devtool: 'nosources-source-map' // create a source map that points to the original source file
};
module.exports = [webExtensionConfig];
```

`webpack.config.js` 的一些重要字段是：

-   "entry"字段包含扩展和测试套件的主要入口点。
    -   您可能需要调整此路径以适当地指向扩展的入口点。
    -   对于现有扩展，您可以首先将此路径指向您当前用于"package.json"的"main"的文件。
    -   如果您不想打包测试，则可以省略测试套件字段。
-   `output` 字段指示编译文件的位置。
    -   `[name]` 将被替换为 `entry` 中使用的密钥。 因此，在生成的配置文件中，它将生成 `dist/web/extension.js` 和 `dist/web/test/suite/index.js`。
-   `target` 字段指示编译后的 JavaScript 文件将运行的环境类型。 对于网络扩展，您希望它是"webworker"。
-   "resolve"字段包含为在浏览器中不起作用的节点库添加别名和后备的功能。
    -   如果您使用像"path"这样的库，您可以指定如何在网络编译上下文中解析"path"。 例如，您可以指向项目中使用"path: path.resolve(\_\_dirname, 'src/my-path-implementation-for-web.js')"定义"path"的文件。 或者，您可以使用名为"path-browserify"的 Browserify 节点打包版本的库，并指定"path: require.resolve('path-browserify')"。
    -   有关 Node.js 核心模块 polyfill 的列表，请参阅 [webpack resolve.fallback](https://webpack.js.org/configuration/resolve/#resolvefallback)。
-   `plugins` 部分使用 [DefinePlugin 插件](https://webpack.js.org/plugins/define-plugin/) 来填充全局变量，例如 `process` Node.js 全局变量。

## 测试你的网络扩展

目前，在将 Web 扩展发布到 Marketplace 之前，可以通过三种方法对其进行测试。

-   使用在桌面上运行的 VS Code 以及"--extensionDevelopmentKind=web"选项，在 VS Code 中运行的 Web 扩展主机中运行 Web 扩展。
-   使用 [@vscode/test-web](https://github.com/microsoft/vscode-test-web) 节点模块打开包含 VS Code for the Web 的浏览器，其中包括从本地服务器提供的扩展。
-   [Sideload](#test-your-web-extension-in-on-vscode.dev) 将您的扩展加载到 [vscode.dev](https://vscode.dev) 以在实际环境中查看您的扩展。

### 在桌面上运行的 VS Code 中测试您的 Web 扩展

为了使用现有的 VS Code 扩展开发体验，在桌面上运行的 VS Code 支持运行 Web 扩展主机以及常规 Node.js 扩展主机。

使用 **New Web Extension** 生成器提供的 `pwa-extensionhost` 启动配置：

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Run Web Extension in VS Code",
            "type": "pwa-extensionHost",
            "debugWebWorkerHost": true,
            "request": "launch",
            "args": ["--extensionDevelopmentPath=${workspaceFolder}", "--extensionDevelopmentKind=web"],
            "outFiles": ["${workspaceFolder}/dist/web/**/*.js"],
            "preLaunchTask": "npm: watch-web"
        }
    ]
}
```

它使用任务"npm: watch-web"通过调用"npm run watch-web"来编译扩展。 该任务预计在"tasks.json"中：

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "type": "npm",
            "script": "watch-web",
            "group": "build",
            "isBackground": true,
            "problemMatcher": ["$ts-webpack-watch"]
        }
    ]
}
```

`$ts-webpack-watch` 是一个问题匹配器，可以解析 webpack 工具的输出。 它由 [TypeScript + Webpack Problem Matchers](https://marketplace.visualstudio.com/items?itemName=eamodio.tsl-problem-matcher) 扩展提供。

在启动的 **扩展开发主机** 实例中，Web 扩展将可用并在 Web 扩展主机中运行。 运行"Hello World"命令来激活扩展。

打开 **正在运行的扩展** 视图（命令：**开发人员：显示正在运行的扩展**）以查看 Web 扩展主机中正在运行哪些扩展。

### 使用 @vscode/test-web 在浏览器中测试您的 Web 扩展

[@vscode/test-web](https://github.com/microsoft/vscode-test-web) 节点模块提供 CLI 和 API 来在浏览器中测试 Web 扩展。

Node 模块提供了一个 npm 二进制文件 `vscode-test-web`，它可以从命令行打开 VS Code for the Web：

-   它将 VS Code 的 Web 位下载到 `.vscode-test-web` 中。
-   在 `localhost:3000` 上启动本地服务器。
-   打开浏览器（Chromium、Firefox 或 Webkit）。

您可以从命令行运行它：

```bash
npx @vscode/test-web --extensionDevelopmentPath=$extensionFolderPath $testDataPath
```

Or better, add `@vscode/test-web` as a development dependency to your extension and invoke it in a script:

```json
  "devDependencies": {
    "@vscode/test-web": "*"
  },
  "scripts": {
    "open-in-browser": "vscode-test-web --extensionDevelopmentPath=. ."
  }
```

检查 [@vscode/test-web 自述文件](https://www.npmjs.com/package/@vscode/test-web) 了解更多 CLI 选项：

| 选项                 | 参数说明                                                                                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --浏览器类型         | 要启动的浏览器："chromium"（默认）、"firefox"或"webkit"                                                                                                                                                 |
| --扩展开发路径       | 指向要包含的正在开发的扩展的路径。                                                                                                                                                                      |
| --extensionTestsPath | 扩展测试路径 要运行的测试模块的路径。                                                                                                                                                                   |
| --许可               | 授予打开的浏览器的权限：例如 `clipboard-read`、`clipboard-write`。<br>请参阅[完整选项列表](https://playwright.dev/docs/api/class-browsercontext#browser-context-grant-permissions)。 参数可以多次提供。 |
| --文件夹-uri         | 用于打开 VS Code 的工作区的 URI。 提供"folderPath"时被忽略                                                                                                                                              |
| --扩展路径           | 指向包含其他扩展名的文件夹的路径。<br>可以多次提供参数。                                                                                                                                                |
| 文件夹路径           | 用于打开 VS Code 的本地文件夹。<br>该文件夹内容将作为虚拟文件系统提供并作为工作区打开。                                                                                                                 |

VS Code 的 Web 部分被下载到文件夹".vscode-test-web"。 您想将其添加到".gitignore"文件中。

### 在 vscode.dev 中测试您的 Web 扩展

在发布扩展以供所有人在 VS Code 网页版上使用之前，您可以验证您的扩展在实际 [vscode.dev](https://vscode.dev) 环境中的行为方式。

要在 vscode.dev 上查看您的扩展，您首先需要从您的计算机托管它，以便 vscode.dev 下载并运行。

首先，您需要[安装`mkcert`](https://github.com/FiloSottile/mkcert#installation)。

然后，将"localhost.pem"和"localhost-key.pem"文件生成到不会丢失的位置（例如"$HOME/certs"）：

```bash
$ mkdir -p $HOME/certs
$ cd $HOME/certs
$ mkcert -install
$ mkcert localhost
```

然后，从扩展程序的路径中，通过运行"npxserve"启动 HTTP 服务器：

```bash
$ npx serve --cors -l 5000 --ssl-cert $HOME/certs/localhost.pem --ssl-key $HOME/certs/localhost-key.pem
npx: installed 78 in 2.196s

  ┌────────────────────────────────────────────────────┐
  │                                                    │
  │   Serving!                                         │
  │                                                    │
  │   - Local:            https://localhost:5000       │
  │   - On Your Network:  https://172.19.255.26:5000   │
  │                                                    │
  │   Copied local address to clipboard!               │
  │                                                    │
  └────────────────────────────────────────────────────┘
```

最后，打开 [vscode.dev](https://vscode.dev)，从命令面板 (`kb(workbench.action.showCommands)`) 运行 **Developer: Install Extension From Location...**，粘贴 上面的 URL，示例中为"https://localhost:5000"，然后选择"**安装**"。

**检查日志**

您可以在浏览器的开发人员工具控制台中检查日志，以查看扩展程序中的任何错误、状态和日志。

您可能会看到 vscode.dev 本身的其他日志。 此外，您无法轻松设置断点，也无法查看扩展的源代码。 这些限制使得在 vscode.dev 中进行调试并不是最愉快的体验，因此我们建议在侧载到 vscode.dev 之前使用前两个选项进行测试。 在发布扩展之前，旁加载是一个很好的最终健全性检查。

## Web 扩展测试

支持 Web 扩展测试，并且可以像常规扩展测试一样实现。 请参阅[测试扩展](https://code.visualstudio.com/api/working-with-extensions/testing-extension)文章了解扩展测试的基本结构。

[@vscode/test-web](https://github.com/microsoft/vscode-test-web) 节点模块相当于 [@vscode/test- Electron](https://github.com/microsoft /vscode-test)（以前名为"vscode-test"）。 它允许您在 Chromium、Firefox 和 Safari 上从命令行运行扩展测试。

该实用程序执行以下步骤：

1. 从本地 Web 服务器启动 Web 编辑器的 VS Code。
2. 打开指定的浏览器。
3. 运行提供的测试运行程序脚本。

您可以在连续构建中运行测试，以确保扩展程序适用于所有浏览器。

测试运行程序脚本在 Web 扩展主机上运行，具有与 [Web 扩展主文件](#web-extension-main-file) 相同的限制：

-   所有文件都捆绑到一个文件中。 它应该包含测试运行程序（例如，Mocha）和所有测试（通常为"\*.test.ts"）。
-   仅支持 `require('vscode')`。

由 `yo code` Web 扩展生成器创建的 [webpack 配置](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-web-sample/webpack.config.js) 有一个测试部分。 它期望测试运行器脚本位于"./src/web/test/suite/index.ts"。 提供的[测试运行脚本](https://github.com/microsoft/vscode-extension-samples/blob/main/helloworld-web-sample/src/web/test/suite/index.ts)使用网络版本 Mocha 并包含特定于 webpack 的语法来导入所有测试文件。

```ts
require('mocha/mocha'); // import the mocha web build

export function run(): Promise<void> {
    return new Promise((c, e) => {
        mocha.setup({
            ui: 'tdd',
            reporter: undefined
        });

        // bundles all files in the current directory matching `*.test`
        const importAll = (r: __WebpackModuleApi.RequireContext) => r.keys().forEach(r);
        importAll(require.context('.', true, /\.test$/));

        try {
            // Run the mocha test
            mocha.run((failures) => {
                if (failures > 0) {
                    e(new Error(`${failures} tests failed.`));
                } else {
                    c();
                }
            });
        } catch (err) {
            console.error(err);
            e(err);
        }
    });
}
```

要从命令行运行 Web 测试，请将以下内容添加到 `package.json` 并使用 `npm test` 运行它。

```json
  "devDependencies": {
    "@vscode/test-web": "*"
  },
  "scripts": {
    "test": "vscode-test-web --extensionDevelopmentPath=. --extensionTestsPath=dist/web/test/suite/index.js"
  }
```

要在包含测试数据的文件夹上打开 VS Code，请将本地文件夹路径 (`folderPath`) 作为最后一个参数传递。

要在 VS Code (Insiders) 桌面中运行（和调试）扩展测试，请使用"VS Code 中的扩展测试"启动配置：

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Extension Tests in VS Code",
            "type": "extensionHost",
            "debugWebWorkerHost": true,
            "request": "launch",
            "args": ["--extensionDevelopmentPath=${workspaceFolder}", "--extensionDevelopmentKind=web", "--extensionTestsPath=${workspaceFolder}/dist/web/test/suite/index"],
            "outFiles": ["${workspaceFolder}/dist/web/**/*.js"],
            "preLaunchTask": "npm: watch-web"
        }
    ]
}
```

## 发布网络扩展

Web 扩展与其他扩展一起托管在 [Marketplace](https://marketplace.visualstudio.com/vscode) 上。

确保使用最新版本的"vsce"来发布您的扩展。 `vsce` 标记所有属于 Web 扩展的扩展。 为此，"vsce"使用 [Web 扩展启用](#web-extension-enablement) 部分中列出的规则。

## 将现有扩展更新为 Web 扩展

### 没有代码的扩展

没有代码、只有贡献点的扩展（例如主题、片段和基本语言扩展）不需要任何修改。 它们可以在 Web 扩展主机中运行，并且可以从扩展视图安装。

不需要重新发布，但在发布新版本的扩展时，请确保使用最新版本的"vsce"。

### 使用代码迁移扩展

带有源代码的扩展（由 `main` 属性定义）需要提供一个 [web 扩展主文件](#web-extension-main-file) 并在 `package.json` 中设置 `browser` 属性。

使用以下步骤为浏览器环境重新编译扩展代码：

-   添加一个 webpack 配置文件，如 [webpack 配置](#webpack-configuration) 部分所示。 如果您已经有 Node.js 扩展代码的 webpack 文件，则可以为 web 添加一个新部分。 查看 [vscode-css-formatter](https://github.com/aeschli/vscode-css-formatter/blob/master/webpack.config.js) 作为示例。
-   添加 `launch.json` 和 `tasks.json` 文件，如 [测试您的 Web 扩展](#test-your-web-extension) 部分所示。
-   在 webpack 配置文件中，将输入文件设置为现有的 Node.js 主文件或为 Web 扩展创建一个新的主文件。
-   在"package.json"中，添加"浏览器"和"脚本"属性，如 [Web 扩展解剖](#web-extension-anatomy) 部分所示。
-   运行"npm runcompile-web"来调用 webpack 并查看需要在哪里工作才能使您的扩展在网络中运行。

为了确保尽可能多的源代码可以被重用，这里有一些技巧：

-   要填充 Node.js 核心模块（例如"path"），请向 [resolve.fallback](https://webpack.js.org/configuration/resolve/#resolvefallback) 添加一个条目。
-   要提供 Node.js 全局（例如"process"），请使用 [DefinePlugin 插件](https://webpack.js.org/plugins/define-plugin)。
-   使用可在浏览器和节点运行时运行的节点模块。 节点模块可以通过定义"browser"和"main"入口点来做到这一点。 Webpack 将自动使用与其目标匹配的那个。 执行此操作的节点模块示例包括 [request-light](https://github.com/microsoft/node-request-light) 和 [vscode-nls](https://github.com/Microsoft/vscode-nls) ）。
-   要为节点模块或源文件提供替代实现，请使用 [resolve.alias](https://webpack.js.org/configuration/resolve/#resolvealias)。
-   将代码分为浏览器部分、Node.js 部分和公共部分。 通常，仅使用可在浏览器和 Node.js 运行时运行的代码。 为在 Node.js 和浏览器中具有不同实现的功能创建抽象。
-   注意"path"、"URI.file"、"context.extensionPath"、"rootPath"的用法。 `uri.fsPath`。 这些不适用于虚拟工作区（非文件系统），因为它们在 VS Code for the Web 中使用。 而是使用带有"URI.parse"、"context.extensionUri"的 URI。 [vscode-uri](https://www.npmjs.com/package/vscode-uri) 节点模块提供 `joinPath`、`dirName`、`baseName`、`extName`、`resolvePath`。
-   注意"fs"的用法。 使用 vscode `workspace.fs` 替换。

当您的扩展程序在网络中运行时，提供较少的功能是可以的。 使用 [when 子句上下文](https://code.visualstudio.com/api/references/when-clause-contexts) 来控制在 Web 上的虚拟工作区中运行时哪些命令、视图和任务可用或隐藏。

-   使用"virtualWorkspace"上下文变量来查明当前工作空间是否是非文件系统工作空间。
-   使用`resourceScheme`检查当前资源是否是`file`资源。
-   如果存在平台 shell，请使用"shellExecutionSupported"。
-   实施替代命令处理程序，显示一个对话框来解释该命令不适用的原因。

WebWorkers 可以用作分叉流程的替代方案。 我们更新了多种语言服务器以作为 Web 扩展运行，包括内置的 [JSON](https://github.com/microsoft/vscode/tree/main/extensions/json-language-features)、[CSS]( https://github.com/microsoft/vscode/tree/main/extensions/css-language-features）和[HTML]（https://github.com/microsoft/vscode/tree/main/extensions/html- 语言特征）语言服务器。 下面的[语言服务器协议](#language-server-protocol-in-web-extensions)部分提供了更多详细信息。

浏览器运行环境仅支持 JavaScript 和[WebAssembly](https://webassemble.org/)的执行。 用其他编程语言编写的库需要交叉编译，例如有工具可以编译 [C/C++](https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm) 和 [Rust] (https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm) 到 WebAssembly。 例如，[vscode-anycode](https://github.com/microsoft/vscode-anycode)扩展使用[tree-sitter](https://www.npmjs.com/package/tree-sitter)， 这是编译为 WebAssembly 的 C/C++ 代码。

### Web 扩展中的语言服务器协议

[vscode-languageserver-node](https://github.com/Microsoft/vscode-languageserver-node) 是 [语言服务器协议](https://microsoft.github.io/language-server-protocol) 的实现 ) (LSP)，用作语言服务器实现的基础，例如 [JSON](https://github.com/microsoft/vscode/tree/main/extensions/json-language-features)、[CSS](https ://github.com/microsoft/vscode/tree/main/extensions/css-language-features）和[HTML]（https://github.com/microsoft/vscode/tree/main/extensions/html-language -特征）。

从 3.16.0 开始，客户端和服务器现在也提供了浏览器实现。 服务器可以在 Web Worker 中运行，并且连接基于 WebWorkers `postMessage` 协议。

浏览器的客户端可以在"vscode-languageclient/browser"中找到：

```typescript
import { LanguageClient } from `vscode-languageclient/browser`
```

服务器位于"vscode-languageserver/browser"。

[lsp-web-extension-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-web-extension-sample) 展示了其工作原理。

## Web 扩展启用

如果满足以下条件，VS Code 会自动将扩展视为 Web 扩展：

-   扩展清单 (`package.json`) 具有 `browser` 入口点。
-   扩展清单没有"main"入口点，也没有以下贡献点："localizations"、"debuggers"、"terminal"、"typescriptServerPlugins"。

如果扩展想要提供也在 Web 扩展主机中工作的调试器或终端，则需要定义"浏览器"入口点。

## 示例

-   [helloworld-web-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/helloworld-web-sample)
-   [lsp-web-extension-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-web-extension-sample)
