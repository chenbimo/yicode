let _ = require("lodash");
let path = require("path");
let envConfig = require("./env.config.js");
let commonParams = {
    env: {
        stylelint: true,
    },
    // js压缩参数
    uflify: {
        compress: {
            drop_console: false,
            drop_debugger: false,
            conditionals: false,
        },
        output: {
            wrap_iife: true,
        },
    },
    // postcss参数
    postcss: [],
    // 样式验证
    stylelint: {},
    // 响应式配置
    px2viewport: {
        unitToConvert: "px",
        viewportWidth: 750,
        unitPrecision: 5,
        propList: ["*"],
        viewportUnit: "vw",
        fontViewportUnit: "vw",
        selectorBlackList: [],
        minPixelValue: 1,
        mediaQuery: false,
        replace: true,
        exclude: undefined,
        include: undefined,
        landscape: false,
        landscapeUnit: "vw",
        landscapeWidth: 568,
    },
    // babel参数
    babel: {
        presets: [
            [
                path.resolve(envConfig.cliDir, "node_modules", "@babel", "preset-env"),
                {
                    useBuiltIns: "usage",
                    corejs: "3",
                },
            ],
        ],
        plugins: [
            [
                path.resolve(envConfig.cliDir, "node_modules", "@babel", "plugin-transform-runtime"),
                {
                    absoluteRuntime: false,
                    corejs: 3,
                    helpers: true,
                    regenerator: true,
                    useESModules: false,
                },
            ],
        ],
    },
    // sass参数
    sass: {
        outputStyle: "expanded",
    },
    gulp: {
        // src参数
        src: {
            allowEmpty: true,
        },
    },

    // html压缩参数
    yueHtmlMin: {
        // 区分大小写
        caseSensitive: true,
        // selected="selected" => selected
        collapseBooleanAttributes: true,
        // 行内元素间不要留任何空格
        collapseInlineTagWhitespace: true,
        // 是否去除html元素间的空白
        collapseWhitespace: true,
        // 是否永远留一个空白
        conservativeCollapse: false,
        continueOnParseError: false,
    },
};
let buildParams = {
    uflify: {
        compress: {
            drop_console: true,
            drop_debugger: true,
            conditionals: true,
        },
    },
    // sass参数
    sass: {
        outputStyle: "compressed",
    },
};
if (process.env.compress === "false") {
    buildParams.sass.outputStyle = "expanded";
}
let devParams = {};
if (process.env.NODE_MODE === "build") {
    commonParams = _.merge(commonParams, buildParams);
}
if (process.env.NODE_MODE === "dev") {
    commonParams = _.merge(commonParams, devParams);
}

module.exports = commonParams;
