<template>
    <a-drawer width="80vw" :visible="$Data.isShow.editDataDrawer" unmountOnClose @cancel="$Method.onCloseDrawer" @ok="$Method.apiEditData">
        <template #title>
            <template v-if="$Prop.actionType === 'insertData'">{{ `添加${$Prop.pageConfig.name}` }}</template>
            <template v-if="$Prop.actionType === 'updateData'">{{ `编辑${$Prop.pageConfig.name}` }}</template>
        </template>
        <div class="bodyer h-full">
            <div class="drawer-toper">
                <div class="left">
                    <a-form :model="$Data.formData" layout="inline">
                        <a-form-item field="code" label="表编码" allow-clear style="width: 400px">
                            <a-input v-model="$Data.formData.code" placeholder="小写字母开头 + 下划线|小写字母|数字" />
                        </a-form-item>
                        <a-form-item field="name" label="表描述">
                            <a-input v-model="$Data.formData.name" placeholder="长度不超过200个字" allow-clear style="width: 400px" />
                        </a-form-item>
                    </a-form>
                </div>
                <div class="right">
                    <a-button type="primary" @click="$Method.addField">添加字段</a-button>
                </div>
            </div>
            <div class="drawer-bodyer">
                <div class="field-item" v-for="field in $Data.formData.fields" :key="Math.random()">
                    <div class="left">
                        <div class="common">
                            <a-space>
                                <a-input v-model="field['comment']" placeholder="名称" style="width: 150px"></a-input>
                                <a-input v-model="field['code']" placeholder="编码"></a-input>
                                <a-select v-model="field['type']" placeholder="类型" style="width: 200px" allow-search>
                                    <a-option :value="key" :label="item.name + ' ' + key" v-for="(item, key) in $Data.fieldType" :key="Math.random()"></a-option>
                                </a-select>
                                <a-input v-model="field['default']" placeholder="默认值" style="width: 150px"></a-input>
                                <a-input-number v-if="$Data.fieldType[field['type']]?.options?.includes('length')" v-model="field['length']" :min="0" placeholder="长度" style="width: 120px"></a-input-number>
                            </a-space>
                        </div>
                        <div class="option">
                            <a-space direction="horizontal" align="center">
                                <a-switch v-if="$Data.fieldType[field['type']]?.options?.includes('unsigned')" v-model="field['unsigned']" type="circle" size="medium" :checked-value="1" :unchecked-value="0" default-checked>
                                    <template #checked> 无符号 </template>
                                    <template #unchecked> 有符号 </template>
                                </a-switch>
                                <a-switch v-model="field['index']" type="circle" size="medium" :checked-value="1" :unchecked-value="0">
                                    <template #checked> 索引 </template>
                                    <template #unchecked> 无索引 </template>
                                </a-switch>
                                <a-switch v-model="field['unique']" type="circle" size="medium" :checked-value="1" :unchecked-value="0">
                                    <template #checked> 唯一 </template>
                                    <template #unchecked> 不唯一 </template>
                                </a-switch>
                            </a-space>
                        </div>
                    </div>
                    <div class="right">
                        <a-button type="primary" status="danger">删除</a-button>
                    </div>
                </div>
            </div>
        </div>
    </a-drawer>
</template>
<script setup>
// 外部集
import { merge as _merge, forOwn as _forOwn, cloneDeep as _cloneDeep } from 'lodash-es';

// 内部集

