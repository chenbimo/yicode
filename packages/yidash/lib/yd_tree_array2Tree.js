/**
 * 一维数组生成无限级树结构
 * @param {Array} arrs - 传入的一维数组
 * @param {String} id - 唯一标识字段
 * @param {String} pid - 父级标识字段
 * @param {String} children - 子级标识字段
 * @returns {Array} 返回一个无限级数组结构
 * @summary 应用场景：用于生成无限级菜单结构
 */
export function yd_tree_array2Tree(arrs, id = 'id', pid = 'pid', children = 'children', forceChildren = true) {
    // id 对象，用于通过映射 ID 取得对应的对象数据
    const idObject = {};
    arrs.forEach((item) => {
        idObject[item[id]] = item;
    });

    // 无限级树结构
    const treeData = [];

    arrs.forEach((item) => {
        // 父级对象数据
        const pData = idObject[item[pid]];

        if (pData) {
            if (!pData[children]) {
                pData[children] = [];
            }
            pData[children].push(item);
        } else {
            if (forceChildren === true) {
                if (!item[children]) {
                    item[children] = [];
                }
            }

            treeData.push(item);
        }
    });
    return treeData;
}
