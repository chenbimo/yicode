export const useGlobal = Pinia.defineStore('global', () => {
    // 全局数据
    let $GlobalData = $ref({
        // 内置配置，不要修改
        ...$InternalConfig,
        appConfig: $AppConfig
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
