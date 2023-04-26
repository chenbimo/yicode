import { defineStore } from 'pinia';
import { isCookieEnabled, getCookie, setCookie, removeCookie } from 'tiny-cookie';

export const useGlobal = defineStore('global', () => {
    // 全局数据
    let $GlobalData = $ref({
        // 用户令牌
        token: getCookie('token') || '',
        // 用户数据
        userData: $Storage.local.get('userData') || {},
        clientWidth: '',
        clientHeight: '',
        defaultAvatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9123.png~tplv-uwbnlip3yd-webp.webp',
        tableBordered: {
            cell: true
        },
        tableScroll: {
            x: '100%',
            y: '100%'
        }
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
