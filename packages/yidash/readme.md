### yidash（易大师）

> 基于 lodash 函数库扩展的实用业务方法库

![logo](https://static.chensuiyi.com/images/yidash-logo.png)

## 安装

```bash
# 全局安装
npm install --global @yicode/yidash

# 局部安装
npm install @yicode/yidash
```

## 使用

### import 方式

```javascript
import { math_Plus, tree_Array2Tree, regexp_TrainNumber, number_ValidNumber } from '@yicode/yidash';
console.dir(math_Plus(3, 4));
console.dir(
    tree_Array2Tree([
        { id: 1, pid: 0 },
        { id: 2, pid: 1 },
        { id: 3, pid: 2 }
    ])
);
console.dir(regexp_TrainNumber);
let validNumber = number_ValidNumber();
console.log(validNumber(1.111)); // 1.11
console.log(validNumber(1.571333)); // 1.57
console.log(validNumber('1..221333')); // 1.57
console.log(validNumber('1.2213.33')); // 1.57
console.log(validNumber('1.')); // 1.
console.log(validNumber('1.2')); // 1.20
console.log(validNumber('1.2.')); // 1.20
```

### require 方式

```javascript
const { math_Plus, tree_Array2Tree, regexp_TrainNumber, number_ValidNumber } = require('@yicode/yidash');
console.dir(math_Plus(3, 4));
console.dir(
    tree_Array2Tree([
        { id: 1, pid: 0 },
        { id: 2, pid: 1 },
        { id: 3, pid: 2 }
    ])
);
console.dir(regexp_TrainNumber);
let validNumber = number_ValidNumber();
console.log(validNumber(1.111)); // 1.11
console.log(validNumber(1.571333)); // 1.57
console.log(validNumber('1..221333')); // 1.57
console.log(validNumber('1.2213.33')); // 1.57
console.log(validNumber('1.')); // 1.
console.log(validNumber('1.2')); // 1.20
console.log(validNumber('1.2.')); // 1.20
```

## 文档

[yidash 在线文档地址](https://yidash.chensuiyi.com)

## 待办

-   根据某个一位数组的值，排序另外一个数组
-   四则运算正则

## 仓库

> [github https://github.com/chenbimo/yicode](https://github.com/chenbimo/yicode)

> [gitee https://gitee.com/yicode-team/yicode](https://gitee.com/banshiweichen/yicode)
