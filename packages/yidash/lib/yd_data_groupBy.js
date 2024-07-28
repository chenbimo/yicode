export const yd_data_groupBy = (array, key) => {
    const result = new Map();
    for (const item of array) {
        let groupKey;

        if (typeof key === 'string') {
            groupKey = item[key];
        } else if (typeof key === 'function') {
            groupKey = key(item);
        }

        if (!result.has(groupKey)) {
            result.set(groupKey, []);
        }
        result.get(groupKey).push(item);
    }
    return result;
};
