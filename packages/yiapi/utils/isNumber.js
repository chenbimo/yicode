export const isNumber = (value) => {
    return Object.prototype.toString.call(value) === '[object Number]' && !isNaN(value);
};
