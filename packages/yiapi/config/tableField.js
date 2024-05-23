// 字段类型
export const tableFieldConfig = {
    // 字符串型
    string: ['type', 'default', 'length', 'isIndex', 'isUnique'],
    // 文本型
    mediumText: ['type'],
    text: ['type'],
    bigText: ['type'],
    // 整型
    tinyInt: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned'],
    smallInt: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned'],
    mediumInt: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned'],
    int: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned'],
    bigInt: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned'],
    // 浮点型
    float: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned', 'precision', 'scale'],
    // 双精度型
    double: ['precision', 'scale']
};
