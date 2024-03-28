<template>
    <a-drawer :width="$GlobalData.drawerWidth" :visible="$Data.isShow.sendMailDrawer" unmountOnClose @cancel="$Method.onCloseDrawer" @ok="$Method.apiEditData">
        <template #title> 发送邮件 </template>
        <div class="bodyer">
            <a-form :model="$Data.formData" layout="vertical">
                <a-form-item field="email_type" label="邮件类型">
                    <a-radio-group v-model="$Data.formData.email_type">
                        <a-radio value="common">普通邮件</a-radio>
                        <a-radio value="verify">验证邮件</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item field="to_email" label="接收者">
                    <a-input v-model="$Data.formData.to_email" placeholder="1个或多个邮箱地址，用逗号隔开" />
                </a-form-item>
                <a-form-item field="subject" label="邮件主题">
                    <a-input v-model="$Data.formData.subject" placeholder="不超过200个字符" />
                </a-form-item>
                <a-form-item v-if="$Data.formData.email_type === 'verify'" field="verify_name" label="验证码名称">
                    <a-input v-model="$Data.formData.verify_name" placeholder="小写字母 + [字母|数字] 的组合，如：registerCode" />
                </a-form-item>

                <a-form-item v-if="$Data.formData.email_type === 'common'" field="content" label="发送内容">
                    <a-textarea v-model="$Data.formData.content" placeholder="长度不超过10000个字符" :max-length="10000" show-word-limit allow-clear />
                </a-form-item>
            </a-form>
        </div>
    </a-drawer>
</template>
<script setup>
// 外部集

// 内部集

// 全局集
const { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 属性集
const $Prop = defineProps({
    modelValue: {
        type: Boolean
    }
});

// 事件集
const $Emit = defineEmits(['update:modelValue', 'success']);

// 数据集
const $Data = $ref({
    // 显示和隐藏
    isShow: {
        sendMailDrawer: false
    },
    // 表单数据
    formData: {
        email_type: 'common',
        to_email: '',
        subject: '',
        verify_name: '',
        content: ''
    }
});

// 方法集
const $Method = {
    async initData() {
        $Data.isShow.sendMailDrawer = $Prop.modelValue;
    },
    // 关闭抽屉事件
    onCloseDrawer() {
        $Data.isShow.sendMailDrawer = false;
        setTimeout(() => {
            $Emit('update:modelValue', false);
        }, 300);
    },
    // 编辑
    async apiEditData() {
        try {
            const formData = {
                email_type: $Data.formData.email_type,
                to_email: $Data.formData.to_email,
                subject: $Data.formData.subject
            };
            if ($Data.formData.email_type === 'common') {
                formData.content = $Data.formData.content;
            }
            if ($Data.formData.email_type === 'verify') {
                formData.verify_name = $Data.formData.verify_name;
            }
            const res = await $Http({
                url: '/tool/sendMail',
                data: formData
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
