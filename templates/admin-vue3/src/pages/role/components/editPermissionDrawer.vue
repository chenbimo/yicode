<template>
    <a-drawer width="100vw" :visible="$Data.isShow.editDataDrawer" unmountOnClose @cancel="$Method.onCloseDrawer" @ok="$Method.apiEditNavigation">
        <template #title>
            {{ `绑定${$Prop.pageConfig.name2}` }}
        </template>
        <div class="bodyer">
            <div class="left"></div>
            <div class="right"></div>
        </div>
    </a-drawer>
</template>
<script setup>
// 外部集

// 内部集

// 全局集
let { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 属性集
let $Prop = defineProps({
    pageConfig: {
        type: Object
    },
    modelValue: {
        type: Boolean
    },
    actionType: {
        type: String,
        default: 'insertData'
    },
    rowData: {
        type: Object,
        default: {}
    },
    categoryItem: {
        type: Object,
        default: {}
    }
});

// 事件集
let $Emit = defineEmits(['update:modelValue', 'success']);

// 数据集
let $Data = $ref({
    // 显示和隐藏
    isShow: {
        editDataDrawer: false
    },
    // 表单数据
    formData: {
        pid: '',
        name: '',
        link: '',
        sort: 1,
        describe: ''
    }
});

// 方法集
let $Method = {
    async initData() {
        $Data.isShow.editDataDrawer = $Prop.modelValue;
        $Data.formData.pid = $Prop.categoryItem.id;
        $Data.formData = _.merge($Data.formData, $Prop.rowData);
    },
    // 关闭抽屉事件
    onCloseDrawer() {
        $Data.isShow.editDataDrawer = false;
        setTimeout(() => {
            $Emit('update:modelValue', false);
        }, 300);
    },
    // 编辑
    async apiEditNavigation() {
        try {
            if (!$Data.formData.pid) {
                Message.warning({
                    content: '请先选择左侧分类'
                });
                return;
            }
            let url = {
                insertData: '/nav/navigation/insert',
                updateData: '/nav/navigation/update'
            }[$Prop.actionType];
            if (!url) {
                Message.warning({
                    content: '无效的操作类型'
                });
                return;
            }
            let res = await $Http({
                url: url,
                data: $Data.formData
            });
            $Method.onCloseDrawer();
            $Emit('success');
        } catch (err) {
            Message.warning({
                content: err.msg || err
            });
        }
    }
};

$Method.initData();
</script>

<style lang="scss" scoped>
.bodyer {
    width: 100%;
    height: 100%;
    display: flex;
    .left {
        flex: 0 0 40%;
        border-right: 1px solid #ddd;
    }
    .right {
        flex: 0 0 60%;
    }
}
</style>
