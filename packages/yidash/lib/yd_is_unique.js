// 是否有重复值
export const yd_is_unique = (array) => {
    return new Set(array).size === array.length;
};
