import { defineStore } from 'pinia';

import { forOwn as _forOwn } from 'lodash-es';
import { setStorage, getStorage } from '@/utils/index.js';
import { QQMapWX } from '@/libs/qqmap-wx-jssdk.js';
import { appConfig } from '@/config/index.js';

let qqmapsdk = new QQMapWX({
    key: appConfig.qqMapKey
});

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
        },
        // 获取当前位置
        getCurrentPosition() {
            // 如果有经纬度，则直接返回
            if ($GlobalData.longitude) return;
            return new Promise((resolve, reject) => {
                // 获取当前地址
                uni.getLocation({
                    type: 'wgs84',
                    success: (res) => {
                        $GlobalData.longitude = res.longitude;
                        $GlobalData.latitude = res.latitude;
                        resolve(res);
                    },
                    fail(err) {
                        console.log('🚀 ~ file: index.vue:51 ~ fail ~ err', err);
                        reject(err);
                    }
                });
            });
        },
        // 获取当前地址
        getCurrentAddress() {
            return new Promise((resolve, reject) => {
                // 获取当前地址
                uni.getLocation({
                    type: 'wgs84',
                    success: (pos) => {
                        qqmapsdk.reverseGeocoder({
                            location: {
                                latitude: pos.latitude,
                                longitude: pos.longitude
                            },
                            success(res) {
                                $GlobalData.currentAddress = res.result.address_component.street ? res.result.address : res.result.address + res.result.address_reference.town.title;
                                $GlobalData.currentStreet = res.result.address_component.street || res.result.address_reference.town.title;
                                // setStorage('currentAddress', res.result.address);
                                // setStorage('currentStreet', res.result.address_component.street);

                                resolve({
                                    data: res.result,
                                    province: res.result.address_component.province,
                                    city: res.result.address_component.city,
                                    region: res.result.address_component.district,
                                    street: res.result.address_component.street || res.result.address_reference.town.title,
                                    street_number: res.result.address_component.street_number,
                                    longitude: res.result.location.lng,
                                    latitude: res.result.location.lat,
                                    longitude_street: res.result.address_reference?.street_number?.location?.lng || res.result.address_reference.town?.location?.lng,
                                    latitude_street: res.result.address_reference?.street_number?.location?.lat || res.result.address_reference.town?.location?.lat,
                                    address: res.result.address_component.street ? res.result.address : res.result.address + res.result.address_reference.town.title
                                });
                            },
                            fail(err) {
                                console.log('🚀 ~ file: index.vue:64 ~ fail ~ err', err);
                                reject(err);
                            }
                        });
                    },
                    fail(err) {
                        console.log('🚀 ~ file: index.vue:51 ~ fail ~ err', err);
                        reject(err);
                    }
                });
            });
        }
    };

    return {
        $GlobalData,
        $GlobalComputed,
        $GlobalMethod
    };
});
