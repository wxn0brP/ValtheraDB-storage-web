import { CustomFileCpu } from "@wxn0brp/db-core";
import { CustomActionsBase } from "@wxn0brp/db-core/base/custom";
import { VQuery } from "@wxn0brp/db-core/types/query";

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

    async ensureCollection(config: VQuery): Promise<boolean> {
        const key = this._getPath(config.collection);
        if (!this.storage.getItem(key)) this.storage.setItem(key, JSON.stringify([]));
        return true;
    }

    async issetCollection(config: VQuery): Promise<boolean> {
        return !!this.storage.getItem(this._getPath(config.collection));
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

    async removeCollection(config: VQuery): Promise<boolean> {
        this.storage.removeItem(this._getPath(config.collection));
        return true;
    }
}
