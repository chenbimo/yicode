export const isArray = (value) => {
    return Object.prototype.toString.call(value) === '[object Array]';
};
