<template>
    <layoutView :ref="(el) => utilRef($From, 'layout', el)" :isScroll="false">
        <view class="page-login"> </view>
    </layoutView>
</template>
<script setup>
// 外部集

// 组件集
import layoutView from '@/components/layoutView.vue';

// 工具集
import { goUrl, utilRef } from '@/utils/index.js';
import { $AppConfig } from '@/config/app.js';

// 引用集
let $From = $ref({
    layout: {}
});

// 数据集
let $Data = $ref({
    isShow: {}
});

// 方法集
let $Method = {};
</script>
<style lang="scss" scoped>
.page-login {
}
</style>
