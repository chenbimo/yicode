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
}