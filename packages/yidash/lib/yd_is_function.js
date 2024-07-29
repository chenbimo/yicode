import { yd_core_getTag } from './yd_core_getTag.js';
export const yd_is_function = (value) => {
    const tag = yd_core_getTag(value);
    return tag === '[object Function]' || tag === '[object AsyncFunction]';
};
