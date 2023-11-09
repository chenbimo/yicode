<template>
    <DefineTemplate>
        <view class="layout-container"></view>
    </DefineTemplate>

    <view class="g-layout view" v-if="$Prop.isScroll === false">
        <ReuseTemplate />
    </view>
    <scroll-view class="g-layout scroll-view" v-if="$Prop.isScroll === true" :refresher-triggered="$Data.refresherTriggered" @scrolltoupper="$Emit('onScrolltoupper')" @scrolltolower="$Emit('onScrolltolower')">
        <ReuseTemplate />
    </scroll-view>
</template>

<script setup>
// 组件集
import { createReusableTemplate } from '@vueuse/core';

// 属性集
let $Prop = defineProps({
    isScroll: {
        type: Boolean,
        default: false
    }
});

// 事件集
let $Emit = defineEmits([
    //
    'update:modelValue',
    'onScrolltoupper',
    'onScrolltolower'
]);

// 引用集
let $From = $ref({});

let [DefineTemplate, ReuseTemplate] = createReusableTemplate();

// 数据集
let $Data = $ref({
    refresherTriggered: false
});

// 方法集
let $Method = {};

defineExpose({
    ...$Method
});
</script>

<style lang="scss" scoped>
.g-layout {
    width: 100vw;
    height: 100vh;
    background-color: #f8f8f8;
}
</style>
