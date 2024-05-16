// 是否有重复值
export const fnIsUnique = (array) => {
    return new Set(array).size === array.length;
};
