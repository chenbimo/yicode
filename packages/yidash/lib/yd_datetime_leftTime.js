/**
 * 计算剩余时间
 * @param {Integer} second 剩余时间秒数
 */
export function yd_datetime_leftTime(seconds) {
    let absTime = Math.abs(seconds);
    let parsed = {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        text: '',
        type: ''
    };

    // 年
    parsed.years = ~~(absTime / 60 / 60 / 24 / 365);
    // 月
    parsed.months = ~~(absTime / 60 / 60 / 24 / 30);
    // 周
    parsed.weeks = ~~(absTime / 60 / 60 / 24 / 7);
    // 天
    parsed.days = ~~(absTime / 60 / 60 / 24);
    // 时
    parsed.hours = ~~(absTime / 60 / 60);
    // 分
    parsed.minutes = ~~(absTime / 60);
    // 秒
    parsed.seconds = absTime;

    if (parsed.years > 0) {
        parsed.text = parsed.years + ' 年';
    } else if (parsed.months > 0) {
        parsed.text = parsed.months + ' 月';
    } else if (parsed.weeks > 0) {
        parsed.text = parsed.weeks + ' 周';
    } else if (parsed.days > 0) {
        parsed.text = parsed.days + ' 天';
    } else if (parsed.hours > 0) {
        parsed.text = parsed.hours + ' 小时';
    } else if (parsed.minutes > 0) {
        parsed.text = parsed.minutes + ' 分钟';
    } else if (parsed.seconds > 0) {
        parsed.text = parsed.seconds + ' 秒';
    } else {
        parsed.text = '0 秒';
    }
    if (seconds > 0) {
        parsed.type = '还剩';
    } else {
        parsed.type = '已过';
    }

    return parsed;
}
