export const yd_is_arrayContain = (arr1, arr2) => {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    return Array.from(set1).some((element) => set2.has(element));
};
