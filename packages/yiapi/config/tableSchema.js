export const tableSchemaConfig = {
    string: ['type', 'default', 'min', 'max', 'enum', 'pattern'],
    integer: ['type', 'default', 'min', 'max', 'multipleOf'],
    number: ['type', 'default', 'min', 'max', 'multipleOf'],
    array: ['type', 'default', 'items', 'isUniqueItems', 'isAdditionalItems']
};
