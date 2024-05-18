import { createServer as net_createServer, Server as net_Server } from 'node:net';
// 端口是否打开
export const fnIsPortOpen = (port) => {
    return new Promise((resolve, reject) => {
        const server = net_createServer();

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false);
            } else {
                reject(err);
            }
        });
        server.on('listening', (data) => {
            server.close(() => {
                resolve(true);
            });
        });

        server.listen(port);
    });
};
