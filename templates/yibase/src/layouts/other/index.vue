<template>
    <div class="layout-default">
        other
        <div class="layout-bodyer">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
// 外部集
import { Message } from '@arco-design/web-vue';

// 全局集
let { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();
let $Router = useRouter();

// 数据集
let $Data = $ref({
    // 显示和隐藏
    isShow: {}
});

// 方法集
let $Method = {
    async initData() {}
};

$Method.initData();
</script>

<style lang="scss" scoped>
.layout-default {
}
</style>
