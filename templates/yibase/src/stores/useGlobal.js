export const useGlobal = Pinia.defineStore('global', () => {
    // 全局数据
    let $GlobalData = $ref({
        // 用户令牌
        token: yite.getCookie('token') || '',
        // 用户数据
        userData: $Storage.local.get('userData') || {},
        clientWidth: '',
        clientHeight: ''
    });

    // 全局计算数据
    let $GlobalComputed = {};

    // 全局方法
    let $GlobalMethod = {};

    return {
        $GlobalData,
        $GlobalComputed,
        $GlobalMethod
    };
});
