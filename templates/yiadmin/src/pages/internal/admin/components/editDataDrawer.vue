<template>
    <a-drawer :width="$GlobalData.drawerWidth" :visible="$Data.isShow.editDataDrawer" unmountOnClose @cancel="$Method.onCloseDrawer" @ok="$Method.apiEditData">
        <template #title>
            <template v-if="$Prop.actionType === 'insertData'">{{ `添加${$Prop.pageConfig.name}` }}</template>
            <template v-if="$Prop.actionType === 'updateData'">{{ `编辑${$Prop.pageConfig.name}` }}</template>
        </template>
        <div class="bodyer">
            <a-form :model="$Data.formData" layout="vertical">
                <a-form-item field="name" label="角色">
                    <a-select v-model="$Data.formData.role_codes" @change="$Method.onChangeCategory">
                        <a-option v-for="item in $Data.roleAll" :key="item.id" :value="item.code" :label="item.name"></a-option>
                    </a-select>
                </a-form-item>
                <a-form-item field="username" label="账号">
                    <a-input v-model="$Data.formData.username" placeholder="字母开头+(字母|数字|下划线|短横线)的组合" />
                </a-form-item>
                <a-form-item field="nickname" label="昵称">
                    <a-input v-model="$Data.formData.nickname" placeholder="任何合法的字符" />
                </a-form-item>
                <a-form-item field="password" label="密码">
                    <a-input v-model="$Data.formData.password" placeholder="不小于6位的字母、数字、下划线和短横线的组合" />
                </a-form-item>
            </a-form>
        </div>
    </a-drawer>
</template>
<script setup>
// 外部集

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
    category_code: {
        type: String
    },
    categoryAll: {
        type: Array,
        default: []
    }
});

// 事件集
const $Emit = defineEmits(['update:modelValue', 'success', 'changeCategory']);

// 数据集
const $Data = $ref({
    // 显示和隐藏
    isShow: {
        editDataDrawer: false
    },
    // 表单数据
    formData: {
        role_codes: '',
        username: '',
        nickname: '',
        password: ''
    },
    roleAll: []
});

// 方法集
const $Method = {
    async initData() {
        await $Method.apiSelectAllRole();
        $Data.isShow.editDataDrawer = $Prop.modelValue;
        $Data.formData = _.merge($Data.formData, _.omit($Prop.rowData, ['password']));
    },
    // 关闭抽屉事件
    onCloseDrawer() {
        $Data.isShow.editDataDrawer = false;
        setTimeout(() => {
            $Emit('update:modelValue', false);
        }, 300);
    },
    // 查询字典分类
    async apiSelectAllRole() {
        try {
            const res = await $Http({
                url: '/role/selectAll',
                data: {}
            });
            $Data.roleAll = res.data.rows;
        } catch (err) {
            console.log('🚀 ~ file: index.vue:86 ~ apiSelectData ~ err:', err);
            Message.error(err.msg || err);
        }
    },
    // 编辑
    async apiEditData() {
        try {
            const url = {
                insertData: '/admin/insert',
                updateData: '/admin/update'
            }[$Prop.actionType];

            const res = await $Http({
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
