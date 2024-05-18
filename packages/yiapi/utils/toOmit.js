export const toOmit = (obj, exclude = []) => {
    const obj2 = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key) === false) continue;
        if (exclude.includes(key) === true) continue;
        obj2[key] = obj[key];
    }
    return obj2;
};
