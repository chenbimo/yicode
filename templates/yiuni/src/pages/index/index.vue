<template>
    <view class="page-index page-full">
        <view class="page-bodyer"> </view>
    </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app';
import { useGlobal } from '@/stores/useGlobal.js';
import { appConfig } from '@/config/index.js';
import { setStorage, getStorage } from '@/utils/index.js';
import { $Http } from '@/plugins/http.js';
import { dayjs } from '@/plugins/dayjs.js';
import { utilDatetimeConvert } from '@/utils/index.js';

// 全局集
let { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 数据集
let $Data = $ref({
    noticeString: '',
    tuanTypeConfig: [],
    // 最新的开团
    tuanLists: []
});

// 方法集
let $Method = {
    // 初始数据
    async initData(type) {},
    fnGetMore() {}
};

onShow(() => {
    $Method.initData();
});
</script>

<style lang="scss">
.page-index {
}
</style>
