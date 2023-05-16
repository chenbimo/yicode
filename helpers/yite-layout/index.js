import { posix } from 'path';

// 路径提纯
const normalizePath = (path) => {
    path = path.startsWith('/') ? path : '/' + path;
    return posix.normalize(path);
};

const createVirtualGlob = async (target, isSync) => {
    const g = `"${target}/**/*.vue"`;
    return `import.meta.glob(${g}, { eager: ${isSync} })`;
};

// 创建虚拟模块代码
export const createVirtualModuleCode = async (options) => {
    const { target, defaultLayout, importMode } = options;

    const normalizedTarget = normalizePath(target);

    const isSync = importMode === 'sync';

    return `
  export const createGetRoutes = (router, withLayout = false) => {
      const routes = router.getRoutes()
      if (withLayout) {
          return routes
      }
      return () => routes.filter(route => !route.meta.isLayout)
  }

  export const setupLayouts = routes => {
      const layouts = {}

      const modules = ${await createVirtualGlob(normalizedTarget, isSync)}

      Object.entries(modules).forEach(([name, module]) => {
          let key = name.replace("${normalizedTarget}/", '').replace('.vue', '')
          layouts[key] = ${isSync ? 'module.default' : 'module'}
      })

    function deepSetupLayout(routes, top = true) {
      return routes.map(route => {
        if (route.children?.length > 0) {
          route.children = deepSetupLayout(route.children, false)
        }

        if (top) {
          return {
            path: route.path,
            component: layouts[route.meta?.layout || '${defaultLayout}'],
            children: [ {...route, path: ''} ],
            meta: {
              isLayout: true
            }
          }
        }

        if (route.meta?.layout) {
          return {
            path: route.path,
            component: layouts[route.meta?.layout],
            children: [ {...route, path: ''} ],
            meta: {
              isLayout: true
            }
          }
        }

        return route
      })
    }

      return deepSetupLayout(routes)
  }`;
};

//   ======================================

export const yiteLayout = (options) => {
    // 配置参数定义
    const {
        //
        target = 'src/layouts',
        defaultLayout = 'default',
        importMode = process.env.VITE_SSG ? 'sync' : 'async'
    } = options || {};

    // 虚拟模块定义
    const virtualModuleId = `virtual:yite-layout`;
    const resolvedVirtualModuleId = '\0' + virtualModuleId;

    // 返回插件
    return {
        name: 'yite-layout',
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        load(id) {
            if (id === resolvedVirtualModuleId) {
                return createVirtualModuleCode({
                    target,
                    importMode,
                    defaultLayout
                });
            }
        }
    };
};
