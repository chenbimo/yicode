// 是否有重复值
export const isUnique = (array) => {
    return new Set(array).size === array.length;
};
