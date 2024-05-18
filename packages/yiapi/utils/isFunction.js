export const isFunction = (f) => {
    return Object.prototype.toString.call(f) === '[object Function]';
};
