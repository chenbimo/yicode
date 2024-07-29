export const yd_is_string = (value) => {
    return Object.prototype.toString.call(value) === '[object String]';
};
