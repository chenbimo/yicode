import { createSign } from 'node:crypto';
// rsa-sha256 加密
export function fnRsaSha256(data, privateKey) {
    const sign = createSign('RSA-SHA256');
    sign.update(data);
    const signature = sign.sign(privateKey, 'base64');
    return signature;
}
