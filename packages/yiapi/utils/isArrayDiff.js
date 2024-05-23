export const isArrayDiff = (arr1, arr2) => {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const uniqueElements = new Set([...set1].filter((x) => !set2.has(x)));

    return Array.from(uniqueElements);
};
