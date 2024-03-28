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
                //
                '打包构建',
                '思考计划',
                '暂存代码',
                '升级依赖',
                '持续集成',
                '更新文档',
                '新增功能',
                '新增文件',
                '修复问题',
                '优化性能',
                '重构代码',
                '回退复原',
                '调整风格',
                '检测测试',
                '调整配置',
                '埋下彩蛋',
                '完善功能',
                '发布版本'
            ]
        ]
    }
};
