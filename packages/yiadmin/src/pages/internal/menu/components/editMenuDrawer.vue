<template>
    <a-drawer :width="$GlobalData.drawerWidth" :visible="$Data.isShow.editMenuDrawer" unmountOnClose @cancel="$Method.onCloseDrawer" @ok="$Method.apiEditData">
        <template #title>
            <template v-if="$Prop.actionType === 'insertMenu'">添加菜单</template>
            <template v-if="$Prop.actionType === 'updateData'">编辑菜单</template>
        </template>
        <div class="bodyer">
            <a-form :model="$Data.formData" layout="vertical">
                <a-form-item field="category" label="所属目录">
                    <a-select v-model="$Data.formData.pid">
                        <a-option v-for="item in $Data.menuCategory" :key="item.id" :value="item.id" :label="item.name"></a-option>
                    </a-select>
                </a-form-item>
                <a-form-item field="name" label="菜单名称">
                    <a-input v-model="$Data.formData.name" placeholder="任何合法的字符" />
                </a-form-item>
                <a-form-item field="value" label="菜单路由">
                    <a-input v-model="$Data.formData.value" placeholder="字母开头+(字母|数字|短横线)的组合" />
                </a-form-item>
                <a-form-item field="describe" label="菜单描述">
                    <a-textarea v-model="$Data.formData.describe" placeholder="长度不超过200个字" :max-length="200" show-word-limit allow-clear />
                </a-form-item>
            </a-form>
        </div>
    </a-drawer>
</template>
<script setup>
// 外部集
import { merge as _merge } from 'lodash-es';

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
        default: 'insertMenu'
    },
    rowData: {
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
        editMenuDrawer: false
    },
    // 表单数据
    formData: {
        pid: 0,
        name: '',
        value: '',
        describe: ''
    },
    menuCategory: []
});

// 方法集
const $Method = {
    async initData() {
        $Data.isShow.editMenuDrawer = $Prop.modelValue;
        $Data.formData = _merge($Data.formData, $Prop.rowData);
        $Method.apiSelectMenuCategory();
    },
    // 关闭抽屉事件
    onCloseDrawer() {
        $Data.isShow.editMenuDrawer = false;
        setTimeout(() => {
            $Emit('update:modelValue', false);
        }, 300);
    },
    // 查询菜单目录
    async apiSelectMenuCategory() {
        try {
            const res = await $Http({
                url: '/menu/selectAll',
                data: {
                    pid: 0
                }
            });
            $Data.menuCategory = res.data.rows.filter((item) => item.pid === 0);
        } catch (err) {
            Message.error({
                content: err.msg || err
            });
        }
    },
    // 编辑
    async apiEditData() {
        try {
            const url = {
                insertMenu: '/menu/insert',
                updateData: '/menu/update'
            }[$Prop.actionType];

            const res = await $Http({
                url: url,
                data: $Data.formData
            });
            Message.success({
                content: res.msg
            });
            $Method.onCloseDrawer();
            $Emit('success');
        } catch (err) {
            Message.warning({
                content: err.msg || err
            });
        }
    }
};

$Method.initData();
</script>
