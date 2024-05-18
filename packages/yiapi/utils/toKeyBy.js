// 根据某个字段映射
export const toKeyBy = (arrs, field) => {
    const keyByObj = {};
    arrs.forEach((item) => {
        keyByObj[item[field]] = item;
    });
    return keyByObj;
};
