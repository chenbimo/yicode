export const yd_is_plainObject = (value) => {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    const proto = Object.getPrototypeOf(data);
    return proto === null || proto === Object.prototype;
};
