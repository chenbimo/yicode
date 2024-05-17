// 内部模块
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { createServer as net_createServer, Server as net_Server } from 'node:net';
// 外部模块

import fg from 'fast-glob';
import md5 from 'blueimp-md5';
import got from 'got';

import { copy as copyAny } from 'copy-anything';
import logSymbols from 'log-symbols';
import * as color from 'colorette';
import {
    //
    kebabCase as _kebabCase,
    camelCase as _camelCase,
    lowerCase as _lowerCase,
    forOwn as _forOwn,
    omit as _omit,
    isEmpty as _isEmpty,
    startsWith as _startsWith,
    isArray as _isArray,
    concat as _concat,
    mergeWith as _mergeWith,
    merge as _merge,
    random as _random,
    isString as _isString,
    cloneDeep as _cloneDeep,
    isInteger as _isInteger,
    isNumber as _isNumber,
    uniq as _uniq,
    isPlainObject as _isPlainObject
} from 'lodash-es';
// 配置文件
import { appConfig } from '../config/app.js';
import { sysConfig } from '../config/sysConfig.js';
import { schemaField } from '../config/schemaField.js';
