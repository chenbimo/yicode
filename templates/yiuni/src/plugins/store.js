import * as Pinia from 'pinia';
import { getStorage, setStorage } from '@/utils/index.js';
import { $Http } from '@/plugins/http.js';

export let useGlobal = Pinia.defineStore('global', () => {
    // 全局数据
    let $GlobalData = $ref({
        // 用户数据
        userInfo: getStorage('userInfo') || {},
        userToken: getStorage('userToken') || ''
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
