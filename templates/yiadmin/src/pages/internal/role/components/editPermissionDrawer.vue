<template>
    <a-drawer width="100vw" :visible="$Data.isShow.editDataDrawer" unmountOnClose @cancel="$Method.onCloseDrawer" @ok="$Method.apiRoleBindPermission">
        <template #title>
            {{ `绑定 [ ${$Prop.rowData.name} ] ${$Prop.pageConfig.name2}` }}
        </template>
        <div class="bodyer">
            <div class="left">
                <div class="panel-name">
                    <a-tag color="red" size="medium" :default-checked="true">菜单权限</a-tag>
                </div>
                <a-tree v-model:checked-keys="$Data.menuCheckedKeys" v-model:half-checked-keys="$Data.menuHalfCheckedKeys" :checkable="true" :data="$Data.allMenuTreeData" :field-names="$Data.fieldNames" action-on-node-click="expand" show-line block-node />
            </div>
            <div class="right">
                <div class="panel-name">
                    <a-tag color="red" size="medium" :default-checked="true">接口权限</a-tag>
                </div>
                <a-tree v-model:checked-keys="$Data.apiCheckedKeys" v-model:half-checked-keys="$Data.apiHalfCheckedKeys" :checkable="true" :data="$Data.allApiTreeData" :field-names="$Data.fieldNames" action-on-node-click="expand" show-line block-node />
            </div>
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
        pid: '',
        name: '',
        link: '',
        sort: 1,
        describe: ''
    },
    fieldNames: {
        key: 'id',
        title: 'name'
    },
    // 菜单数据
    allMenuTableData: [],
    allMenuTreeData: [],
    allMenuDataObject: {},
    // 接口数据
    allApiTableData: [],
    allApiTreeData: [],
    allApiDataObject: {},
    // 选中的菜单复选框
    menuCheckedKeys: [],
    // 半选的菜单复选框
    menuHalfCheckedKeys: [],
    // 选中的接口复选框
    apiCheckedKeys: [],
    // 半选的接口复选框
    apiHalfCheckedKeys: []
});

// 方法集
let $Method = {
    async initData() {
        $Data.isShow.editDataDrawer = $Prop.modelValue;
        await $Method.apiSelectAllMenuData();
        await $Method.apiSelectAllApiData();
        $Data.apiCheckedKeys = $Prop.rowData.api_ids
            .split(',')
            .map((id) => Number(id))
            .filter((id) => {
                return $Data.allApiDataObject[id]?.is_bool === 1;
            });
        $Data.menuCheckedKeys = $Prop.rowData.menu_ids
            .split(',')
            .map((id) => Number(id))
            .filter((id) => {
                return $Data.allMenuDataObject[id]?.pid !== 0;
            });
    },
    // 关闭抽屉事件
    onCloseDrawer() {
        $Data.isShow.editDataDrawer = false;
        setTimeout(() => {
            $Emit('update:modelValue', false);
        }, 300);
    },
    // 查询所有菜单数据
    async apiSelectAllMenuData() {
        try {
            let res = await $Http({
                url: '/menu/selectAll',
                data: {}
            });
            let data = res.data.rows.map((item) => {
                // item.name = item.name + ' - ' + item.value;
                return item;
            });
            $Data.allMenuTableData = data;
            $Data.allMenuTreeData = yidash_tree_array2Tree(_.cloneDeep(data));
            $Data.allMenuDataObject = _.keyBy(data, 'id');
        } catch (err) {
            console.log('🚀 ~ file: index.vue:201 ~ apiSelectAllMenuData ~ err', err);
            ElMessage.error(err.msg || err);
        }
    },
    // 查询所有接口数据
    async apiSelectAllApiData() {
        try {
            let res = await $Http({
                url: '/api/selectAll',
                data: {}
            });
            let data = res.data.rows.map((item) => {
                if ($Prop.rowData.api_ids.includes(item.id)) {
                    item.checked = true;
                } else {
                    item.checked = false;
                }
                return item;
            });
            $Data.allApiTableData = data;
            $Data.allApiTreeData = yidash_tree_array2Tree(_.cloneDeep(data));
            $Data.allApiDataObject = _.keyBy(data, 'id');
        } catch (err) {
            console.log('🚀 ~ file: index.vue:227 ~ apiSelectAllApiData ~ err', err);
            ElMessage.error(err.msg || err);
        }
    },
    // 绑定角色权限
    async apiRoleBindPermission() {
        try {
            let menuIds = _.concat($Data.menuCheckedKeys, $Data.menuHalfCheckedKeys);
            let apiIds = _.concat($Data.apiCheckedKeys, $Data.apiHalfCheckedKeys);
            let res = await $Http({
                url: '/role/update',
                data: {
                    id: $Prop.rowData.id,
                    menu_ids: menuIds,
                    api_ids: apiIds
                }
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

<style lang="scss" scoped>
.bodyer {
    width: 100%;
    height: 100%;
    display: flex;
    .left {
        flex: 0 0 40%;
        border-right: 1px solid #ddd;
        padding-right: 15px;
        overflow-y: auto;
    }
    .right {
        flex: 0 0 60%;
        padding-left: 15px;
        overflow-y: auto;
    }
    .panel-name {
        margin-bottom: 10px;
    }
}
</style>
