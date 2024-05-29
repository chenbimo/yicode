import { isObject } from '../utils/isObject.js';

export const fnSchema = (field) => {
    if (!field) {
        throw new Error('字段格式错误');
    }
    const params = {
        title: field.name
    };
    const schema = field.schema;
    if (schema.type === 'string') {
        if (schema.default !== undefined) {
            params.default = schema.default;
        }
        if (schema.min !== undefined) {
            params.minLength = schema.min;
        }
        if (schema.max !== undefined) {
            params.maxLength = schema.max;
        }
        if (schema.enum !== undefined) {
            params.enum = schema.enum;
        }
        if (schema.pattern !== undefined) {
            params.pattern = schema.pattern;
        }
    }
    if (schema.type === 'integer' || schema.type === 'number') {
        if (schema.default !== undefined) {
            params.default = schema.default;
        }
        if (schema.min !== undefined) {
            params.minimum = schema.min;
        }
        if (schema.max !== undefined) {
            params.maximum = schema.max;
        }
        if (schema.enum !== undefined) {
            params.enum = schema.enum;
        }
        if (schema.multipleOf !== undefined) {
            params.multipleOf = schema.multipleOf;
        }
    }
    if (schema.type === 'array') {
        if (schema.default !== undefined) {
            params.default = schema.default;
        }
        if (schema.min !== undefined) {
            params.minItems = schema.min;
        }
        if (schema.max !== undefined) {
            params.maxItems = schema.max;
        }
        if (schema.items !== undefined) {
            params.items = schema.items;
        }
        if (schema.isUnique !== undefined) {
            params.uniqueItems = schema.isUnique;
        }
        if (schema.isAdditional !== undefined) {
            params.additionalItems = schema.isAdditional;
        }
    }

    return params;
};
