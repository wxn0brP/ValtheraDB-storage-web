import { CustomFileCpu } from "@wxn0brp/db-core";
import { CustomActionsBase } from "@wxn0brp/db-core/base/custom";
export class WebStorageActions extends CustomActionsBase {
    name;
    _storage;
    constructor(name, _storage = localStorage) {
        super();
        this.name = name;
        this._storage = _storage;
        this.fileCpu = new CustomFileCpu(this._read.bind(this), this._write.bind(this));
    }
    _getPath(collection) {
        return "vdb_" + this.name + "_" + collection;
    }
    _read(collection) {
        const data = this._storage.getItem(this._getPath(collection));
        return data ? JSON.parse(data) : [];
    }
    _write(collection, data) {
        this._storage.setItem(this._getPath(collection), JSON.stringify(data));
    }
    async ensureCollection(collection) {
        const key = this._getPath(collection);
        if (!this._storage.getItem(key))
            this._storage.setItem(key, JSON.stringify([]));
        return true;
    }
    async issetCollection(collection) {
        return !!this._storage.getItem(this._getPath(collection));
    }
    async getCollections() {
        const keys = [];
        const prefix = "vdb_" + this.name + "_";
        for (let i = 0; i < this._storage.length; i++) {
            const key = this._storage.key(i);
            if (key.startsWith(prefix))
                keys.push(key.replace(prefix, ""));
        }
        return keys;
    }
    async removeCollection(collection) {
        this._storage.removeItem(this._getPath(collection));
        return true;
    }
}
