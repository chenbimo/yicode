# 网页浏览量

如果您需要显示超出 VS Code API 支持范围的自定义功能，您可以使用完全可自定义的 webviews。 重要的是要了解，只有在绝对需要时才应使用 Web 视图。

**✔️ 做**

-   仅在绝对必要时使用网络视图
-   仅在上下文合适时激活您的扩展
-   仅打开活动窗口的网络视图
-   确保视图中的所有元素均可主题化（请参阅 [webview-view-sample](https://github.com/microsoft/vscode-extension-samples/blob/main/webview-view-sample/media/main.js) css) 和 [颜色标记](https://code.visualstudio.com/api/references/theme-color) 文档)
-   确保您的视图遵循[辅助功能指南](https://code.visualstudio.com/docs/editor/accessibility)（颜色对比、ARIA 标签、键盘导航）
-   使用 [Webview UI Toolkit for Visual Studio Code](https://github.com/microsoft/vscode-webview-ui-toolkit) 使您的扩展与 VS Code 的样式、主题、行为和辅助功能特征保持一致。
-   在工具栏和视图中使用命令操作

❌ 不要

-   用于促销（升级、赞助商等）
-   用于向导
-   在每个窗口上打开
-   在扩展更新时打开（改为通过通知询问）
-   添加与编辑器或工作区无关的功能
-   重复现有功能（欢迎页面、设置、配置等）

## 网页视图示例

**简单的浏览器**

此扩展程序会在侧面打开编辑器的浏览器预览。

![Weview 示例 - 浏览器](https://static.yicode.tech/images/vscode-docs/examples/webview-browser.png)

_此示例显示了在 VS Code 内部开发的 VS Code Web。 Webview 面板用于呈现类似浏览器的窗口。_

**拉取请求**

此扩展在自定义树视图中显示工作区存储库的拉取请求，然后使用 Web 视图显示拉取请求的详细信息视图。

![Webview 示例 - Pull 请求](https://static.yicode.tech/images/vscode-docs/examples/webview-pull-request.png)

## Webview 视图

您还可以将 webview 放入任何视图容器（侧边栏或面板）中，这些元素称为 [webview 视图](https://code.visualstudio.com/api/references/vscode-api#WebviewView)。 相同的 webview 指南适用于 webview 视图。

![Webview视图](https://static.yicode.tech/images/vscode-docs/examples/webview-view.png)

_此 webview 视图显示用于创建使用下拉列表、输入和按钮的拉取请求的内容。_

## 链接

-   [Webview 扩展指南](https://code.visualstudio.com/api/extension-guides/webview)
-   [Webview 扩展示例](https://github.com/Microsoft/vscode-extension-samples/tree/main/webview-sample)
-   [Webview 视图扩展示例](https://github.com/microsoft/vscode-extension-samples/tree/main/webview-view-sample)
-   [适用于 Visual Studio Code 的 Webview UI 工具包](https://github.com/microsoft/vscode-webview-ui-toolkit)
