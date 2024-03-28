<template>
    <div class="page-menu page-full">
        <div class="page-action">
            <div class="left">
                <a-space>
                    <a-button type="primary" @click="$Method.onDataAction('insertData', { pid: 0 })">添加目录</a-button>
                    <a-button type="primary" @click="$Method.onDataAction('insertMenu', { pid: 0 })">添加菜单</a-button>
                </a-space>
            </div>
            <div class="right">
                <a-input placeholder="请输入搜索关键字" allow-clear></a-input>
                <div class="w-10px"></div>
                <a-button type="primary">搜索</a-button>
            </div>
        </div>
        <div class="page-table">
            <a-table :data="$Data.tableData" :scroll="$GlobalData.tableScroll" :pagination="false" :bordered="$GlobalData.tableBordered" row-key="id" hide-expand-button-on-empty>
                <template #columns>
                    <a-table-column title="名称" data-index="name" :width="250"></a-table-column>
                    <a-table-column title="路由" data-index="value" :width="300"></a-table-column>
                    <a-table-column title="描述" data-index="describe"></a-table-column>
                    <a-table-column title="排序" data-index="sort" :width="80"></a-table-column>
                    <a-table-column title="创建时间" data-index="created_at2" :width="150"></a-table-column>
                    <a-table-column title="更新时间" data-index="updated_at2" :width="150"></a-table-column>
                    <a-table-column title="操作" fixed="right" :width="100" align="right">
                        <template #cell="{ record }">
                            <a-dropdown position="br" @select="$Method.onDataAction($event, record)">
                                <a-button>操作<icon-down /></a-button>
                                <template #content>
                                    <a-doption value="updateData"><icon-edit />编辑</a-doption>
                                    <a-doption value="deleteData"> <icon-delete />删除</a-doption>
                                </template>
                            </a-dropdown>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </div>
        <div class="page-page">
            <div class="left"></div>
            <div class="right"></div>
        </div>

        <!-- 编辑目录抽屉 -->
        <editDataDrawer v-if="$Data.isShow.editDataDrawer" v-model="$Data.isShow.editDataDrawer" :pageConfig="$Data.pageConfig" :actionType="$Data.actionType" :rowData="$Data.rowData" @success="$Method.fnFreshData"></editDataDrawer>

        <!-- 编辑菜单抽屉 -->
        <editMenuDrawer v-if="$Data.isShow.editMenuDrawer" v-model="$Data.isShow.editMenuDrawer" :pageConfig="$Data.pageConfig" :actionType="$Data.actionType" :rowData="$Data.rowData" @success="$Method.fnFreshData"></editMenuDrawer>
    </div>
</template>

<script setup>
// 内部集
import editDataDrawer from './components/editDataDrawer.vue';
import editMenuDrawer from './components/editMenuDrawer.vue';

// 选项集
defineOptions({
    name: 'menu2'
});

// 全局集
const { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 工具集

// 数据集
const $Data = $ref({
    // 页面配置
    pageConfig: {
        name: '目录'
    },
    // 显示和隐藏
    isShow: {
        editDataDrawer: false,
        editMenuDrawer: false,
        deleteDataDialog: false
    },
    actionType: 'insertData',
    tableData: [],
    rowData: {},
    pagination: {
        page: 1,
        total: 0
    }
});

// 方法集
const $Method = {
    async initData() {
        await $Method.apiSelectData();
    },
    // 触发数据事件
    async onDataAction(actionType, rowData) {
        $Data.actionType = actionType;
        $Data.rowData = rowData;

        // 编辑目录
        if ($Data.actionType === 'insertData') {
            $Data.isShow.editDataDrawer = true;
            return;
        }

        // 编辑菜单
        if ($Data.actionType === 'insertMenu') {
            $Data.isShow.editMenuDrawer = true;

            return;
        }

        // 编辑菜单
        if ($Data.actionType === 'updateData') {
            if ($Data.rowData.pid === 0) {
                $Data.isShow.editDataDrawer = true;
            } else {
                $Data.isShow.editMenuDrawer = true;
            }

            return;
        }

        // 删除数据
        if ($Data.actionType === 'deleteData') {
            Modal.confirm({
                title: '提示',
                content: '请确认是否删除？',
                modalClass: 'delete-modal-class',
                alignCenter: true,
                onOk() {
                    $Method.apiDeleteData();
                }
            });
            return;
        }
    },
    // 刷新数据
    async fnFreshData() {
        $Method.apiSelectData();
    },
    // 查询用户数据
    async apiSelectData() {
        try {
            const res = await $Http({
                url: '/menu/selectAll',
                data: {
                    page: $Data.pagination.page,
                    limit: $GlobalData.pageLimit
                }
            });
            $Data.tableData = yd_tree_array2Tree(_.sortBy(yd_datetime_relativeTime(res.data.rows), 'sort'));
        } catch (err) {
            Message.error({
                content: err.msg || err
            });
        }
    },
    // 删除菜单
    async apiDeleteData() {
        try {
            const res = await $Http({
                url: '/menu/delete',
                data: {
                    id: $Data.rowData.id
                }
            });
            await $Method.apiSelectData();
            Message.success({
                content: res.msg
            });
        } catch (err) {
            Message.error({
                content: err.msg || err
            });
        }
    }
};

$Method.initData();
</script>

<style lang="scss" scoped>
.page-menu {
}
</style>
