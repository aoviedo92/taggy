import Datastore from 'nedb'
const DB_PATH = 'd:/taggy/';
const db = {};
db.links = new Datastore(DB_PATH + 'links.nedb');
db.tags = new Datastore(DB_PATH + 'tags.nedb');
// db.options = new Datastore(DB_PATH + 'options.nedb');

// You need to load each database (here we do it asynchronously)
db.links.loadDatabase();
db.tags.loadDatabase();
// db.options.loadDatabase();
export const IndexedDbOptions = {
    DB_PATH,
    DOWNLOAD_PATH: DB_PATH + "data",
    TMP_PATH: DB_PATH + "tmp",
};
export default db;