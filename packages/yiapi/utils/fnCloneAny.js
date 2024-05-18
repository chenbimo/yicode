import { copy as copyAny } from 'copy-anything';

// 克隆数据
export function fnCloneAny(data) {
    const result = copyAny(data);
    return result;
}
