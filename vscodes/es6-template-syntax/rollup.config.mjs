export default {
    input: 'src/extension.js',
    output: {
        file: 'dist/extension.js',
        format: 'cjs',
        generatedCode: {
            constBindings: true
        }
    }
};
