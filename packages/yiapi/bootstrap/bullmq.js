import fs from 'fs-extra';
import path from 'path';
import * as _ from 'lodash-es';
import fp from 'fastify-plugin';
import Queue from 'bull';

import { mqConfig } from '../config/mq.js';
import { redisConfig } from '../config/redis.js';

async function plugin(fastify, options) {
    try {
        for (let prop in mqConfig) {
            let queueName = `MQ_${prop}`;
            let queueInstance = new Queue(queueName, {
                redis: redisConfig
            });
            fastify.decorate(queueName, queueInstance);
            queueInstance.process(mqConfig[prop]);
        }
    } catch (err) {
        fastify.log.error(err);
    }
}

export default fp(plugin, { name: 'mq', dependencies: ['redis', 'tool'] });
