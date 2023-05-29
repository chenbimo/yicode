<template>
    <a-drawer :width="$GlobalData.drawerWidth" :visible="$Data.isShow.editDataDrawer" unmountOnClose @cancel="$Method.onCloseDrawer" @ok="$Method.apiEditNavigation">
        <template #title>
            <template v-if="$Prop.actionType === 'insertData'">{{ `添加${$Prop.pageConfig.name}` }}</template>
            <template v-if="$Prop.actionType === 'updateData'">{{ `编辑${$Prop.pageConfig.name}` }}</template>
        </template>
        <div class="bodyer">
            <a-form :model="$Data.formData" layout="vertical">
                <a-form-item field="name" label="角色名称">
                    <a-input v-model="$Data.formData.name" placeholder="请输入角色名称..." />
                </a-form-item>
                <a-form-item field="link" label="菜单权限">
                    <a-input v-model="$Data.formData.link" placeholder="请输入菜单权限..." />
                </a-form-item>
                <a-form-item field="describe" label="接口权限">
                    <a-input v-model="$Data.formData.describe" placeholder="请输入接口权限..." />
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
    },
    categoryItem: {
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
        pid: '',
        name: '',
        link: '',
        sort: 1,
        describe: ''
    },
    menuData: [],
    menuTree: [],
    apiData: [],
    apiTree: []
});

// 方法集
let $Method = {
    async initData() {
        $Data.isShow.editDataDrawer = $Prop.modelValue;
        $Data.formData.pid = $Prop.categoryItem.id;
        $Data.formData = _.merge($Data.formData, $Prop.rowData);
        $Method.apiGetAllApi();
        $Method.apiGetAllMenu();
    },
    // 关闭抽屉事件
    onCloseDrawer() {
        $Data.isShow.editDataDrawer = false;
        setTimeout(() => {
            $Emit('update:modelValue', false);
        }, 300);
    },
    // 获取所有菜单
    async apiGetAllMenu() {
        try {
            let res = await $Http({
                url: '/menu/selectAll',
                data: {}
            });
            $Data.menuData = res.data.rows;
        } catch (err) {
            console.log('🚀 ~ file: editDataDrawer.vue:90 ~ apiGetAllMenu ~ err:', err);
        }
    },
    // 获取所有接口
    async apiGetAllApi() {
        try {
            let res = await $Http({
                url: '/api/selectAll',
                data: {}
            });
            $Data.apiData = res.data.rows;
        } catch (err) {
            console.log('🚀 ~ file: editDataDrawer.vue:90 ~ apiGetAllMenu ~ err:', err);
        }
    },
    // 编辑
    async apiEditNavigation() {
        try {
            if (!$Data.formData.pid) {
                Message.warning({
                    content: '请先选择左侧分类'
                });
                return;
            }
            let url = {
                insertData: '/nav/navigation/insert',
                updateData: '/nav/navigation/update'
            }[$Prop.actionType];
            if (!url) {
                Message.warning({
                    content: '无效的操作类型'
                });
                return;
            }
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
