# Markdown 扩展

Markdown 扩展允许您扩展和增强 Visual Studio Code 的内置 Markdown 预览。 这包括更改预览的外观或添加对新 Markdown 语法的支持。

## 使用 CSS 更改 Markdown 预览的外观

扩展可以贡献 CSS 来更改 Markdown 预览的外观或布局。 样式表是使用扩展程序的"package.json"中的"markdown.previewStyles"[贡献点](https://code.visualstudio.com/api/references/contribution-points)注册的：

```json
"contributes": {
    "markdown.previewStyles": [
        "./style.css"
    ]
}
```

`"markdown.previewStyles"` 是相对于扩展根文件夹的文件列表。

贡献的样式添加在内置 Markdown 预览样式之后、用户的"markdown.styles"之前。

[Markdown Preview GitHub Styling](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-preview-github-styles) 扩展是一个很好的示例，它演示了如何使用样式表使 Markdown 预览看起来像 GitHub 的 渲染 Markdown。 您可以在 [GitHub](https://github.com/mjbvz/vscode-github-markdown-preview-style) 上查看扩展的源代码。

## 使用 markdown-it 插件添加对新语法的支持

VS Code Markdown 预览支持 [CommonMark 规范](https://spec.commonmark.org)。 扩展可以通过提供 [markdown-it 插件] 添加对其他 Markdown 语法的支持。](https://github.com/markdown-it/markdown-it#syntax-extensions)

要贡献一个 markdown-it 插件，首先在扩展的 `package.json` 中添加一个 `"markdown.markdownItPlugins"` 贡献：

```json
"contributes": {
    "markdown.markdownItPlugins": true
}
```

然后，在扩展的主"activation"函数中，返回一个具有名为"extendMarkdownIt"函数的对象。 此函数采用当前的 markdown-it 实例，并且必须返回一个新的 markdown-it 实例：

```ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    return {
        extendMarkdownIt(md: any) {
            return md.use(require('markdown-it-emoji'));
        }
    };
}
```

要贡献多个 markdown-it 插件，请返回链接在一起的多个"use"语句：

```ts
return md.use(require('markdown-it-emoji')).use(require('markdown-it-hashtag'));
```

当第一次显示 Markdown 预览时，提供 Markdown-it 插件的扩展会被延迟激活。

[markdown-emoji](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-emoji) 扩展演示了如何使用 markdown-it 插件向 Markdown 预览添加表情符号支持。 您可以在 [GitHub](https://github.com/mjbvz/vscode-markdown-emoji) 上查看表情符号扩展的源代码。

您可能还想查看：

-   针对 markdown-it 插件开发人员的 [指南](https://github.com/markdown-it/markdown-it/blob/master/docs/development.md)
-   [现有的 markdown-it 插件](https://www.npmjs.com/browse/keyword/markdown-it-plugin)

## 使用脚本添加高级功能

对于高级功能，扩展可以提供在 Markdown 预览中执行的脚本。

```json
"contributes": {
    "markdown.previewScripts": [
        "./main.js"
    ]
}
```

贡献的脚本是异步加载的，并在每次内容更改时重新加载。

[Markdown Preview Mermaid 支持](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) 扩展演示了如何使用脚本添加 [mermaid](https://knsv.github.io/mermaid/ index.html) 图表和流程图支持 Markdown 预览。 您可以在 [GitHub](https://github.com/mjbvz/vscode-markdown-mermaid) 上查看 Mermaid 扩展的源代码。
