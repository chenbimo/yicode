import store2 from 'store2';
const $Storage = store2.namespace(import.meta.env.VITE_NAMESPACE);

// 提供给手动导入使用
export { $Storage };
