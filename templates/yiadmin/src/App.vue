<template>
    <div class="app">
        <a-config-provider size="small">
            <router-view></router-view>
        </a-config-provider>
    </div>
</template>
<script setup>
// 引入后进行初始化
let { $GlobalData } = useGlobal();
</script>

<style lang="scss">
@import '@/styles/global.scss';
</style>
