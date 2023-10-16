<template>
    <div class="page-user">t2</div>
</template>

<script setup>
// 选项集
defineOptions({
    name: 't2'
});

// 全局集
let { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 工具集
let $Router = useRouter();

// 数据集
let $Data = $ref({
    // 显示和隐藏
    isShow: {}
});

// 方法集
let $Method = {
    initData() {}
};

$Method.initData();
</script>

<style lang="scss" scoped>
.page-user {
}
</style>
