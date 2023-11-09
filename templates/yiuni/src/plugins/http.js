import Request from 'luch-request';

import { getStorage, getDeviceInfo } from '@/utils/index.js';

let $Http = new Request({
    baseURL: import.meta.env.VITE_HOST,
    method: 'post',
    header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
});
// 添加请求拦截器
$Http.interceptors.request.use(
    async (config) => {
        return config;
    },
    async (error) => {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
$Http.interceptors.response.use(
    async (res) => {
        // 正常返回
        if (res.data.code === 0) {
            return Promise.resolve(res.data);
        }

        // 其他错误
        return Promise.reject(res.data);
    },
    async (error) => {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

export { $Http };
