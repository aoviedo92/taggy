<template>
    <div>
        <el-autocomplete
                class="inline-input"
                style="width: 100%"
                v-model="inputValue"
                :fetch-suggestions="querySearch"
                placeholder="Please Input"
                :trigger-on-focus="false"
                @select="searchHandleSelect"
                autofocus
                icon="el-icon-edit"
                ref="saveTagInput"
                @keyup.enter.native="doSearch">
            <i class="el-icon-search el-input__icon"
               style="cursor:pointer;"
               @click="doSearch"
               slot="suffix">
            </i>
        </el-autocomplete>
        <el-tag
                :key="tag._id"
                v-for="tag in dynamicTags"
                :closable="true"
                :close-transition="false"
                :type="tag.color"
                @close="searchHandleClose(tag)"
        >
            {{tag.name}}
        </el-tag>
    </div>
</template>

<script>
    import MixinTags from '../../mixins/tags'
    import {findLink} from "../../../model/Link";

    export default {
        name: "Search",
        data() {
            return {
                allTags: [],
                dynamicTags: [],
                inputValue: ''
            }
        },
        mounted() {
            const searchInputDom = document.getElementsByClassName('el-input__inner')[0];
            searchInputDom.focus();
            searchInputDom.placeholder = "Search by Tags and/or by content";
        },
        mixins: [MixinTags],
        methods: {
            searchHandleClose(tag) {
                this.handleClose(tag);//from mixin
                this.doSearch();
            },
            searchHandleSelect(item) {
                this.handleSelect(item);//from mixin
                this.doSearch();
            },
            doSearch() {
                // console.log('do search', this.inputValue, this.dynamicTags);
                const tagNames = this.dynamicTags.map(tag => tag.name);
                const re = new RegExp(this.inputValue, 'i');
                const query = {$or: [{title: re}, {desc: re}]};
                if (tagNames.length > 0) query.tags = {$in: tagNames};
                findLink(query).then((links) => {
                    this.$emit('itemsFound', links);
                })
            },

        }
    }
</script>

<style scoped>

</style>