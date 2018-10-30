import {loadAllTags} from "../../model/Tag";

export default {
    data(){
        return {
            allTags: [],
            inputValue: ''
        }
    },
    mounted(){
        loadAllTags().then(tags => {this.allTags = tags})
    },
    methods:{
        handleClose(tag) {
            const closedTag = this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)[0];
            this.allTags.push(closedTag)
        },
        querySearch(queryString, cb) {
            const tags = this.allTags;
            const value = queryString.toLowerCase();
            const results = value ? tags.filter(tag => tag.name.toLowerCase().indexOf(value) !== -1) : tags;
            // call callback function to return suggestions
            cb(results);
        },
        inputClearAndFocus(){
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
            this.inputValue = '';
        },
        handleSelect(item) {
            console.log(item);
            const indexClicked = this.allTags.findIndex(tag => tag.name===item.name);
            if(indexClicked !== -1){
                const elemClicked = this.allTags.splice(indexClicked, 1)[0];
                this.dynamicTags.push(elemClicked);
                this.inputClearAndFocus();
            }
        }
    }
}