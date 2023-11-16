import axios from 'axios';

let $Http = axios.create({
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
        let token = $Storage.local.get('token');
        if (token) {
            config.headers.authorization = 'Bearer ' + token;
        }
        return config;
    },
    function (err) {
        return Promise.reject(err);
    }
);

// 添加响应拦截器
$Http.interceptors.response.use(
    function (res) {
        if (res.data.code === 0) {
            return Promise.resolve(res.data);
        }
        if (res.data.symbol === 'NOT_LOGIN') {
            location.href = location.origin + '/#/internal/login';
        }
        return Promise.reject(res.data);
    },
    function (err) {
        return Promise.reject(err);
    }
);
export { $Http };
