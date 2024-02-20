<template>
    <div class="page-user">t2</div>
</template>

<script setup>
// 选项集
defineOptions({
    name: 't2'
});

// 全局集
const { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 工具集
const $Router = useRouter();

// 数据集
const $Data = $ref({
    // 显示和隐藏
    isShow: {}
});

// 方法集
const $Method = {
    initData() {}
};

$Method.initData();
</script>

<style lang="scss" scoped>
.page-user {
}
</style>
