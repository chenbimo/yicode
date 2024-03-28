<template>
    <a-drawer :width="$GlobalData.drawerWidth" :visible="$Data.isShow.editDataDrawer" unmountOnClose @cancel="$Method.onCloseDrawer" @ok="$Method.apiEditData">
        <template #title>
            <template v-if="$Prop.actionType === 'insertData'">{{ `添加${$Prop.pageConfig.name}` }}</template>
            <template v-if="$Prop.actionType === 'updateData'">{{ `编辑${$Prop.pageConfig.name}` }}</template>
        </template>
        <div class="bodyer">
            <a-form :model="$Data.formData" layout="vertical">
                <a-form-item field="version" label="版本号">
                    <a-input v-model="$Data.formData.version" placeholder="合法的版本数字" />
                </a-form-item>
                <a-form-item field="url" label="安装包上传">
                    <input type="file" @change="$Method.onUploadFile" accept=".zip,.rar" />
                </a-form-item>
                <a-form-item field="title" label="轮播标题">
                    <a-input v-model="$Data.formData.title" placeholder="请输入轮播图标题" />
                </a-form-item>
                <a-form-item field="link" label="跳转链接">
                    <a-input v-model="$Data.formData.link" placeholder="请输入跳转地址" />
                </a-form-item>
                <a-form-item field="thumbnail" label="图片上传">
                    <input type="file" @change="$Method.onUploadFile" />
                    <div class="image-lists">
                        <el-image v-if="$Data.formData.thumbnail" style="width: 100px; height: 100px" :src="$Data.formData.thumbnail" :preview-src-list="[$Data.formData.thumbnail]"> </el-image>
                    </div>
                </a-form-item>
                <a-form-item field="is_recommend" label="是否推荐">
                    <el-switch v-model="$Data.formData.is_recommend" :active-value="1" :inactive-value="0" active-text="推荐" inactive-text="不推荐" @change="$Data.onChange()"> </el-switch>
                </a-form-item>
            </a-form>
        </div>
    </a-drawer>
</template>
<script setup>
// 外部集
import valid from 'semver/functions/valid';
// 内部集

// 全局集
const { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 属性集
const $Prop = defineProps({
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
    }
});

// 事件集
const $Emit = defineEmits(['update:modelValue', 'success']);

// 数据集
const $Data = $ref({
    // 显示和隐藏
    isShow: {
        editDataDrawer: false
    },
    // 表单数据
    formData: {
        version: '',
        url: '',
        is_recommend: 0
    }
});

// 方法集
const $Method = {
    async initData() {
        $Data.isShow.editDataDrawer = $Prop.modelValue;
        $Data.formData = _.merge($Data.formData, $Prop.rowData);
    },
    // 关闭抽屉事件
    onCloseDrawer() {
        $Data.isShow.editDataDrawer = false;
        setTimeout(() => {
            $Emit('update:modelValue', false);
        }, 300);
    },
    // 上传文件
    async onUploadFile(event) {
        try {
            const fileObject = event.target.files[0];
            const formData = new FormData();
            formData.append('file', fileObject);
            formData.append('dir', 'version');
            const res = await $Http({
                url: '/upload/local',
                data: formData
            });
            $Data.formData.url = res.url;
        } catch (err) {
            console.log(err);
        }
    },
    // 编辑
    async apiEditData() {
        try {
            if (!valid($Data.formData.version)) {
                Message.warning({
                    content: '请输入正确的版本号'
                });
                return;
            }
            const url = {
                insertData: '/version/insert',
                updateData: '/version/update'
            }[$Prop.actionType];

            const res = await $Http({
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
