import fg from 'fast-glob';
import { sortBy, orderBy, cloneDeep } from 'lodash-es';
/**
 * 一维数组生成无限级树结构
 * @param {Array} arrs - 传入的一维数组
 * @param {String} id - 唯一标识字段
 * @param {String} pid - 父级标识字段
 * @param {String} children - 子级标识字段
 * @returns {Array} 返回一个无限级数组结构
 * @summary 应用场景：用于生成无限级菜单结构
 */
function tree_array2Tree(arrs, id = 'id', pid = 'pid', children = 'children') {
    // id 对象，用于通过映射 ID 取得对应的对象数据
    let idObject = {};
    arrs.forEach((item) => {
        idObject[item.id] = item;
    });

    // 无限级树结构
    let treeData = [];

    arrs.forEach((item) => {
        // 父级对象数据
        let pData = idObject[item[pid]];

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
}

// 自动生成侧边栏
function autoSideBar(dirPath) {
    let files = fg.sync(`markdown${dirPath}/**/*.md`, { onlyFiles: true });
    let obj = {};
    files.forEach((file) => {
        let fileEnd = file.replace(`markdown${dirPath}`, '');
        let fileArrs = fileEnd.split('/');

        // 过滤掉
        fileArrs.forEach((name, index) => {
            // 路径前缀
            let selfPath = fileArrs.slice(0, index + 1).join('/');
            let parentPath = fileArrs.slice(0, index).join('/');
            let param = {
                id: selfPath,
                pid: parentPath,
                text: '📄 ' + name.replace(/\d+-/gi, '').replace('.md', '')
            };
            if (name.endsWith('.md')) {
                param.link = `${dirPath}${selfPath}`;

                if (index === 0) {
                    obj[dirPath] = {
                        id: dirPath,
                        pid: '',
                        text: dirPath
                            .split('/')
                            .filter((name) => name)[1]
                            .replace(/\d+-/gi, '')
                            .replace('.md', ''),
                        collapsed: false
                    };
                    param.pid = dirPath;
                }
            }
            obj[selfPath] = param;
        });
    });

    let treeSideBar = orderBy(tree_array2Tree(Object.values(obj), 'id', 'pid', 'items'), (item) => {
        return Number(item.id.split('-')[0]);
    });
    treeSideBar.forEach((item) => {
        item.text = `📁 ${item.text.replace('📄 ', '')}`;
        if (item.collapsed !== false) item.collapsed = true;

        item.items = orderBy(cloneDeep(item.items), (item) => {
            let nameSp = item.id.split('/');

            // 使用最后一个文件名称进行排序
            let lastName = nameSp?.[1] || nameSp?.[0];
            return Number(lastName.split('-')[0]);
        });
    });

    return treeSideBar;
}

// 设置侧边栏
function setSideBar() {
    let files = fg.sync(`markdown/**/[0-9]+-*.md`, { onlyFiles: true, ignore: ['markdown/public/**/*'] });
    let obj = {};
    files.sort().forEach((file) => {
        let fileEnd = file.replace(/^markdown/gi, '');
        let fileSplit = fileEnd.split('/').filter((name) => name);

        if (fileSplit.length < 3 && fileSplit.length > 4) {
            console.log(`${fileEnd} 请按照 分类-[项目]-目录-文章 的方式组织文件`);
            return false;
        }
        let dirPath = `/${fileSplit[0]}/${fileSplit[1]}/`;

        if (obj[dirPath] === undefined) {
            obj[dirPath] = autoSideBar(dirPath);
        }
    });
    return obj;
}

// 设置导航栏
function setNavBar() {
    let files = fg.sync(`markdown/**/1-*.md`, { onlyFiles: true, ignore: ['markdown/public/**/*'] });
    let filesSort = files.sort();
    let obj = new Map();
    let navNameObject = {};
    filesSort.forEach((file) => {
        let fileEnd = file.replace(/^markdown/gi, '');
        let fileSplit = fileEnd.split('/').filter((name) => name);
        let navName = fileSplit[0].replace(/^\d+-/, '');
        let linkName = fileSplit[1].replace(/^\d+-/, '');

        if (fileSplit.length <= 2) return false;
        if (obj.has(navName) === false) {
            navNameObject[navName] = [linkName];
            obj.set(navName, {
                text: navName.replace(/^\d+-/, ''),
                items: [
                    {
                        text: linkName,
                        link: fileEnd.replace('.md', '')
                    }
                ]
            });
        } else {
            if (navNameObject[navName].includes(linkName) === false) {
                navNameObject[navName].push(linkName);
                let item = obj.get(navName);
                item.items.push({
                    text: linkName,
                    link: fileEnd.replace('.md', '')
                });
                obj.set(navName, item);
            }
        }
    });
    return [...obj.values()];
}

// 自动生成
function docsAuto() {
    let sideBar = setSideBar();
    let navBar = setNavBar();
    return {
        sideBar,
        navBar
    };
}

export { docsAuto };
