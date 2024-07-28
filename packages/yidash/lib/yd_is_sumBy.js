export const yd_data_sumBy = (array, iteratee) => {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += iteratee(array[i]);
    }
    return sum;
};
