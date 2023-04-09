import md5 from 'blueimp-md5';
import {
    //
    forOwn as _forOwn,
    omit as _omit,
    isArray as _isArray,
    isObject as _isObject,
    endsWith as _endsWith
} from 'lodash-es';

import { appConfig } from '@/config/index.js';
import { dayjs } from '@/plugins/dayjs.js';

// 设置存储
export function setStorage(key, data) {
    uni.setStorageSync(`${appConfig.namespace}.${key}`, data);
}

// 获取存储
export function getStorage(key) {
    return uni.getStorageSync(`${appConfig.namespace}.${key}`);
}

export function apiParamsSign(params) {
    let fieldsArray = [];
    _forOwn(_omit(params, ['sign']), (value, key) => {
        if (value !== undefined && value !== null && String(value).length < 1000) {
            fieldsArray.push(`${key}=${value}`);
        }
    });

    let fieldsSort = fieldsArray.sort().join('&');

    let fieldsMd5 = md5(fieldsSort);
    return {
        sign: fieldsMd5,
        sort: fieldsSort
    };
}

// 时间转换
export function utilDatetimeConvert(data) {
    // 如果是数组
    if (_isArray(data)) {
        data.forEach((item) => {
            _forOwn(item, (value, key) => {
                if (_endsWith(key, '_at')) {
                    if (value !== 0) {
                        item[key] = dayjs(value).format('YYYY-MM-DD HH:mm:ss');
                        item[`${key}2`] = dayjs(value).fromNow();
                    } else {
                        item[key] = '';
                    }
                }
            });
        });
        return data;
    }

    // 如果是对象
    if (_isObject(data)) {
        _forOwn(data, (value, key) => {
            if (_endsWith(key, '_at')) {
                if (value !== 0) {
                    data[key] = dayjs(value).format('YYYY-MM-DD HH:mm:ss');
                    data[`${key}2`] = dayjs(value).fromNow();
                } else {
                    data[key] = '';
                }
            }
        });
        return data;
    }

    return data;
}

/**
 * 省、市、区提取
 * @param {string} address 地址字符串
 * @returns {array} 省市区
 */
export function yidash_address_areaMatch(address) {
    let regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
    let province = [];
    let addressBean = {
        province: '',
        region: '',
        city: ''
    };

    function regexAddressBean(address, addressBean) {
        regex = /^(.*?[市]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g;
        let addxress = regex.exec(address);
        addressBean.city = addxress[1];
        addressBean.region = addxress[2];
    }
    if (!(province = regex.exec(address))) {
        regex = /^(.*?(省|自治区))(.*?)$/;
        province = regex.exec(address);
        addressBean.province = province[1];
        regexAddressBean(province[3], addressBean);
    } else {
        addressBean.province = province[1];
        regexAddressBean(address, addressBean);
    }
    return addressBean;
}
