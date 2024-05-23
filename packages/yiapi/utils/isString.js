export const isString = (f) => {
    return Object.prototype.toString.call(f) === '[object String]';
};
