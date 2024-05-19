#!/usr/bin/env node
import { pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { readFileSync, readdirSync } from 'node:fs';
import fs from 'fs-extra';
import Knex from 'knex';
import fg from 'fast-glob';
import logSymbols from 'log-symbols';
import * as color from 'colorette';
import picomatch from 'picomatch';

import { system } from '../system.js';
import { fnImport } from '../utils/fnImport.js';

// 检测表字段
const checkTableFields = async () => {
    const files = readdirSync(resolve(system.appDir, 'tables'));
    for (let file of files) {
        const { tableData } = await fnImport(resolve(system.appDir, 'tables', file), 'tableData', {});
        console.log('🚀 ~ checkTableFields ~ tableData:', tableData);
    }
};

checkTableFields();
