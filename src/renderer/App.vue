<template>
    <div id="app">
        <nav-menu @saveUrlF="saveUrlModal"/>

        <el-tabs v-model="tabActiveName" type="card" closable @tab-remove="removeTab">
            <el-tab-pane label="Home" name="home_tab" style="padding: 5px">
                <search @itemsFound="(linksFound)=>{this.links = linksFound}"></search>
                <el-card v-if="!links.length" class="box-card" style="padding-bottom: 50px;padding-top: 50px;background-color: rgba(204, 204, 204, 0.10);text-align: center;box-shadow: none;margin: 50px">
                    <p style="font-size: 28px;padding: 0;margin: 0;color:#555">You don't have any link saved yet!</p>
                    <p style="font-size: 14px;padding: 0;margin: 0;color:#959595">You can start by clicking this button</p>
                    <br>
                    <el-button type="primary" size="large" icon="el-icon-download" @click="saveUrlModal">Add your first link</el-button>
                </el-card>
                <ul class="ul-style-none" v-else>
                    <li v-for="link in links" :key="link.title" @click="addTab(link._id)">
                        <taggy-link :link="link" @removeLinkFromList="handleRemoveLinkFromList"></taggy-link>
                    </li>
                </ul>
            </el-tab-pane>
            <el-tab-pane v-for="(item, index) in editableTabs2" :key="index" :label="item.title" :name="item.name" v-loading="tabLoading" :element-loading-text="tabLoadingText">
                <div></div>
                <webview :id="item.title" :ref="item.title" :src="item.url" style="display:inline-flex; width:100%;height: 80vh" ></webview>
            </el-tab-pane>
        </el-tabs>
        <save-url-modal :show="showSaveUrlModal" @hide="()=>this.showSaveUrlModal=false" @newLinkAdded="handleNewSavedLink"></save-url-modal>

    </div>
</template>

<script>
    import NavMenu from './components/NavMenu.vue';
    import SaveUrlModal from './components/saveUrlModal/SaveUrlModal'
    import TaggyLink from './components/TaggyLink'
    import {loadAllLinks, findLinkById} from "../model/Link";
    import Search from "./components/home/Search";

    export default {
        name: 'taggy',
        data() {
            return {
                showPage: false,
                loading: false,
                // url: "http://localhost",
                showSaveUrlModal: false,
                links: [],
                tabActiveName: 'home_tab',
                editableTabs2: [],
                tabLoading: false,
                tabLoadingText: ''
            }
        },
        components: {Search, SaveUrlModal, NavMenu, TaggyLink},
        mounted() {
            loadAllLinks().then(links => {this.links = links})
        },
        methods: {
            saveUrlModal() {
                this.showSaveUrlModal = true;
            },
            handleNewSavedLink(newLink){
                console.log('newLink', newLink);
                this.links.push(newLink)
            },
            handleRemoveLinkFromList(removedLink){
                this.links = this.links.filter((link) => link._id !== removedLink._id)
            },
            showLoadingTab(link){
                this.tabLoading = true;
                this.tabLoadingText = 'Loading from ' + (link.downloaded ? 'your saved copy' : link.url);
                setTimeout(() => this.tabLoading = false, 5000)
            },
            addTab(_id) {
                // console.log('addTab', _id);
                findLinkById(_id)
                    .then(link => {
                        let newTabName = link._id;
                        this.showLoadingTab(link);
                        this.editableTabs2.push({
                            title: link.title,
                            name: newTabName,
                            url: link.goToPage(),
                            _id: link._id
                        });
                        this.tabActiveName = newTabName;
                    })
                    .catch(() => {})
            },
            removeTab(targetName) {
                let tabs = this.editableTabs2;
                let activeName = this.tabActiveName;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab._id;
                            }else{
                                activeName = 'home_tab'
                            }
                        }
                    });
                }
                this.tabActiveName = activeName;
                this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
            }
        }
    }
</script>

<style>
    ul.ul-style-none{
        list-style-type: none;
        padding: 0;
    }

</style>
