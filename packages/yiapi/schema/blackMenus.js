export const blackMenusSchema = {
    // 黑名单菜单
    title: '黑名单菜单',
    type: 'array',
    items: {
        type: 'string'
    },
    uniqueItems: true
};
