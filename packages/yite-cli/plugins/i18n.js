// 查找模块
const importGlob = async (pattern) => {
    return `import.meta.glob("${pattern}", {as: 'raw'})`;
};

// 生成虚拟模块
const createVirtualModuleCode = async (options) => {
    return `
    export const yiteMessages = async () => {
        let files = ${await importGlob('@/i18n/*.json')};
        let messages = {};
        for (let key in files) {
            let data = await files[key]();
            messages[key.replace('/src/i18n/', '').replace('.json', '')] = JSON.parse(data);
        }
        return messages;
    };
    `;
};

export const yiteI18n = (options) => {
    let config = {};
    // 虚拟模块定义
    const virtualModuleId = `virtual:yite-messages`;
    const resolvedVirtualModuleId = '\0' + virtualModuleId;

    return {
        name: 'yite-i18n',
        enforce: 'pre',
        options(options) {},
        buildStart(options) {},
        configResolved(resolvedConfig) {
            config = resolvedConfig;
        },
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        load(id) {
            if (id === resolvedVirtualModuleId) {
                return createVirtualModuleCode();
            }
        }
    };
};
