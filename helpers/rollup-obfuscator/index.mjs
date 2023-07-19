import JavaScriptObfuscator from 'javascript-obfuscator';
const rollupObfuscator = (options) => {
    return {
        name: 'rollup-obfuscator',
        transform(source, id) {
            const obfuscationResult = JavaScriptObfuscator.obfuscate(source, options);
            return obfuscationResult.getObfuscatedCode();
        }
    };
};
export { rollupObfuscator };
