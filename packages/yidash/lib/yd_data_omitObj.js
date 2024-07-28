export const yd_data_omitObj = (obj, fields = []) => {
    const result = Object.create(null);
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && fields.includes(key) === false) {
            result[key] = obj[key];
        }
    }
    return result;
};
