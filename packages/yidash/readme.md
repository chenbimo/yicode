### yidash（易大师）

> 实用方法库

![logo](https://static.yicode.tech/images/yidash-logo.png)

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
import { tree_Array2Tree, regexp_TrainNumber, number_ValidNumber } from '@yicode/yidash';
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
const { tree_Array2Tree, regexp_TrainNumber, number_ValidNumber } = require('@yicode/yidash');
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

[yidash 在线文档地址](https://yidash.chensuiyi.me)

## 待办

-   根据某个一位数组的值，排序另外一个数组
-   四则运算正则

## 仓库

> [github https://github.com/chenbimo/yicode](https://github.com/chenbimo/yicode)

> [gitee https://gitee.com/chenbimo/yicode](https://gitee.com/chenbimo/yicode)
