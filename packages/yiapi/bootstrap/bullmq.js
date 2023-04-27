import path from 'node:path';
import fs from 'fs-extra';
import fp from 'fastify-plugin';
import Queue from 'bull';

import { appConfig } from '../config/appConfig.js';

async function plugin(fastify, options) {
    try {
        for (let prop in appConfig.mq) {
            let queueName = `MQ_${prop}`;
            let queueInstance = new Queue(queueName, {
                redis: appConfig.redis
            });
            fastify.decorate(queueName, queueInstance);
            queueInstance.process(appConfig.mq[prop]);
        }
    } catch (err) {
        fastify.log.error(err);
    }
}

export default fp(plugin, { name: 'mq', dependencies: ['redis', 'tool'] });
