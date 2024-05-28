export const toFind = (arrs, key, value) => {
    let result = undefined;
    for (let item of arrs) {
        if (item[key] === value) {
            result = item;
            break;
        }
    }
    return result;
};
