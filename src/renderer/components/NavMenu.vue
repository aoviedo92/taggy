<template>
    <el-menu
            default-active="0"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
        <el-menu-item index="1">
            <i class="el-icon-setting"></i>
        </el-menu-item>
        <el-menu-item index="2"><i class="el-icon-plus"></i></el-menu-item>
    </el-menu>
</template>
<script>
    export default {
        data() {
            return {
                activeIndex: '1',
                activeIndex2: '1'
            };
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key);
                switch (key) {
                    case "2":
                        this.$emit('saveUrlF');
                        break;
                }
            }
        }
    }
</script>
<style></style>