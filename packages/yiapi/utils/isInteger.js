export const isInteger = (value) => {
    return Number.isInteger(value) && Object.prototype.toString.call(value) === '[object Number]';
};
