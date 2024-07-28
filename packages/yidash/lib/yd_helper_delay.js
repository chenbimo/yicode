export const yd_helper_delay = (wait) => {
    return new Promise((resolve) => {
        setTimeout(resolve, wait);
    });
};
