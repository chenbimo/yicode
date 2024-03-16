import axios from 'axios';
import { Message } from '@arco-design/web-vue';

const $Http = axios.create({
    method: 'POST',
    baseURL: import.meta.env.VITE_HOST,
    timeout: 1000 * 60,
    withCredentials: false,
    responseType: 'json',
    responseEncoding: 'utf8',
    headers: {}
});
// 添加请求拦截器
$Http.interceptors.request.use(
    function (config) {
        const token = $Storage.local.get('token');
        if (token) {
            config.headers.authorization = 'Bearer ' + token;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
$Http.interceptors.response.use(
    function (res) {
        if (res.data.code === 0) {
            return Promise.resolve(res.data);
        }

        return Promise.reject(res.data);
    },
    function (error) {
        Message.error({
            duration: 5000,
            message: error?.response?.data?.msg
        });
    }
);
export { $Http };
