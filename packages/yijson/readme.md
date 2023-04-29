# yijson（易 JSON，json 压缩和解压工具）

> 参考方案

[参考方案 https://github.com/rgcl/jsonpack](https://github.com/rgcl/jsonpack)

## 压缩

```javascript
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

## 解压

```javascript
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
