// 转换成中划线
export function toKebabCase(value, delimiter = '/') {
    if (value === undefined || value === null || value === '') return value;
    const data = value
        .split(delimiter)
        .map((v) => _kebabCase(v))
        .join(delimiter);
    return data;
}
