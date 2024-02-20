<template>
    <div class="page-user page-full">
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
                    <a-table-column title="昵称" data-index="nickname"></a-table-column>
                    <a-table-column title="用户名" data-index="username"></a-table-column>
                    <a-table-column title="角色" data-index="role_codes"></a-table-column>
                    <a-table-column title="手机" data-index="phone"></a-table-column>
                    <a-table-column title="微信" data-index="wexin"></a-table-column>
                    <a-table-column title="QQ" data-index="qq"></a-table-column>
                    <a-table-column title="邮箱" data-index="email"></a-table-column>
                    <a-table-column title="签名" data-index="bio"></a-table-column>
                    <a-table-column title="操作" fixed="right" :width="100" align="right">
                        <template #cell="{ record }">
                            <a-dropdown position="br" @select="$Method.onExecAction($event, record)">
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
            <div class="right">
                <a-pagination v-model:current="$Data.pagination.page" :total="$Data.pagination.total" :default-page-size="$GlobalData.pageLimit" show-total show-jumper @change="$Method.apiSelectData()" />
            </div>
        </div>
    </div>
</template>

<script setup>
// 选项集
defineOptions({
    name: 'user'
});

// 全局集
const { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 工具集
const $Router = useRouter();

// 数据集
const $Data = $ref({
    pagination: {
        page: 1,
        total: 0
    },
    tableData: []
});

// 方法集
const $Method = {
    async initData() {
        await $Method.apiSelectData();
    },
    // 查询用户数据
    async apiSelectData() {
        try {
            const res = await $Http({
                url: '/user/select',
                data: {
                    page: $Data.pagination.page,
                    limit: $GlobalData.pageLimit
                }
            });
            $Data.tableData = res.data.rows;
            $Data.pagination.total = res.data.total;
        } catch (err) {
        } finally {
        }
    }
};

$Method.initData();
</script>

<style lang="scss" scoped>
.page-user {
}
</style>
