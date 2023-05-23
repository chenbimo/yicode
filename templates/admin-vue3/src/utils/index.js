import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
// 合并数据
export function utilMerge(...obj) {
    return mergeAny(..._.cloneDeep(obj));
}

export function utilGetAssets(name) {
    return new URL(`../assets/${name}`, import.meta.url).href;
}

// 转换相对时间
const convertRealtiveTime = (item) => {
    try {
        let item2 = {};
        _.forOwn(item, (value, key) => {
            if (_.endsWith(key, '_at')) {
                let key1 = key.replace('_at', '_at1');
                let key2 = key.replace('_at', '_at2');
                let dt = new Date(value);
                if (value !== 0) {
                    item2[key1] = format(dt, 'yyyy-MM-dd HH:mm:ss');
                    item2[key2] = formatDistanceToNow(dt, { locale: zhCN, addSuffix: true });
                } else {
                    item2[key] = '';
                }
            } else {
                item2[key] = value;
            }
        });

        return item2;
    } catch (err) {
        console.log('🚀 ~ file: index.js:38 ~ convertRealtiveTime ~ err:', err);
    }
};

// 转换相对时间
export function utilCoverRelativeTime(data) {
    // 如果是数组
    if (Array.isArray(data)) {
        return data.map((item) => {
            let dd = convertRealtiveTime(item);
            return dd;
        });
    }

    // 如果是对象
    return convertRealtiveTime(data);
}
