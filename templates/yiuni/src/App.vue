<script setup>
// 内部集
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

// 全局集
import { useGlobal } from '@/plugins/store.js';

let { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

onLaunch(() => {
    console.log('App Launch');
    $GlobalMethod.apiGetSystemConfig();
});

onShow(() => {
    console.log('App Show');
});

onHide(() => {
    console.log('App Hide');
});
</script>

<style lang="scss">
@import '@/styles/global.scss';
</style>
