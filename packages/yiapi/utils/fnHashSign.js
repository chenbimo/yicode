// 创建哈希算法
export const fnHashSign = (algorithm, content) => {
    const hash = crypto.createHash(algorithm);
    hash.update(content);
    return hash.digest('hex');
};
