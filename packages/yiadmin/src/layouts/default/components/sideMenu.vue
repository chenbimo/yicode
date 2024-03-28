<template>
    <a-menu :default-open-keys="[$Prop.openMenuId]" :default-selected-keys="[$Prop.selectedItemId]" :style="{ width: '100%' }" accordion @menu-item-click="$Method.onMenuItemClick">
        <a-sub-menu v-for="menu in $Prop.menuTree" :key="menu.id">
            <template #title> <icon-apps /> {{ menu.name }} </template>
            <a-menu-item v-for="item in menu.children" :key="item.id">
                <icon-file />
                {{ item.name }}
            </a-menu-item>
        </a-sub-menu>
    </a-menu>
</template>
<script setup>
// 全局集
const { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 属性集
const $Prop = defineProps({
    openMenuId: {
        type: Number
    },
    selectedItemId: {
        type: Number
    },
    menuObject: {
        type: Object
    },
    menuTree: {
        type: Array
    }
});

// 数据集
const $Data = $ref({});

// 方法集
const $Method = {
    async initData() {},
    // 点击菜单项
    onMenuItemClick(id) {
        const selectedItem = $Prop.menuObject[id];
        $Router.push(selectedItem.value);
    }
};
</script>
