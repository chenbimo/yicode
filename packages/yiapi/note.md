## 数据库字段设计和请求验证

```json
// 公共参数
{
    "name": "角色代号",
    // 字段配置
    "fieldType": "string", //
    "fieldDefault": "",
    "length": 2000,
    "index": false,
    "unique": false,
    "unsigned": false,
    "precision": 1,
    "scale": 5,
    // 请求限制
    "schemaType": "string", // integer number string array
    "schemaDefault": "",
    // -- string
    "minLength": 1,
    "maxLength": 100,
    "pattern": "",
    // -- integer number
    "minimum": 1,
    "maximum": 100,
    "exclusiveMinimum": 1,
    "exclusiveMaximum": 100,
    "multipleOf": 1,
    // -- array
    "items": "", // 如果只有类型，则是列表，否则就是元组,
    "minItems": 1,
    "maxItems": 100,
    "uniqueItems": false,
    "additionalItems": false,
    // -- common
    "enum": []
}
```
