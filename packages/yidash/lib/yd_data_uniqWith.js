export const yd_data_uniqWith = (arr, comparator) => {
    const uniqueSet = new Set();
    const result = [];

    for (const item of arr) {
        let isDuplicate = false;
        for (const existingItem of uniqueSet) {
            if (comparator(item, existingItem)) {
                isDuplicate = true;
                break;
            }
        }
        if (!isDuplicate) {
            uniqueSet.add(item);
            result.push(item);
        }
    }

    return result;
};
