<template>
    <layoutView :ref="(el) => utilRef($From, 'layout', el)" :isScroll="true" className="page-user"> </layoutView>
</template>

<script setup>
// 外部集
import { onLoad, onShow } from '@dcloudio/uni-app';

// 组件集
import layoutView from '@/components/layoutView.vue';

// 内部集
import { setStorage, getStorage, goUrl, utilRef } from '@/utils/index.js';
import { $Http } from '@/plugins/http.js';
import { useGlobal } from '@/plugins/store.js';

let { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 引用集
let $From = $ref({
    layout: {}
});

// 数据集
let $Data = $ref({
    options: {}
});

// 方法集
let $Method = {
    // 初始化数据
    async initData() {}
};

onLoad((options = {}) => {
    $Data.options = options;
});

onShow(() => {
    $Method.initData();
});
</script>

<style lang="scss" scoped>
.page-user {
}
</style>
