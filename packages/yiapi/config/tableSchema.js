export const tableSchemaConfig = {
    string: ['type', 'default', 'min', 'max', 'pattern', 'enum'],
    integer: ['type', 'default', 'min', 'max', 'multipleOf', 'enum'],
    number: ['type', 'default', 'min', 'max', 'multipleOf', 'enum'],
    array: ['type', 'default', 'min', 'max', 'items', 'isUnique', 'isAdditional']
};
