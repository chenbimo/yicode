export function fnDbUpdate(obj) {
    const excludeFields = ['id', 'created_at'];
    let newObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] !== null && obj[key] !== undefined && !excludeFields.includes(key)) {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.updated_at = Date.now();
    return newObj;
}
