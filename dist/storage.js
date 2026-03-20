import { CustomFileCpu } from "@wxn0brp/db-core";
import { CustomActionsBase } from "@wxn0brp/db-core/base/custom";
export class WebStorageActions extends CustomActionsBase {
    name;
    storage;
    constructor(name, storage = localStorage) {
        super();
        this.name = name;
        this.storage = storage;
        this.fileCpu = new CustomFileCpu(this._read.bind(this), this._write.bind(this));
    }
    _getPath(collection) {
        return "vdb_" + this.name + "_" + collection;
    }
    _read(collection) {
        const data = this.storage.getItem(this._getPath(collection));
        return data ? JSON.parse(data) : [];
    }
    _write(collection, data) {
        this.storage.setItem(this._getPath(collection), JSON.stringify(data));
    }
    async ensureCollection(collection) {
        const key = this._getPath(collection);
        if (!this.storage.getItem(key))
            this.storage.setItem(key, JSON.stringify([]));
        return true;
    }
    async issetCollection(collection) {
        return !!this.storage.getItem(this._getPath(collection));
    }
    async getCollections() {
        const keys = [];
        const prefix = "vdb_" + this.name + "_";
        for (let i = 0; i < this.storage.length; i++) {
            const key = this.storage.key(i);
            if (key.startsWith(prefix))
                keys.push(key.replace(prefix, ""));
        }
        return keys;
    }
    async removeCollection(collection) {
        this.storage.removeItem(this._getPath(collection));
        return true;
    }
}
