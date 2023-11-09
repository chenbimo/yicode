import { forOwn as _forOwn, omit as _omit } from 'lodash-es';
import { $AppConfig } from '@/config/app.js';

// 设置存储
export let setStorage = (key, data) => {
    uni.setStorageSync(`${$AppConfig.namespace}.${key}`, data);
};

// 获取存储
export let getStorage = (key) => {
    return uni.getStorageSync(`${$AppConfig.namespace}.${key}`);
};

// 获取 URL 参数
export let getUrlParams = (url) => {
    let query = url;
    let json = {};
    let params = query.slice(query.indexOf('?') + 1);

    params.split('&').forEach((item) => {
        let [k, v] = item.split('=');
        json[k] = v;
    });
    return json;
};

export let utilRef = (from, name, el) => {
    from[name] = el;
};

// 拼接查询参数
export let getQuery = (query) => {
    let str = '';
    let arr = [];
    _forOwn(query, (value, key) => {
        arr.push(key + '=' + value);
    });
    str += '?' + arr.join('&');
    return str;
};

// 跳转地址
export let goUrl = (pagePath, params) => {
    let query = getQuery(params || {});
    if ($AppConfig.tabbar.includes(pagePath)) {
        uni.switchTab({
            url: pagePath + query
        });
        return;
    }

    uni.navigateTo({
        url: pagePath + query
    });
};

export let goBack = () => {
    uni.navigateBack();
};

export let getDeviceInfo = () => {
    let deviceInfo = uni.getDeviceInfo();
    // if(deviceInfo.deviceType === '')
    return deviceInfo;
};

export const secondToHms = (second) => {
    let h = ~~(second / 60 / 60);
    let m = ~~((second - h * 60 * 60) / 60);
    let s = ~~(second - h * 60 * 60 - m * 60);
    return {
        h: h,
        m: m,
        s: s
    };
};
