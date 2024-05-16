// 转换成小驼峰
export function toCamelCase(value, delimiter = '/') {
    if (value === undefined || value === null || value === '') return value;
    const data = value
        .split(delimiter)
        .map((v) => _camelCase(v))
        .join(delimiter);
    return data;
}
