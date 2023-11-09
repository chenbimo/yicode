<template>
    <div class="page-admin page-full">
        <div class="page-action">
            <div class="left">
                <a-button type="primary" @click="$Method.onDataAction('insertData', {})">发送邮件</a-button>
            </div>
            <div class="right">
                <a-input placeholder="请输入搜索关键字" allow-clear></a-input>
                <div class="w-10px"></div>
                <a-button type="primary">搜索</a-button>
            </div>
        </div>
        <div class="page-table">
            <a-table :data="$Data.tableData" :scroll="$GlobalData.tableScroll" :pagination="false" :bordered="$GlobalData.tableBordered" row-key="id">
                <template #columns>
                    <a-table-column title="登录邮箱" data-index="login_email" :width="200"></a-table-column>
                    <a-table-column title="发送者昵称" data-index="from_name" :width="200"></a-table-column>
                    <a-table-column title="发送者邮箱" data-index="from_email" :width="200"></a-table-column>
                    <a-table-column title="接收者邮箱" data-index="to_email"></a-table-column>
                    <a-table-column title="邮件类型" data-index="email_type" :width="150">
                        <template #cell="{ record }">
                            <a-tag v-if="record.email_type === 'common'">普通邮件</a-tag>
                            <a-tag v-if="record.email_type === 'verify'" color="red">验证邮件</a-tag>
                        </template>
                    </a-table-column>
                    <a-table-column title="发送时间" data-index="created_at2" :width="150"></a-table-column>
                    <a-table-column title="发送内容" data-index="text"></a-table-column>
                </template>
            </a-table>
        </div>
        <div class="page-page">
            <div class="left"></div>
            <div class="right">
                <a-pagination v-model:current="$Data.pagination.page" :total="$Data.pagination.total" :default-page-size="$GlobalData.pageLimit" show-total show-jumper @change="$Method.apiSelectData()" />
            </div>
        </div>

        <!-- 编辑数据抽屉 -->
        <sendMailDrawer v-if="$Data.isShow.sendMailDrawer" v-model="$Data.isShow.sendMailDrawer" @success="$Method.fnFreshData"></sendMailDrawer>
    </div>
</template>

<script setup>
// 内部集
import sendMailDrawer from './components/sendMailDrawer.vue';

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
        name: '邮件日志'
    },
    // 显示和隐藏
    isShow: {
        sendMailDrawer: false
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
let $Method = {
    async initData() {
        await $Method.apiSelectData();
    },
    // 触发数据事件
    onDataAction(actionType, rowData) {
        $Data.actionType = actionType;
        $Data.rowData = rowData;

        // 编辑数据
        if ($Data.actionType === 'insertData') {
            $Data.isShow.sendMailDrawer = true;
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
                url: '/mailLog/select',
                data: {
                    page: $Data.pagination.page,
                    limit: $GlobalData.pageLimit
                }
            });
            $Data.tableData = datetime_relativeTime(res.data.rows);
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
