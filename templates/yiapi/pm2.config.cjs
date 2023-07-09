module.exports = {
    apps: [
        {
            name: 'yicode_demo',
            instances: 'max',
            script: './yiapi.js',
            exec_mode: 'cluster',
            watch: false,
            autorestart: true,
            ignore_watch: ['node_modules', 'logs', 'data'],
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};
