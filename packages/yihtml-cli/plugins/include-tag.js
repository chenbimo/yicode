"use strict";
const through2 = require("through2");

module.exports = (options) => {
    return through2(function (file, enc, next) {
        if (file.isNull()) {
            next(null, file);
            return;
        }
        console.log(options);
        // console.dir(file);
        console.log(enc);
        next(null, file);
        return;
    });
};
