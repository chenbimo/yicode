export const isFunction = (f) => {
    const symbolString = Object.prototype.toString.call(f);
    const result = ['[object Function]', '[object AsyncFunction]'].includes(symbolString);
    return result;
};
