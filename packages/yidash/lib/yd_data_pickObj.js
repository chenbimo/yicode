export const yd_data_pickObj = (obj, fields = []) => {
    const picked = {};
    for (const key of fields) {
        if (obj.hasOwnProperty(key)) {
            picked[key] = obj[key];
        }
    }
    return picked;
};
