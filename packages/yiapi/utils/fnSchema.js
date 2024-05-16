/**
 * 数字参数协议
 * @param {String} field 预置字段
 * @param {String} title 参数名称
 * @param {String} type 参数类型
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @param {Number} defaultValue 默认值
 * @param {Array} enumValue 枚举值
 * @param {Number|Integer|String} extraValue 扩展值
 * @param {Boolean} uniqueItems 数组类型时，值是否唯一
 * @returns Object
 */
export const fnSchema = (field, title, type, min, max, defaultValue, enumValue, extraValue, uniqueItems) => {
    try {
        // 获取已经存在的公共配置参数
        let fieldData = fnCloneAny(field || {});

        // 字段协议必须填写名称
        if (!_isEmpty(title)) fieldData.title = title;
        if (!_isEmpty(type)) fieldData.type = type;

        // 如果有枚举参数，则忽略最大，最小参数
        if (_isArray(enumValue)) {
            fieldData.enum = enumValue;
        } else {
            if (type === 'number') {
                // 最大最小值覆盖
                if (_isNumber(min)) fieldData.minimum = min;
                if (_isNumber(max)) fieldData.maximum = max;

                // 倍数值覆盖
                if (_isNumber(multipleOf)) fieldData.multipleOf = extraValue;
            }

            if (type === 'integer') {
                // 最大最小值覆盖
                if (_isInteger(min)) fieldData.minimum = min;
                if (_isInteger(max)) fieldData.maximum = max;
                // 倍数值覆盖
                if (_isNumber(extraValue)) fieldData.multipleOf = extraValue;
            }

            if (type === 'string') {
                // 最大最小值覆盖
                if (_isInteger(min)) fieldData.minLength = min;
                if (_isInteger(max)) fieldData.maxLength = max;
                // 字符模式
                if (_isString(extraValue)) fieldData.pattern = extraValue;
            }

            if (type === 'array') {
                // 最大最小值覆盖
                if (_isInteger(min)) fieldData.minItems = min;
                if (_isInteger(max)) fieldData.maxItems = max;
                // 字符模式
                if (_isString(extraValue)) {
                    if (['number', 'integer', 'string'].includes(extraValue) === true) {
                        fieldData.items = {
                            type: extraValue
                        };
                    } else {
                        fieldData.items = extraValue.split('|').map((value) => {
                            if (['number', 'integer', 'string'].includes(value) === true) {
                                return {
                                    type: value
                                };
                            } else {
                                return {
                                    enum: value.split(',').filter((v) => v)
                                };
                            }
                        });
                    }
                }
            }
        }

        // 默认值覆盖
        if (_isNumber(defaultValue)) fieldData.default = defaultValue;

        return fieldData;
    } catch (err) {
        throw new Error(err);
    }
};
