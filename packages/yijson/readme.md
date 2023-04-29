# yijson（易 JSON，json 压缩和解压工具）

## 参考方案

-   [参考方案 https://github.com/KilledByAPixel/JSONCrush](https://github.com/KilledByAPixel/JSONCrush)

-   [参考方案 https://github.com/rgcl/jsonpack](https://github.com/rgcl/jsonpack)

注意：jsonCrush 的压缩效果更好，压缩速度更慢

## jsonCrush 压缩

```javascript
import { jsonCrush } from '@yicode/yijson';
let json = {
    type: 'world',
    name: 'earth',
    children: [
        {
            type: 'continent',
            name: 'America',
            children: [
                {
                    type: 'country',
                    name: 'Chile',
                    children: [
                        {
                            type: 'commune',
                            name: 'Antofagasta'
                        }
                    ]
                }
            ]
        },
        {
            type: 'continent',
            name: 'Europe'
        }
    ]
};

let packed = jsonCrush(json);

console.log(packed);
// 打印:
// .world-earth*0America*untry-Chile*mmune-Antofagasta'11),.co0Europe'1)*'~children![.co-'~name!'.('type!'0ntinent-1)]10.-*_
```

## jsonUncrush 解压

```javascript
import { jsonUncrush } from '@yicode/yijson';
let text = '.world-earth*0America*untry-Chile*mmune-Antofagasta'11),.co0Europe'1)*'~children![.co-'~name!'.('type!'0ntinent-1)]10.-*_';

let unpacked = jsonUncrush(text);

console.log(unpacked);
// 打印:
// {
//     type: 'world',
//     name: 'earth',
//     children: [
//         {
//             type: 'continent',
//             name: 'America',
//             children: [
//                 {
//                     type: 'country',
//                     name: 'Chile',
//                     children: [
//                         {
//                             type: 'commune',
//                             name: 'Antofagasta'
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             type: 'continent',
//             name: 'Europe'
//         }
//     ]
// }
```

## jsonPack 压缩

```javascript
import { jsonPack } from '@yicode/yijson';
let json = {
    type: 'world',
    name: 'earth',
    children: [
        {
            type: 'continent',
            name: 'America',
            children: [
                {
                    type: 'country',
                    name: 'Chile',
                    children: [
                        {
                            type: 'commune',
                            name: 'Antofagasta'
                        }
                    ]
                }
            ]
        },
        {
            type: 'continent',
            name: 'Europe'
        }
    ]
};

let packed = jsonPack(json);

console.log(packed);
// 打印:
// "type|world|name|earth|children|continent|America|country|Chile|commune|Antofagasta|Europe^^^$0|1|2|3|4|@$0|5|2|6|4|@$0|7|2|8|4|@$0|9|2|A]]]]]|$0|5|2|B]]]"
```

## jsonUnpack 解压

```javascript
import { jsonUnpack } from '@yicode/yijson';
let text = 'type|world|name|earth|children|continent|America|country|Chile|commune|Antofagasta|Europe^^^$0|1|2|3|4|@$0|5|2|6|4|@$0|7|2|8|4|@$0|9|2|A]]]]]|$0|5|2|B]]]';

let unpacked = jsonUnpack(text);

console.log(unpacked);
// 打印:
// {
//     type: 'world',
//     name: 'earth',
//     children: [
//         {
//             type: 'continent',
//             name: 'America',
//             children: [
//                 {
//                     type: 'country',
//                     name: 'Chile',
//                     children: [
//                         {
//                             type: 'commune',
//                             name: 'Antofagasta'
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             type: 'continent',
//             name: 'Europe'
//         }
//     ]
// }
```
