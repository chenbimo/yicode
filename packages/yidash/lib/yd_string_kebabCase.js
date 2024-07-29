import { yd_string_capitalize } from './yd_string_capitalize.js';

const kebab = (str) => {
    const parts =
        str
            ?.replace(/([A-Z])+/g, toCapitalize)
            ?.split(/(?=[A-Z])|[\.\-\s_]/)
            .map((x) => x.toLowerCase()) ?? [];
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    return parts.reduce((acc, part) => {
        return `${acc}-${part.toLowerCase()}`;
    });
};

// 转换成中划线
export const yd_string_kebabCase = (value, delimiter = '/') => {
    if (value === undefined || value === null || value === '') return value;
    const data = value
        .split(delimiter)
        .map((v) => kebab(v))
        .join(delimiter);
    return data;
};