// 全局集
const { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 属性集
const $Prop = defineProps({
    pageConfig: {
        type: Object
    },
    modelValue: {
        type: Boolean
    },
    actionType: {
        type: String,
        default: 'insertData'
    },
    rowData: {
        type: Object,
        default: {}
    },
    categoryItem: {
        type: Object,
        default: {}
    }
});

// 事件集
const $Emit = defineEmits(['update:modelValue', 'success']);

// 数据集
const $Data = $ref({
    // 显示和隐藏
    isShow: {
        editDataDrawer: false
    },
    // 表单数据
    formData: {
        code: '',
        describe: '',
        fields: []
    },
    fieldType: {
        bigint: {
            name: '大整型',
            type: 'number',
            options: ['unsigned']
        },
        tinyint: {
            name: '微整型',
            type: 'number',
            options: ['length', 'unsigned']
        },
        smallint: {
            name: '小整型',
            type: 'number',
            options: ['unsigned']
        },
        mediumint: {
            name: '中整型',
            type: 'number',
            options: ['unsigned']
        },
        text: {
            name: '文本',
            type: 'text',
            options: ['text_type', 'nullable']
        },
        string: {
            name: '字符串',
            type: 'string',
            options: ['length']
        },
        float: {
            name: '浮点数',
            type: 'float',
            options: ['precision', 'scale', 'unsigned']
        },
        double: {
            name: '双精度实型',
            type: 'float',
            options: ['precision', 'scale', 'unsigned']
        },
        decimal: {
            name: '数字型',
            type: 'float',
            options: ['precision', 'scale', 'unsigned']
        },
        boolean: {
            name: '布尔型',
            type: 'bool',
            options: []
        },
        date: {
            name: '日期',
            type: 'date',
            options: []
        },
        datetime: {
            name: '日期时间',
            type: 'date',
            options: ['precision']
        },
        time: {
            name: '时间',
            type: 'date',
            options: ['precision']
        },
        binary: {
            name: '二进制',
            type: 'binary',
            options: ['length']
        },
        json: {
            name: 'json',
            type: 'json',
            options: []
        },
        jsonb: {
            name: 'jsonb',
            type: 'json',
            options: []
        }
    }
});

// 方法集
const $Method = {
    async initData() {
        $Data.isShow.editDataDrawer = $Prop.modelValue;
        const formData = _merge($Data.formData, $Prop.rowData);
        const fields = [];
        _forOwn(formData.fields, (item, key) => {
            if (item.options.includes('index')) {
                item.index = 1;
            }
            if (item.options.includes('unique')) {
                item.unique = 1;
            }
            if (item.options.includes('unsigned')) {
                item.unsigned = 1;
            }
            fields.push({
                ...item,
                code: key
            });
        });
        formData.fields = fields;
        $Data.formData = formData;
    },
    // 关闭抽屉事件
    onCloseDrawer() {
        $Data.isShow.editDataDrawer = false;
        setTimeout(() => {
            $Emit('update:modelValue', false);
        }, 300);
    },
    async addField() {
        $Data.formData.fields.push({
            type: '',
            comment: '',
            code: '',
            default: '',
            length: '',
            unique: 0,
            unsigned: 1,
            index: 0
        });
    },
    // 编辑
    async apiEditData() {
        try {
            const formData = _cloneDeep($Data.formData);
            formData.fields = formData.fields.map((item) => {
                if (item.length === '') item.length = 0;
                return item;
            });
            const url = {
                insertData: '/tableConfig/insert',
                updateData: '/tableConfig/update'
            }[$Prop.actionType];
            const res = await $Http({
                url: url,
                data: formData
            });
            // $Method.onCloseDrawer();
            // $Emit('success');
        } catch (err) {
            Message.warning({
                content: err.msg || err
            });
        }
    }
};

$Method.initData();
</script>

<style lang="scss">
.bodyer {
    display: flex;
    flex-direction: column;
    .drawer-toper {
        display: flex;
        justify-content: space-between;
        flex: 0 0 auto;
        border-bottom: 2px solid #ddd;
        margin-bottom: 8px;
    }
    .drawer-bodyer {
        flex: 1 1 100%;
        overflow-y: auto;
        .field-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            .left {
                flex: 1 1 100%;
                display: flex;
                justify-content: space-between;
                margin-right: 20px;
                .option {
                    display: flex;
                }
            }
            .right {
                flex: 0 0 auto;
            }
        }
    }
}
</style>
