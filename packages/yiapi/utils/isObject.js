export const isObject = (variable) => {
    return variable !== null && typeof variable === 'object' && Object.prototype.toString.call(variable) === '[object Object]';
};
