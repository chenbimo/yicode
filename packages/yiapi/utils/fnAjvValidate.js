import Ajv from 'ajv';
import localize from 'ajv-i18n';
import logSymbols from 'log-symbols';

const ajv = new Ajv({
    strict: false,
    allErrors: true,
    verbose: true,
    strictSchema: true,
    strictRequired: false
});

// ajv验证
export const fnAjvValidate = async (file, schema, config, isBreak = false) => {
    const validResult = ajv.validate(schema, config);
    if (!validResult) {
        localize.zh(ajv.errors);
        console.log(logSymbols.error, '[ ' + file + ' ] ' + ajv.errorsText(ajv.errors, { separator: '\n' }));
        if (isBreak === true) {
            process.exit(1);
        }
    }
};
