<template>
    <div class="page-admin page-full">
        <div class="page-setup">
            <a-tabs type="card-gutter" size="medium">
                <a-tab-pane key="base" title="基本配置" class="px-15px">
                    <a-form :model="$Data.formData" auto-label-width>
                        <a-form-item field="site_name" label="站点名称">
                            <a-input v-model="$Data.formData.site_name" placeholder="请输入站点名称" />
                        </a-form-item>
                        <a-form-item field="site_logo" label="站点logo">
                            <a-input v-model="$Data.formData.post" placeholder="请上传站点logo" />
                        </a-form-item>
                        <a-form-item field="site_bei" label="备案号">
                            <a-input v-model="$Data.formData.post" placeholder="请输入备案号" />
                        </a-form-item>
                    </a-form>
                </a-tab-pane>
                <a-tab-pane key="mail" title="邮件配置" class="px-15px">
                    <a-form :model="$Data.formData" auto-label-width>
                        <a-form-item field="smtp_server" label="SMTP 服务器">
                            <a-input v-model="$Data.formData.site_name" placeholder="请输入站点名称" />
                        </a-form-item>
                        <a-form-item field="smtp_port" label="SMTP 端口">
                            <a-input v-model="$Data.formData.post" placeholder="请上传站点logo" />
                        </a-form-item>
                        <a-form-item field="smtp_username" label="SMTP 用户名">
                            <a-input v-model="$Data.formData.post" placeholder="请输入备案号" />
                        </a-form-item>
                        <a-form-item field="site_bei" label="SMTP 密码">
                            <a-input v-model="$Data.formData.post" placeholder="请输入备案号" />
                        </a-form-item>
                        <a-form-item field="site_bei" label="SMTP 验证方式">
                            <a-input v-model="$Data.formData.post" placeholder="请输入备案号" />
                        </a-form-item>
                        <a-form-item field="site_bei" label="SMTP 发件人邮箱">
                            <a-input v-model="$Data.formData.post" placeholder="请输入备案号" />
                        </a-form-item>
                    </a-form>
                </a-tab-pane>
                <a-tab-pane key="other" title="其他配合" class="px-15px">
                    <a-form :model="$Data.formData" auto-label-width>
                        <a-form-item field="site_name" label="联系人">
                            <a-input v-model="$Data.formData.site_name" placeholder="请输入站点名称" />
                        </a-form-item>
                        <a-form-item field="site_logo" label="手机号">
                            <a-input v-model="$Data.formData.post" placeholder="请上传站点logo" />
                        </a-form-item>
                        <a-form-item field="site_bei" label="微信号">
                            <a-input v-model="$Data.formData.post" placeholder="请输入备案号" />
                        </a-form-item>
                    </a-form>
                </a-tab-pane>
            </a-tabs>
        </div>

        <!-- 编辑数据抽屉 -->
        <editDataDrawer v-if="$Data.isShow.editDataDrawer" v-model="$Data.isShow.editDataDrawer" :pageConfig="$Data.pageConfig" :actionType="$Data.actionType" :rowData="$Data.rowData" @success="$Method.fnFreshData"></editDataDrawer>
    </div>
</template>

<script setup>
// 内部集
import editDataDrawer from './components/editDataDrawer.vue';

// 外部集

// 选项集
defineOptions({
    name: 'appConfig'
});

// 全局集
const { $GlobalData, $GlobalComputed, $GlobalMethod } = useGlobal();

// 工具集

// 数据集
const $Data = $ref({
    // 页面配置
    pageConfig: {
        name: '项目配置'
    },
    // 显示和隐藏
    isShow: {
        editDataDrawer: false,
        deleteDataDialog: false
    },
    formData: {
        site_name: '',
        site_logo: '',
        site_bei: ''
    }
});

// 方法集
const $Method = {
    async initData() {},
    // 触发数据事件
    onDataAction(actionType, rowData) {
        $Data.actionType = actionType;
        $Data.rowData = rowData;

        // 编辑数据
        if ($Data.actionType === 'insertData' || $Data.actionType === 'updateData') {
            $Data.isShow.editDataDrawer = true;
            return;
        }

        // 删除数据
        if ($Data.actionType === 'deleteData') {
            $Data.isShow.deleteDataDialog = true;
            return;
        }
    },
    // 刷新数据
    async fnFreshData() {
        $Method.apiSelectData();
    },
    // 查询用户数据
    async apiSelectData() {
        try {
            const res = await $Http({
                url: '/tableConfig/select',
                data: {
                    page: $Data.pagination.page,
                    limit: $GlobalData.pageLimit
                }
            });
            $Data.tableData = res.data.rows;
            $Data.pagination.total = res.data.total;
        } catch (err) {
            console.log('🚀 ~ file: index.vue:86 ~ apiSelectData ~ err:', err);
            Message.error(err.msg || err);
        }
    }
};

$Method.initData();
</script>

<style lang="scss" scoped>
.page-admin {
}
</style>
