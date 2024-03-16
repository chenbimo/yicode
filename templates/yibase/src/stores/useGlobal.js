export const useGlobal = Pinia.defineStore('global', () => {
    // 全局数据
    const $GlobalData = $ref({
        // 用户令牌
        token: $Storage.local.get('token') || '',
        // 用户数据
        userData: $Storage.local.get('userData') || {},
        clientWidth: '',
        clientHeight: ''
    });

    // 全局计算数据
    const $GlobalComputed = {};

    // 全局方法
    const $GlobalMethod = {};

    return {
        $GlobalData,
        $GlobalComputed,
        $GlobalMethod
    };
});
