<template>
    <div class="app">
        <router-view></router-view>
    </div>
</template>
<script setup>
// 引入后进行初始化
const { $GlobalData } = useGlobal();

onMounted(() => {
    window.onresize = onResizeWindow;
    onResizeWindow();
});

function onResizeWindow() {
    nextTick().then(() => {
        $GlobalData.clientHeight = document.body.clientHeight;
        $GlobalData.clientWidth = document.body.clientWidth;
    });
}
</script>

<style lang="scss">
@import '@/styles/global.scss';
</style>
