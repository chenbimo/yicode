export const yd_is_integer = (value) => {
    return Number.isInteger(value) && value.toString().indexOf('.') === -1;
};
