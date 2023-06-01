import { defineStore } from 'pinia';

import { forOwn as _forOwn } from 'lodash-es';
import { setStorage, getStorage } from '@/utils/index.js';
import { appConfig } from '@/config/index.js';

export const useGlobal = defineStore('global', () => {
    // 全局数据集
    let $GlobalData = $ref({
        name: 0,
        longitude: '',
        latitude: '',
        userData: {},
        currentAddress: getStorage('currentAddress'),
        currentStreet: getStorage('currentStreet')
    });

    // 全局计算集
    let $GlobalComputed = {};

    // 全局方法集
    let $GlobalMethod = {
        // 拼接查询参数
        getQuery(query) {
            let str = '';
            let arr = [];
            _forOwn(query, (value, key) => {
                arr.push(key + '=' + value);
            });
            str += '?' + arr.join('&');
            return str;
        },
        // 跳转地址
        goUrl(pagePath, params, isRedirect = false) {
            if (appConfig.tabbar.includes(pagePath)) {
                uni.switchTab({
                    url: pagePath
                });
                return;
            }
            let query = $GlobalMethod.getQuery(params || {});
            if (isRedirect === false) {
                uni.navigateTo({
                    url: pagePath + query
                });
            } else {
                uni.redirectTo({
                    url: pagePath + query
                });
            }
        },
        // 显示提示信息
        showMsg(title) {
            uni.showToast({
                icon: 'none',
                title: title,
                duration: 3000
            });
        },
        // 显示弹框
        showLoading(title) {
            uni.hideLoading();
            uni.showLoading({
                title: title || '',
                mask: true
            });
        },
        // 隐藏弹框
        hideLoading() {
            // $GlobalMethod.showLoading();
            setTimeout(() => {
                uni.hideLoading();
            }, 2000);
        }
    };

    return {
        $GlobalData,
        $GlobalComputed,
        $GlobalMethod
    };
});
