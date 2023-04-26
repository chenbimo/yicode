<template>
    <div class="page-role page-full">
        <div class="page-action">
            <div class="left">
                <a-button type="primary">添加</a-button>
            </div>
            <div class="right">
                <a-input placeholder="请输入搜索关键字" allow-clear></a-input>
                <div class="w-10px"></div>
                <a-button type="primary">搜索</a-button>
            </div>
        </div>
        <div class="page-table">
            <a-table :data="$Data.tableData" :pagination="false" :bordered="$GlobalData.tableBordered" row-key="id">
                <template #columns>
                    <a-table-column title="名称" data-index="name"></a-table-column>
                    <a-table-column title="编码" data-index="code"></a-table-column>
                    <a-table-column title="描述" data-index="describe"></a-table-column>
                    <a-table-column title="菜单" data-index="menu_ids"></a-table-column>
                    <a-table-column title="接口" data-index="api_ids"></a-table-column>
                    <a-table-column title="创建时间" data-index="created_at" :width="150"></a-table-column>
                    <a-table-column title="更新时间" data-index="updated_at" :width="150"></a-table-column>
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
                <a-pagination :total="$Data.pagination.total" show-total />
            </div>
        </div>
    </div>
</template>

<script setup>
// 全局集
let { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 工具集
let $Router = useRouter();

// 数据集
let $Data = $ref({
    pagination: {
        page: 1,
        limit: 20,
        total: 0
    },
    tableData: []
});

// 方法集
let $Method = {
    async initData() {
        await $Method.apiSelectData();
    },
    // 查询用户数据
    async apiSelectData() {
        try {
            let res = await $Http({
                url: '/role/select',
                data: {
                    page: $Data.pagination.page,
                    limit: $Data.pagination.limit
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
.page-role {
}
</style>
