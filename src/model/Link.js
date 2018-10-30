// import db from 'db'
import {IndexedDbOptions} from "./db";
import db from "./db";
import * as path from 'path'
import scrape from 'website-scraper'
import extractor from 'unfluff'
import uuid from 'uuid/v4'
import jp from 'fs-jetpack'
import Tag from "./Tag";

export default class Link {
    constructor(args) {
        this.title = args.title;
        this.url = args.url;
        this.desc = args.desc;
        this.text = args.text;
        this._id = args._id;
        this.created = new Date();
        this.tags = args.tags || [];
        this.downloaded = args.downloaded || false;
        this.pathToDownload = args.pathToDownload || null;
        this.offlineLink = args.offlineLink || null;
    }
    goToPage(){
        return this.offlineLink || this.url;
    }
    get Tags(){
        return this.tags.map(tag => new Tag({name: tag}))
    }
    save() {
        console.log('save');
        return new Promise((resolve, reject) => {
            const tmpPath = path.join(IndexedDbOptions.TMP_PATH, uuid());
            const scrapeOptions = {
                urls: [this.url],
                directory: tmpPath,
                sources: [],
                onResourceError: (resource, err) => {
                    throw new Error(err.message)
                },
            };
            scrape(scrapeOptions, (error, result) => {
                if (error) return reject(error);
                if (result.length > 0) {
                    // const resource = result[0];
                    const html = jp.read(path.join(tmpPath, 'index.html'), 'utf-8');
                    const parsedHtml = extractor.lazy(html);
                    // const parsedHtml = parse.parsePrincipalData(resource.text);
                    this.title = parsedHtml.title();
                    this.desc = parsedHtml.description();
                    // this.text = text;
                    db.links.insert(this, (err, newLink) => {
                        if (err) return reject(err);
                        jp.removeAsync(tmpPath);
                        return resolve(newLink)
                    })
                }
            });
        })
    }

    async download() {
        const taggyLinkToDownload = (this._id && !this.downloaded) ? this : null;
        console.log('taggyLinkToDownload',taggyLinkToDownload);
        // if (taggyLinkToDownload === null)
        const savedTaggyLink = taggyLinkToDownload === null ? await this.save() : taggyLinkToDownload;
        console.log('savedTaggyLink',savedTaggyLink);
        // console.log('download', savedLink, IndexedDbOptions.DOWNLOAD_PATH);
        const pathToDownload = path.join(IndexedDbOptions.DOWNLOAD_PATH, savedTaggyLink._id);
        const offlineLink = `file:///${pathToDownload}/index.html`;
        const options = {
            urls: [savedTaggyLink.url],
            directory: pathToDownload,
            onResourceError: (resource, err) => {
                throw new Error(err.message)
            },
        };
        return new Promise((resolve, reject) => {
            scrape(options, (error, result) => {
                console.log('scrape error', error);
                if (error) return reject(error);
                savedTaggyLink.downloaded = true;
                savedTaggyLink.pathToDownload = pathToDownload;
                savedTaggyLink.offlineLink = offlineLink;
                db.links.update({ _id: savedTaggyLink._id }, savedTaggyLink, {}, function (err, numReplaced) {
                    console.log('actualizado link offline', numReplaced);
                    return resolve(savedTaggyLink)
                });
            });
        })
    }
}

export const loadAllLinks = () => {
    return new Promise((resolve, reject) => {
        db.links.find({}, (err, docs) => {
            if (err)
                return reject(err);
            return resolve(docs.map(link => new Link(link)))
        })
    })
};

export const removeLinkById = ({_id, pathToDownload, downloaded}) => {
    return new Promise((resolve, reject) => {
        db.links.remove({_id}, {}, function (err, numRemoved) {
            if (err) return reject(err);
            downloaded && jp.removeAsync(pathToDownload);
            return resolve(numRemoved)
        });
    })
};

export const findLinkById = (_id) => {
    return new Promise((resolve, reject) => {
        db.links.findOne({_id}, (err, link) => {
            if(err)return reject(err);
            return resolve(new Link(link))
        })
    })
};

export const findLink = (query) => {
    return new Promise((resolve, reject) => {
        db.links.find(query, (err, docs) => {
            if (err)
                return reject(err);
            return resolve(docs.map(link => new Link(link)))
        })
    })
};