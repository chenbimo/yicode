import qr from 'qrcode-terminal';

export function yiteQrcode(options = {}) {
    return {
        name: 'yite-qrcode',
        apply: 'serve',
        configureServer(server) {
            const _listen = server.listen;
            server.listen = function () {
                // eslint-disable-next-line prefer-rest-params
                const isRestart = arguments[1] === true;
                if (!isRestart) {
                    server.httpServer?.on('listening', () => {
                        setTimeout(() => logQrcode(server, options), 0);
                    });
                }
                // @ts-ignore
                // eslint-disable-next-line prefer-rest-params
                return _listen.apply(this, arguments);
            };
        }
    };
}

function logQrcode(server, options) {
    let networkUrls = server.resolvedUrls?.network;

    if (!networkUrls) return;

    if (options.filter) {
        networkUrls = networkUrls.filter(options.filter);
    }

    if (networkUrls.length === 0) return;

    const info = server.config.logger.info;

    info('\n  使用手机扫码访问本项目:');

    for (const url of networkUrls) {
        qr.generate(url, { small: true }, (result) => {
            info(`  ${result.replace(/\n/g, '\n  ')}`);
        });
    }
}

function cyan(str) {
    return `\x1b[36m${str}\x1b[0m`;
}
