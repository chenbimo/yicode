module.exports = {
    parserPreset: {
        parserOpts: {
            headerPattern: /^(.*?)(?:\((.*)\))?: (.*)$/,
            headerCorrespondence: ['type', 'scope', 'subject']
        }
    },
    rules: {
        // 头部
        'header-case': [0],
        'header-full-stop': [2, 'never', '.'],
        // 身体
        'body-full-stop': [2, 'never', '.'],
        'body-leading-blank': [2, 'always'],
        'body-case': [0],
        // 尾部
        'footer-leading-blank': [2, 'always'],
        'footer-min-length': [2, 'always', 0],
        // 作用域
        'scope-case': [0],
        // 主题
        'subject-case': [0, 'never'],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'subject-exclamation-mark': [0],
        // 类型
        'type-case': [0],
        'type-empty': [2, 'never'],
        'type-enum': [
            2,
            'always',
            [
                // 新增
                '新增项目',
                '新增文件',
                '新增功能',
                // 更新
                '升级依赖',
                '更新文档',
                // 风格
                '调整风格',
                '美化界面',
                // 优化
                '优化体验',
                '完善功能',
                '优化性能',
                '重构代码',
                // 修复
                '修复问题',
                // 奇想
                '埋下彩蛋',
                '思考计划',
                // 发布
                '打包构建',
                '发布版本',
                // 流程
                '回退复原',
                '持续集成',
                '检测测试',
                // 配置
                '调整配置',
                // 临时
                '暂存代码'
            ]
        ]
    }
};
