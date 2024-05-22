export const toCapitalize = (str) => {
    if (!str || str.length === 0) return '';
    const lower = str.toLowerCase();
    return lower.substring(0, 1).toUpperCase() + lower.substring(1, lower.length);
};
