<template>
    <div class="page-admin page-full">
        <div class="page-action">
            <div class="left"></div>
            <div class="right">
                <a-input placeholder="请输入搜索关键字" allow-clear></a-input>
                <div class="w-10px"></div>
                <a-button type="primary">搜索</a-button>
            </div>
        </div>
        <div class="page-table">
            <a-table :data="$Data.tableData" :scroll="$GlobalData.tableScroll" :pagination="false" :bordered="$GlobalData.tableBordered" row-key="id">
                <template #columns>
                    <a-table-column title="用户名" data-index="username" :width="200"></a-table-column>
                    <a-table-column title="昵称" data-index="nickname" :width="200"></a-table-column>
                    <a-table-column title="角色" data-index="role_codes" :width="150"></a-table-column>
                    <a-table-column title="IP地址" data-index="ip" :width="200"></a-table-column>
                    <a-table-column title="登录时间" data-index="created_at2" :width="150"></a-table-column>
                    <a-table-column title="UA" data-index="ua" ellipsis></a-table-column>
                </template>
            </a-table>
        </div>
        <div class="page-page">
            <div class="left"></div>
            <div class="right">
                <a-pagination :total="$Data.pagination.total" show-total />
            </div>
        </div>

        <!-- 编辑数据抽屉 -->
        <editDataDrawer v-if="$Data.isShow.editDataDrawer" v-model="$Data.isShow.editDataDrawer" :pageConfig="$Data.pageConfig" :actionType="$Data.actionType" :rowData="$Data.rowData" @success="$Method.fnFreshData"></editDataDrawer>
    </div>
</template>

<script setup>
// 内部集
import editDataDrawer from './components/editDataDrawer.vue';

// 外部集

// 选项集
defineOptions({
    name: 'dict'
});

// 全局集
let { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 工具集

// 数据集
let $Data = $ref({
    // 页面配置
    pageConfig: {
        name: '登录日志'
    },
    // 显示和隐藏
    isShow: {
        editDataDrawer: false,
        deleteDataDialog: false
    },
    actionType: 'insertData',
    tableData: [],
    rowData: {},
    pagination: {
        page: 1,
        limit: 30,
        total: 0
    }
});

// 方法集
let $Method = {
    async initData() {
        await $Method.apiSelectData();
    },
    // 触发数据事件
    onDataAction(actionType, rowData) {
        $Data.actionType = actionType;
        $Data.rowData = rowData;

        // 编辑数据
        if ($Data.actionType === 'insertData' || $Data.actionType === 'updateData') {
            $Data.isShow.editDataDrawer = true;
            return;
        }

        // 删除数据
        if ($Data.actionType === 'deleteData') {
            $Data.isShow.deleteDataDialog = true;
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
            let res = await $Http({
                url: '/loginLog/select',
                data: {
                    page: $Data.pagination.page,
                    limit: $Data.pagination.limit
                }
            });
            $Data.tableData = yidash_datetime_relativeTime(res.data.rows);
            $Data.pagination.total = res.data.total;
        } catch (err) {
            console.log('🚀 ~ file: index.vue:86 ~ apiSelectData ~ err:', err);
            Message.error(err.msg || err);
        }
    }
};

$Method.initData();
</script>

<style lang="scss" scoped>
.page-admin {
}
</style>
