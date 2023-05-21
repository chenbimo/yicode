import fs from 'node:fs';
import path from 'node:path';
export const yiteHtml = (options) => {
    let config = {};
    return {
        name: 'yite-html',
        enforce: 'pre',
        configResolved(resolvedConfig) {
            config = resolvedConfig;
        },
        options(options) {
            let htmlData = fs.readFileSync(path.resolve(path.dirname(options.input), 'src', 'index.html'), { encoding: 'utf8' });
            htmlData = htmlData.replace('</body>', `<script type="module" src="/src/${process.env.NODE_ENV}.js"></script></body>`);
            if (config.env.VITE_PROJECT_NAME) {
                htmlData = htmlData.replace(/<title>(.*?)<\/title>/gi, `<title>${config.env.VITE_PROJECT_NAME}</title>`);
            }
            fs.writeFileSync(options.input, htmlData);
        }
    };
};
