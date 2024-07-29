import { yd_core_getTag } from './yd_core_getTag.js';
export const yd_is_boolean = (value) => {
    return value === true || value === false || yd_core_getTag(value) === '[object Boolean]';
};
