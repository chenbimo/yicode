import { fnSchema } from './fnSchema.js';
const DEFAULT_CONFIG = {
    schema: null,
    extract: [],
    hasToken: false
};
export function fnResponseSchema(opt) {
    const { schema = DEFAULT_CONFIG.schema, extract = DEFAULT_CONFIG.extract, hasToken = schema !== null ? DEFAULT_CONFIG.hasToken : false } = { ...DEFAULT_CONFIG, ...opt };
    // 子数据
    const properties = schema
        ? Object.entries(schema)
              .filter((i) => !extract.includes(i[0]))
              .reduce((pre, cur) => ({ ...pre, [cur[0]]: fnSchema(cur[1]) }), {})
        : {};
    return {
        type: 'object',
        properties: {
            symbol: {
                title: '返回标识符',
                type: 'string'
            },
            code: {
                title: '返回代码',
                type: 'string'
            },
            msg: {
                title: '返回信息',
                type: 'string'
            },

            ...(hasToken ? { token: { title: 'token', type: 'string' } } : {}),
            ...(schema
                ? {
                      data: {
                          title: '数据',
                          type: 'object',
                          properties,
                          required: Object.keys(schema).filter((i) => !extract.includes(i))
                      }
                  }
                : {
                      data: {
                          title: '无数据',
                          type: 'null'
                      }
                  })
        },
        required: ['symbol', 'code', 'msg', 'data']
    };
}
