export const yiteHtml = (options) => {
    let config = {};
    return {
        name: 'yite-html',
        enforce: 'pre',
        configResolved(resolvedConfig) {
            // 存储最终解析的配置
            config = resolvedConfig;
        },
        transformIndexHtml(html) {
            html = html.replace('</body>', `<script type="module" src="/src/${process.env.NODE_ENV}.js"></script></body>`);

            if (config.env.VITE_PROJECT_NAME) {
                html = html.replace(/<title>(.*?)<\/title>/gi, `<title>${config.env.VITE_PROJECT_NAME}</title>`);
            }
            return html;
        }
    };
};
