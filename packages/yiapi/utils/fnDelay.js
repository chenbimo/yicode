// 延迟函数
export const fnDelay = (wait) => {
    return new Promise((resolve) => {
        setTimeout(resolve, wait);
    });
};
