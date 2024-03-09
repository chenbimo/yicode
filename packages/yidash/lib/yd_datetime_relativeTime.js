import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
// 转换相对时间
const _convertTime = (obj) => {
    try {
        const item = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (key.endsWith('_at')) {
                    let key1 = key.replace('_at', '_at1');
                    let key2 = key.replace('_at', '_at2');
                    let dt = new Date(value);
                    if (value !== 0) {
                        item[key] = value;
                        item[key1] = format(dt, 'yyyy-MM-dd HH:mm:ss');
                        item[key2] = formatDistanceToNow(dt, { locale: zhCN, addSuffix: true });
                    } else {
                        item[key] = '';
                    }
                } else {
                    item[key] = value;
                }
            }
        }

        return item;
    } catch (err) {
        console.log('🚀 ~ file: index.js:38 ~ convertRealtiveTime ~ err:', err);
    }
};

// 转换相对时间
export function yd_datetime_relativeTime(data) {
    // 如果是数组
    if (Array.isArray(data)) {
        return data.map((item) => {
            return _convertTime(item);
        });
    }

    // 如果是对象
    return _convertTime(data);
}
