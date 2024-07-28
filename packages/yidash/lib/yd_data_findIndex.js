export const yd_data_findIndex = (data, field, value) => {
    let result = null;
    for (const [index, item] of data.entries()) {
        for (let prop in item) {
            if (item.hasOwnProperty(prop)) {
                if (prop === field && item[prop] === value) {
                    result = index;
                    break;
                }
            }
        }
    }
    return result;
};
