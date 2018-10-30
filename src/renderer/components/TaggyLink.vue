<template>
    <!--<div>-->
    <!--<h3>{{link.title}}</h3>-->
    <!--<p>{{link.desc}}</p>-->
    <!--<el-button-group>-->
    <!--<el-button icon="el-icon-download"></el-button>-->
    <!--<el-button icon="el-icon-delete" :disabled="link.downloaded"></el-button>-->
    <!--</el-button-group>-->
    <!--</div>-->
    <el-card class="box-card"
             v-loading="loading"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)"
             element-loading-text="Downloading now">
        <div slot="header" class="clearfix">
            <span class="title">{{link.title}}</span>
            <!--<br>-->
            <el-button type="text" icon="el-icon-download" class="taggy-link-actions"
                       :disabled="link.downloaded||updatedLink.downloaded"
                       @click.stop="downloadLink(link)"></el-button>
            <el-button type="text" icon="el-icon-delete" class="taggy-link-actions"
                       @click.stop="removeLink(link)"></el-button>
            <!--<el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-check"-->
                       <!--@click="openNewTab(link)"></el-button>-->
        </div>
        <div class="desc">
            {{link.desc}}
        </div>
        <el-tag v-for="tag in link.Tags" :key="tag" :type="tag.color">{{tag.name}}</el-tag>

    </el-card>
</template>

<script>
    import Link from '../../model/Link'
    import {removeLinkById} from "../../model/Link";

    export default {
        name: "TaggyLink",
        props: {
            link: {type: Object, required: true},
            // openNewTab: {type: Function},
        },
        data() {
            return {
                loading: false,
                updatedLink: this.link
            };
        },
        methods:{
            downloadLink(link){
                const L = new Link(link);
                this.loading = true;
                L.download().then((savedTaggyLink) => {
                    this.updatedLink = savedTaggyLink;
                }).catch((err) => {
                    console.error(err);
                }).finally(() => this.loading = false)
            },
            removeLink(link){
                removeLinkById(link).then(() => this.$emit('removeLinkFromList', link))
            }
        }
    }
</script>

<style scoped>

</style>