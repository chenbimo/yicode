import { isCookieEnabled, getCookie, getRawCookie, getAllCookies, setCookie, removeCookie } from 'tiny-cookie';
import { defineConfig } from 'unocss';
import { unocssConfig } from './unocss.js';

const defineUnocssConfig = defineConfig(unocssConfig);

export {
    //
    isCookieEnabled,
    getCookie,
    getRawCookie,
    getAllCookies,
    setCookie,
    removeCookie,
    defineUnocssConfig
};
