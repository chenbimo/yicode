import fp from 'fastify-plugin';
import got from 'got';
import { differenceInSeconds, toDate } from 'date-fns';

async function plugin(fastify, opts) {
    let res = await got('http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp', {
        method: 'get'
    }).json();
    let timestamp = res?.data?.t;
    if (timestamp) {
        let diffSeconds = Math.abs(differenceInSeconds(new Date(), toDate(timestamp * 1)));
        if (diffSeconds > 60) {
            fastify.log.error('与北京时间相差大于1分钟');
            process.exit();
        }
    } else {
        fastify.log.error('北京时间未获取，无法校对服务器时间');
        process.exit();
    }
}
export default fp(plugin, { name: 'syncTime' });
