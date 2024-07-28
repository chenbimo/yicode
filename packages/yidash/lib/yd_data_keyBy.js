export const yd_data_keyBy = (data, field) => {
    const result = {};
    data.forEach((item) => {
        result[item[field]] = item;
    });
    return result;
};
