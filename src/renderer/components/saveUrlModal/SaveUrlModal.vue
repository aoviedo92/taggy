<template>
    <el-dialog
            title="New Taggy link"
            :visible="show"
            :show-close="true"
            :before-close="() => $emit('hide')"
            close-on-press-escape
            v-loading.fullscreen.lock="loading"
            :element-loading-text="loadingText"
            fullscreen
            size="full">
        <el-card class="box-card" style="padding-bottom: 50px;padding-top: 50px;background-color: rgba(204, 204, 204, 0.10);text-align: center">
            <p style="font-size: 18px;padding: 0;margin: 0;color:#555">Enter a new url and tag it!</p>
            <p style="font-size: 12px;padding: 0;margin: 0;color:#959595">After that you can either save only the link or download it</p>
            <br>
            <el-input v-model="url" placeholder="Type a url..." id="type_a_url"></el-input>
            <div style="margin-top: 30px">
                <url-tags @changeTags="(tagNames) => {this.tags = tagNames}" :reset-tags="!show"></url-tags>
                <span slot="footer" class="dialog-footer" >
                    <el-button icon="el-icon-check" circle @click="saveLink" type="success" :disabled="!url"></el-button>
                    <el-button type="primary" icon="el-icon-download" circle @click="downloadLink" :disabled="!url"></el-button>
                    <el-button @click="$emit('hide')" circle icon="el-icon-close"></el-button>
                </span>

            </div>
        </el-card>
    </el-dialog>
</template>

<script>
    import Link from '../../../model/Link'
    import UrlTags from "./UrlTags";
    export default {
        name: "SaveUrlModal",
        components: {UrlTags},
        props: {
            show: {type: Boolean,},
        },
        mounted(){
            // new Link();
            // document.getElementById("type_a_url").getElementsByTagName("input")[0].focus();
            // document.getElementById("type_a_url").getElementsByTagName("input")[0].placeholder = 'Type a url...'
            console.log('document.getElementById("type_a_url")',document.getElementById("type_a_url"));
        },
        data() {
            return {
                url: '',
                loading: false,
                loadingText: '',
                tags: []
            };
        },
        methods:{
            saveLink(){
                if (!this.url)return;
                const l = new Link({url: this.url, tags: this.tags});
                this.loadingText = 'Saving your link...';
                this.loading = true;
                l.save()
                    .then((newLink) => {
                        this.$message.success({message: 'Link saved!', duration: 5000});
                        this.$emit('newLinkAdded', newLink);
                    })
                    .catch((err) => {
                        this.$message.error({message: err.message, duration: 5000});
                    })
                    .finally(() => {
                        this.loading = false;
                        this.url = '';
                        this.$emit('hide');
                    })
            },
            downloadLink(){
                if (!this.url)return;
                this.loadingText = 'Downloading now...';
                this.loading = true;
                const l = new Link({url: this.url, tags: this.tags});
                l.download(this).then((newLink) => {
                    console.log('result', newLink);
                    this.$message.success({message: 'Link downloaded!', duration: 5000});
                    this.$emit('newLinkAdded', newLink);
                }).catch((err) => {
                    this.$message.error({message: err.message, duration: 5000});
                }).finally(() => {
                    this.loading = false;
                    this.url = '';
                    this.$emit('hide');
                })
            }
        }
    }
</script>

<style scoped>

</style>