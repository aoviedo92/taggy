import db from "./db";

export default class Tag {
    constructor(args){
        this.name = args.name;
        // this.color = Tag.getRandomColor();
    }

    get color() {
        const colors = ['danger', 'warning', 'success', 'gray', 'primary'];
        const indexColor = Math.round(Math.random() * (colors.length - 1));
        return colors[indexColor];
    }
    get value(){//para los autocompletes hace falta el attr value
        return this.name;
    }
    getCantLinks(){
        return 0
    }

    insert(){
        return new Promise((resolve, reject) => {
            db.tags.insert(this, (err, newTag) => {
                if (err) return reject(err);
                return resolve(newTag)
            })
        })
    }
}

export const loadAllTags = () => {
    return new Promise((resolve, reject) => {
        db.tags.find({}, (err, docs) => {
            if (err)
                return reject(err);
            return resolve(docs.map(tag => new Tag(tag)))
        })
    })
};

export const findTag = (query) => {
    return new Promise((resolve, reject) => {
        db.tags.find(query, (err, docs) => {
            if (err)
                return reject(err);
            return resolve(docs.map(tag => new Tag(tag)))
        })
    })
};