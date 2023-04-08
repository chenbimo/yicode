import { merge as mergeAny } from 'merge-anything';

const mqConfig = {
    test: (job) => {
        console.log('🚀 ~ file: mq.js ~ line 3 ~ job', job.data);
        return Promise.resolve();
    },
    order: (job) => {
        console.log('🚀 ~ file: mq.js ~ line 4 ~ job', job.data);
        return Promise.resolve();
    }
};

export { mqConfig };
