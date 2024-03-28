import { basename } from 'node:path';
import fg from 'fast-glob';
import { sortBy, orderBy, cloneDeep, last as _last, first as _first, some as _some } from 'lodash-es';
import * as colors from 'colorette';
/**
 * 一维数组生成无限级树结构
 * @param {Array} arrs - 传入的一维数组
 * @param {String} id - 唯一标识字段
 * @param {String} pid - 父级标识字段
 * @param {String} children - 子级标识字段
 * @returns {Array} 返回一个无限级数组结构
 * @summary 应用场景：用于生成无限级菜单结构
 */
const array2Tree = (arrs, id = 'id', pid = 'pid', children = 'children') => {
    // id 对象，用于通过映射 ID 取得对应的对象数据
    const idObject = {};
    arrs.forEach((item) => {
        idObject[item.id] = item;
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
            if (!item[children]) {
                item[children] = [];
            }
            treeData.push(item);
        }
    });
    return treeData;
};

// 自动生成侧边栏
const autoSideBar = (dirPath) => {
    const files = fg.sync(`markdown${dirPath}/**/*.md`, { onlyFiles: true });
    const obj = {};
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileArrs = file.replace(`markdown${dirPath}`, '').split('/');
        for (let j = 0; j < fileArrs.length; j++) {
            const name = fileArrs[j];
            // 路径前缀
            const selfPath = fileArrs.slice(0, j + 1).join('/');
            const parentPath = fileArrs.slice(0, j).join('/');
            const param = {
                id: selfPath,
                pid: parentPath,
                link: `${dirPath}${selfPath}`,
                text: '📄 ' + name.trim().replace(/^\d+#/gi, '').replace('.md', '')
            };

            if (j === 0) {
                obj[dirPath] = {
                    id: dirPath,
                    pid: '',
                    text: dirPath
                        .split('/')
                        .filter((name) => name)[1]
                        .replace(/^\d+#/gi, '')
                        .replace('.md', ''),
                    collapsed: false
                };
                param.pid = dirPath;
            }
            obj[selfPath] = param;
        }
    }

    console.log('🚀 ~ autoSideBar ~ obj:', obj);

    const treeSideBar = orderBy(array2Tree(Object.values(obj), 'id', 'pid', 'items'), (item) => {
        return Number(item.id.split('#')[0]);
    });
    treeSideBar.forEach((item1) => {
        item1.text = `📁 ${item1.text.replace('📄 ', '')}`;
        if (item1.collapsed !== false) item1.collapsed = true;

        item1.items = orderBy(cloneDeep(item1.items), (item2) => {
            const nameSp = item2.id.split('/');

            // 使用最后一个文件名称进行排序
            const lastName = nameSp?.[1] || nameSp?.[0];
            if (item2?.items) {
                item2.items = orderBy(cloneDeep(item2.items), (item3) => {
                    const nameSp = item3.id.split('/');

                    // 使用最后一个文件名称进行排序
                    const lastName = nameSp?.[1] || nameSp?.[0];
                    return Number(lastName.split('#')[0]);
                });
            }

            return Number(lastName.split('#')[0]);
        });
    });

    return treeSideBar;
};

// 设置侧边栏
const setNavAndSide = () => {
    const files = fg.sync(`markdown/**/\/[1-9][0-9]*#*.md`, { onlyFiles: true, ignore: ['markdown/public/**/*'] });

    const sideObjs = {};
    const navObjs = {};
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileEnd = file.replace(/^markdown/gi, '');
        const fileSplit = fileEnd.split('/').filter((name) => name);

        if (fileSplit.length < 3 || fileSplit.length > 4) {
            console.log(`${colors.redBright(fileEnd)} 请按照 ${colors.greenBright('分类-[项目]-目录-文章')} 的层级方式组织文件`);
            continue;
        }

        const lastNumber = Number(_last(fileSplit).split('#')[0]);
        const firstNumber = Number(fileSplit[0].split('#')[0]);
        const secondNumber = Number(fileSplit[1].split('#')[0]);
        const firstName = fileSplit[0];
        const navName = fileSplit[0].replace(/^\d+#/gi, '');
        const linkName = fileSplit[1].replace(/^\d+#/gi, '');
        const dirPath = `/${fileSplit[0]}/${fileSplit[1]}/`;

        // 设置导航下的擦边蓝
        if (sideObjs[dirPath] === undefined) {
            sideObjs[dirPath] = autoSideBar(dirPath);
        }

        // 如果是第一个，就作为顶部导航
        if (lastNumber === 1) {
            if (navObjs[firstName] === undefined) {
                navObjs[firstName] = {
                    order: firstNumber,
                    text: navName,
                    items: [
                        {
                            order: secondNumber,
                            text: linkName,
                            link: fileEnd.replace('.md', '')
                        }
                    ]
                };
            } else {
                if (_some(navObjs[firstName].items, { text: linkName }) === false) {
                    navObjs[firstName].items.push({
                        order: secondNumber,
                        text: linkName,
                        link: fileEnd.replace('.md', '')
                    });
                }
            }
        }
    }

    const navObjs2 = orderBy(
        Object.values(navObjs).map((nav) => {
            nav.items = orderBy(nav.items, ['order'], ['asc']);
            return nav;
        }),
        ['order'],
        ['asc']
    );
    return {
        navBar: navObjs2,
        sideBar: sideObjs
    };
};

// 自动生成
const docsAuto = () => {
    const { sideBar, navBar } = setNavAndSide();
    return {
        sideBar: sideBar,
        navBar: navBar
    };
};

export { docsAuto };
