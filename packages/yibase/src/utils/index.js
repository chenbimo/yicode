export const utilGetAssets = (name) => {
    return new URL(`../assets/${name}`, import.meta.url).href;
};
