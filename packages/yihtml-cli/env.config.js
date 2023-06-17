const path = require("path");
// yihtml 运行目录
const cliDir = path.resolve(__dirname);
// 项目根目录
const rootDir = process.cwd();
// 源码目录
const srcDir = path.resolve(rootDir, "src");
// 编译后打包目录
const distDir = path.resolve(rootDir, "dist");
// 下载项目模板临时目录
const tempDir = path.resolve(rootDir, "temp");
module.exports = {
    cliDir,
    rootDir,
    srcDir,
    distDir,
    tempDir,
};
