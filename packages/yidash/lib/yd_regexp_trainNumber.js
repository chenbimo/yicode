/**
 * @name 火车车次
 * @author 陈随易 <https://chensuiyi.me>
 * @returns {RegExp}
 * @summary /^[GCDZTSPKXLY1-9]\d{1,4}$/
 */
export function yd_regexp_trainNumber() {
    return /^[GCDZTSPKXLY1-9]\d{1,4}$/;
}
