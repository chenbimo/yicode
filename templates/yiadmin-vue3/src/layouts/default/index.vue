<template>
    <div class="layout-default" :style="{ backgroundImage: 'url(' + utilGetAssets('back/1.png') + ')' }">
        <div class="layout-bodyer">
            <router-view></router-view>
        </div>

    </div>
</template>

<script setup>
// 外部集
import { Message } from '@arco-design/web-vue';
import { isCookieEnabled, getCookie, setCookie, removeCookie } from 'tiny-cookie';

// 全局集
let { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();
let $Router = useRouter();

// 数据集
let $Data = $ref({
    // 显示和隐藏
    isShow: {
    },
});


// 方法集
let $Method = {
    async initData() {},

};

$Method.initData();
</script>

<style lang="scss" scoped>
.layout-default {
}
</style>
