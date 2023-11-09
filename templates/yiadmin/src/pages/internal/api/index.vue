<template>
    <div class="page-api page-full">
        <div class="page-action">
            <div class="left"></div>
            <div class="right">
                <a-input placeholder="请输入搜索关键字" allow-clear></a-input>
                <div class="w-10px"></div>
                <a-button type="primary">搜索</a-button>
            </div>
        </div>
        <div class="page-table no-page">
            <a-table :data="$Data.tableData" :scroll="$GlobalData.tableScroll" :pagination="false" :bordered="$GlobalData.tableBordered" row-key="id">
                <template #columns>
                    <a-table-column title="名称" data-index="name" :width="250"></a-table-column>
                    <a-table-column title="路由" data-index="value" :width="300"></a-table-column>
                    <a-table-column title="描述" data-index="describe"></a-table-column>
                    <a-table-column title="排序" data-index="sort" :width="80"></a-table-column>
                    <a-table-column title="创建时间" data-index="created_at2" :width="150"></a-table-column>
                    <a-table-column title="更新时间" data-index="updated_at2" :width="150"></a-table-column>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
// 选项集
defineOptions({
    name: 'api'
});

// 全局集
let { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 工具集
let $Router = useRouter();

// 数据集
let $Data = $ref({
    pagination: {
        page: 1,
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
                url: '/api/selectAll',
                data: {
                    page: $Data.pagination.page,
                    limit: $GlobalData.pageLimit
                }
            });

            $Data.tableData = tree_array2Tree(_.sortBy(datetime_relativeTime(res.data.rows), 'sort'));
        } catch (err) {}
    }
};

$Method.initData();
</script>

<style lang="scss" scoped>
.page-api {
}
</style>
