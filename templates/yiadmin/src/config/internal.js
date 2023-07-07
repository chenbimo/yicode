export const $InternalConfig = {
    // 用户令牌
    token: yite.getCookie('token') || '',
    // 用户数据
    userData: $Storage.local.get('userData') || {},
    tableBordered: {
        cell: true
    },
    tableScroll: {
        x: '100%',
        y: '100%'
    },
    drawerWidth: 400
};
