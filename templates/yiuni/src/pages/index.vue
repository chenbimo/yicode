<template>
    <layoutView :ref="(el) => utilRef($From, 'layout', el)" :isScroll="true" className="page-index"> </layoutView>
</template>

<script setup>
// 内部集
import { computed } from 'vue';
import { onShow, onHide } from '@dcloudio/uni-app';

// 组件集
import layoutView from '@/components/layoutView.vue';

// 内部集
import { setStorage, goUrl, utilRef, getDeviceInfo, secondToHms } from '@/utils/index.js';
import { $Http } from '@/plugins/http.js';

// 引用集
let $From = $ref({
    layout: {}
});

// 数据集
let $Data = $ref({});

// 计算集
let $Computed = $ref({});

// 方法集
let $Method = {
    async initData() {}
};

onShow(() => {
    $Method.initData();
});

onHide(() => {});
</script>

<style lang="scss" scoped>
.page-index {
    background-color: #f7efed;
}
</style>
