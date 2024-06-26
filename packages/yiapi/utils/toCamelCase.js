import { toCapitalize } from './toCapitalize.js';

const camel = (str) => {
    const parts =
        str
            ?.replace(/([A-Z])+/g, toCapitalize)
            ?.split(/(?=[A-Z])|[\.\-\s_]/)
            .map((x) => x.toLowerCase()) ?? [];
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    return parts.reduce((acc, part) => {
        return `${acc}${part.charAt(0).toUpperCase()}${part.slice(1)}`;
    });
};

// 转换成小驼峰
export function toCamelCase(value, delimiter = '/') {
    if (value === undefined || value === null || value === '') return value;
    const data = value
        .split(delimiter)
        .map((v) => camel(v))
        .join(delimiter);
    return data;
}
