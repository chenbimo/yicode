// 获取资源
export function utilInternalAssets(name) {
    return new URL(`../assets/${name}`, import.meta.url).href;
}
