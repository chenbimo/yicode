export const getDbFields = (tableData, exclude = []) => {
    const defaultFields = ['id', 'created_at', 'updated_at', 'deleted_at'];
    const selectFields = Object.keys(tableData).filter((field) => !exclude[field]);
    return [...defaultFields, ...selectFields];
};
