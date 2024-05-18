// 是否有重复值
export const toUnique = (array) => {
    return new Set(array).size === array.length;
};
