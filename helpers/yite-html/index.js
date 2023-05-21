export const yiteHtml = (options) => {
    return {
        name: 'yite-html',
        enforce: 'pre',
        apply: 'build',
        transformIndexHtml(html) {
            return html.replace(
                //
                /<script.+dev\.js.+>.+<\/script>/,
                '<script type="module" src="/src/build.js"></script>'
            );
        }
    };
};
