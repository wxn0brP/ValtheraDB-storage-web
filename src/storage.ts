import { CustomFileCpu } from "@wxn0brp/db-core";
import { CustomActionsBase } from "@wxn0brp/db-core/base/custom";

export class WebStorageActions extends CustomActionsBase {
    constructor(public name: string, private storage: Storage = localStorage) {
        super();
        this.fileCpu = new CustomFileCpu(this._read.bind(this), this._write.bind(this));
    }

    _getPath(collection: string) {
        return "vdb_" + this.name + "_" + collection;
    }

    _read(collection: string) {
        const data = this.storage.getItem(this._getPath(collection));
        return data ? JSON.parse(data) : [];
    }

    _write(collection: string, data: object[]) {
        this.storage.setItem(this._getPath(collection), JSON.stringify(data));
    }

    async ensureCollection(collection: string): Promise<boolean> {
        const key = this._getPath(collection);
        if (!this.storage.getItem(key)) this.storage.setItem(key, JSON.stringify([]));
        return true;
    }

    async issetCollection(collection: string): Promise<boolean> {
        return !!this.storage.getItem(this._getPath(collection));
    }

    async getCollections(): Promise<string[]> {
        const keys = [];
        const prefix = "vdb_" + this.name + "_";
        for (let i = 0; i < this.storage.length; i++) {
            const key = this.storage.key(i);
            if (key.startsWith(prefix)) keys.push(key.replace(prefix, ""));
        }
        return keys;
    }

    async removeCollection(collection: string): Promise<boolean> {
        this.storage.removeItem(this._getPath(collection));
        return true;
    }
}
