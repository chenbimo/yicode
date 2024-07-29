export const yd_is_object = (variable) => {
    return variable !== null && typeof variable === 'object' && Object.prototype.toString.call(variable) === '[object Object]';
};
