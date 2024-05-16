// 获取参数按小写排序拼接
export const fnApiRaw = (args) => {
    const keys = Object.keys(args).sort();
    const newArgs = keys
        .map((key) => {
            return `${key.toLowerCase()}=${args[key]}`;
        })
        .join('&');

    return newArgs;
};
