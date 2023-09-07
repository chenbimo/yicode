module.exports = {
    parserPreset: {
        parserOpts: {
            headerPattern: /^(.*?)(?:\((.*)\))?: (.*)$/,
            headerCorrespondence: ['type', 'scope', 'subject']
        }
    }
};
