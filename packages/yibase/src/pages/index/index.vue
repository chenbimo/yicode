<template>
    <div class="bg">index</div>
    <div>
        <img :src="utilGetAssets('logo.png')" />
    </div>
    <el-button type="primary">Primary</el-button>
    <div>{{ $t('name') }}</div>
</template>
<script setup></script>
