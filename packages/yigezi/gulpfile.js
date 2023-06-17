'use strict';
const srcDir = 'src';
const buildDir = 'dist';
const gulp = require('gulp');
const del = require('del');
const gulpPostcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const gulpIf = require('gulp-if');
const gulpRename = require('gulp-rename');
const sass = require('sass');
const gulpSass = require('gulp-sass')(sass);
const env = process.env.RELEASE_TYPE || 'dev';
const config = {
    // postcss参数
    postcssParams: [],
    // sass参数
    sassParams: {
        outputStyle: 'compressed'
    },
    // src参数
    srcParams: {
        allowEmpty: true
    }
};

config.postcssParams.push(autoprefixer({}));

// 清除任务
async function task_clean() {
    del(buildDir);
    return Promise.resolve(true);
}

// css任务
async function task_css() {
    gulp.src(`${srcDir}/yigezi.scss`, config.srcParams)
        //
        .pipe(gulpSass(config.sassParams))
        .pipe(gulpPostcss(config.postcssParams))
        .pipe(gulpRename('yigezi.min.css'))
        .pipe(gulp.dest(buildDir));
    return Promise.resolve(true);
}

// 监听公共构建
gulp.watch(`${srcDir}/*.scss`, task_css);

exports.default = gulp.series(task_clean, task_css);
