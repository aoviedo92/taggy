<template>
    <div>
        <ul style="list-style-type: none;padding: 0">

            <li style="display: inline;cursor: pointer"
                v-for="tag in allTags"
                :key="tag._id"
                @click="handleSelect(tag)"
            >
                <el-tag :close-transition="false" :type="tag.color">{{tag.name}}</el-tag>
            </li>
        </ul>
        <el-autocomplete
                class="inline-input"
                v-model="inputValue"
                :fetch-suggestions="querySearch"
                placeholder="Please Input"
                :trigger-on-focus="false"
                @select="handleSelect"
                autofocus
                icon="el-icon-edit"
                @keyup.enter.native="handleInputConfirm"
                ref="saveTagInput"
                style="margin-bottom: 30px"
        >
            <!--<i class="el-icon-edit el-input__icon" slot="suffix"></i>-->
        </el-autocomplete>
        <el-tag
                v-for="tag in dynamicTags"
                :key="tag._id"
                :type="tag.color"
                :closable="true"
                :close-transition="false"
                @close="handleClose(tag)"
        >
            {{tag.name}}
        </el-tag>
    </div>
</template>

<script>
    import {loadAllTags} from "../../../model/Tag";
    import Tag from "../../../model/Tag";
    import MixinTags from '../../mixins/tags'

    export default {
        name: "urlTags",
        data() {
            return {
                dynamicTags: [],
                allTags: [],
                inputVisible: true,
                inputValue: ''
            }
        },
        props: {
            resetTags: {type: Boolean}
        },
        mixins: [MixinTags],
        methods: {

            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    const existsInAllTag = this.allTags.find(tag => tag.name === inputValue);
                    if (existsInAllTag) {
                        this.handleSelect(existsInAllTag);
                        return
                    }
                    const existsInDynamicTags = this.dynamicTags.find(tag => tag.name === inputValue);
                    if (existsInDynamicTags) return;
                    const tag = new Tag({name: inputValue});
                    tag.insert().then(newTag => {
                        newTag.value = newTag.name;
                        this.dynamicTags.push(newTag)
                    })
                }
                this.inputClearAndFocus();
            },
        },
        watch: {
            dynamicTags(newTags) {
                const tagNames = newTags.map(tag => tag.name);
                this.$emit('changeTags', tagNames);
            },
            resetTags(n) {
                if (n) {
                    this.allTags = [...this.allTags, ...this.dynamicTags];
                    this.dynamicTags = []
                }
            }
        }
    }
</script>

<style scoped>

</style>