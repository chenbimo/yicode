<template>
    <a-drawer :width="$GlobalData.drawerWidth" :visible="$Data.isShow.editDataDrawer" unmountOnClose @cancel="$Method.onCloseDrawer" @ok="$Method.apiEditData">
        <template #title>
            <template v-if="$Prop.actionType === 'insertData'">{{ `添加${$Prop.pageConfig.name}` }}</template>
            <template v-if="$Prop.actionType === 'updateData'">{{ `编辑${$Prop.pageConfig.name}` }}</template>
        </template>
        <div class="bodyer">
            <a-form :model="$Data.formData" layout="vertical">
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

// 内部集

// 全局集
let { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 属性集
let $Prop = defineProps({
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
    }
});

// 事件集
let $Emit = defineEmits(['update:modelValue', 'success']);

// 数据集
let $Data = $ref({
    // 显示和隐藏
    isShow: {
        editDataDrawer: false
    },
    // 表单数据
    formData: {
        pid: 0,
        name: '',
        value: '',
        describe: ''
    }
});

// 方法集
let $Method = {
    async initData() {
        $Data.isShow.editDataDrawer = $Prop.modelValue;
        $Data.formData = _.merge($Data.formData, $Prop.rowData);
        // $Data.formData.pid = $Prop.rowData.id;
    },
    // 关闭抽屉事件
    onCloseDrawer() {
        $Data.isShow.editDataDrawer = false;
        setTimeout(() => {
            $Emit('update:modelValue', false);
        }, 300);
    },
    // 编辑
    async apiEditData() {
        try {
            let url = {
                insertData: '/menu/insert',
                updateData: '/menu/update'
            }[$Prop.actionType];

            let res = await $Http({
                url: url,
                data: $Data.formData
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
