// 合并数据
export function utilMerge(...obj) {
    return mergeAny(..._.cloneDeep(obj));
}

export function utilGetAssets(name) {
    return new URL(`../assets/${name}`, import.meta.url).href;
}
