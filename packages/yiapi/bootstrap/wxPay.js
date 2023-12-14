import got from 'got';
import crypto from 'crypto';
import { isEmpty } from 'lodash-es';
import fp from 'fastify-plugin';

import { appConfig } from '../config/appConfig.js';
import { fnUUID } from '../utils/index.js';

async function plugin(fastify) {
    class WxPay {
        constructor(app_id) {
            this.appId = app_id;
            this.certificates = [];
            this.certExpiresTime = '';
            this.merchantConfig = appConfig.weixinMerchant || {};
            this.updateCertificates();
        }

        // 获取请求路径
        httpUrl(type, params) {
            const urls = {
                jsapi: {
                    url: `/v3/pay/transactions/jsapi`,
                    method: 'POST'
                },
                native: {
                    url: '/v3/pay/transactions/native',
                    method: 'POST'
                },
                getCertificates: {
                    url: `/v3/certificates`,
                    method: 'GET'
                }
            };
            return urls[type];
        }

        /**
         * rsa 签名
         * @param content 签名内容
         * @param privateKey 私钥，PKCS#1
         * @param hash hash 算法，SHA256withRSA，SHA1withRSA
         * @returns 返回签名字符串，base64
         */
        rsaSign(content) {
            return crypto.createSign('RSA-SHA256').update(content).sign(this.merchantConfig.privateKey, 'base64');
        }

        // 更新证书
        async updateCertificates(forceUpdate = false) {
            //如果证书过期时间存在，并且证书过期时间大于当前时间，则不更新证书
            if (forceUpdate === false) {
                if (this.certExpiresTime && this.certExpiresTime > new Date()) {
                    return;
                }
            }
            this.certificates = await this.getCertificates();
            this.certExpiresTime = new Date(Date.now() + 12 * 60 * 60 * 1000);
        }

        // 获取证书列表
        async getCertificates() {
            const res = await this.request('getCertificates', {});

            const decryptCertificates = res.data
                .map((item) => {
                    const { associated_data, ciphertext, nonce } = item.encrypt_certificate;
                    const decrypt_certificate = this.decodeCertificate({
                        nonce,
                        associated_data,
                        ciphertext
                    });

                    const x509 = new crypto.X509Certificate(decrypt_certificate);

                    const keyString = x509.publicKey
                        .export({ type: 'spki', format: 'der' })
                        .toString('base64')
                        .match(/.{1,64}/g)
                        .join('\n');

                    const public_key = `-----BEGIN PUBLIC KEY-----\n${keyString}\n-----END PUBLIC KEY-----`;

                    return {
                        expire_time: item.expire_time,
                        effective_time: item.effective_time,
                        serial_no: item.serial_no,
                        decrypt_certificate: decrypt_certificate,
                        public_key: public_key
                    };
                })
                .sort((a, b) => {
                    return new Date(b.expire_time).getTime() - new Date(a.expire_time).getTime();
                });

            return decryptCertificates;
        }

        /*
         * 解密
         * @param ciphertext 密文
         * @param key 密钥
         * @param nonce 随机串
         * @param associated_data 附加数据
         */
        decodeCertificate(options) {
            const { associated_data, ciphertext, nonce } = options;
            const ciphertextBuffer = Buffer.from(ciphertext, 'base64');
            const authTag = ciphertextBuffer.slice(ciphertextBuffer.length - 16);
            const data = ciphertextBuffer.slice(0, ciphertextBuffer.length - 16);
            const decipherIv = crypto.createDecipheriv('aes-256-gcm', this.merchantConfig.apiv3PrivateKey, nonce);
            decipherIv.setAuthTag(authTag);
            decipherIv.setAAD(Buffer.from(associated_data));
            const decryptBuf = decipherIv.update(data);
            decipherIv.final();
            return decryptBuf.toString('utf8');
        }

        // 签名验证
        verifySign(headers, body) {
            const {
                //
                'wechatpay-timestamp': timestamp,
                'wechatpay-nonce': nonce,
                'wechatpay-signature': signature,
                'wechatpay-serial': serial
            } = headers;
            let bodyStr = '';
            if (body) {
                bodyStr = Object.keys(body).length !== 0 ? JSON.stringify(body) : '';
            }
            const signStr = [timestamp, nonce, bodyStr].join('\n') + '\n';
            const cert = this.merchantConfig.certificates.find((item) => item.serial_no === serial);
            if (!cert) {
                fastify.log.error('没有对应的签名');
                return false;
            }

            const isVerifySign = crypto //
                .createVerify('RSA-SHA256')
                .update(signStr)
                .verify(cert.public_key, signature, 'base64');

            return isVerifySign;
        }

        // 请求函数
        async request(type, params) {
            try {
                // 请求路径和方法
                const { url, method } = this.httpUrl(type);
                // 时间戳
                const timestamp = Math.floor(Date.now() / 1000);
                // 随机字符
                const onece_str = fnUUID();
                // 请求体，如果没有参数，则请求体为空
                let paramsStr = '';
                if (Object.keys(params).length > 0) {
                    params.appid = this.appId;
                    params.mchid = this.merchantConfig.mchId;
                    params.notify_url = this.merchantConfig.notifyUrl;
                    paramsStr = JSON.stringify(params);
                }

                // 签名
                const signature = this.rsaSign(`${method}\n${url}\n${timestamp}\n${onece_str}\n${paramsStr}\n`);

                // 认证
                const Authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${this.merchantConfig.mchId}",nonce_str="${onece_str}",timestamp="${timestamp}",signature="${signature}",serial_no="${this.merchantConfig.serialNo}"`;
                // 发起请求
                let reqParams = {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: Authorization
                    }
                };
                if (method === 'POST') {
                    reqParams.json = params;
                } else {
                    reqParams.searchParams = params;
                }
                const res = await got('https://api.mch.weixin.qq.com' + url, reqParams).json();

                // 返回结果
                return res;
            } catch (err) {
                fastify.log.error(err);
            }
        }
    }
    await fastify.decorate('WxPay', WxPay);
}
export default fp(plugin, { name: 'wxPay' });
