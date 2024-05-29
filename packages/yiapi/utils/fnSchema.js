export const fnSchema = (field) => {
    return {
        title: field.name,
        ...schema
    };
};
