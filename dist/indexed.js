import { ActionsBase } from "@wxn0brp/db-core/base/actions";
import { addId } from "@wxn0brp/db-core/helpers/addId";
import { findObj, matchObj, updateObj } from "@wxn0brp/db-core/utils/process";
export class IndexedDBActions extends ActionsBase {
    name;
    db = null;
    _version = 1;
    _inited = false;
    constructor(name) {
        super();
        this.name = name;
    }
    _getDBName() {
        return "vdb_" + this.name;
    }
    async init() {
        if (this.db)
            return;
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this._getDBName());
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                this._version = this.db.version;
                this._loadVersion()
                    .then(() => resolve())
                    .catch(reject);
            };
            request.onupgradeneeded = event => {
                const db = request.result;
                this._version = db.version;
                if (!db.objectStoreNames.contains("_meta")) {
                    db.createObjectStore("_meta");
                }
            };
        });
    }
    async _loadVersion() {
        if (!this.db)
            return;
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("_meta", "readonly");
            const store = tx.objectStore("_meta");
            const request = store.get("version");
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this._version = request.result || 1;
                resolve();
            };
        });
    }
    async _saveVersion() {
        if (!this.db)
            return;
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction("_meta", "readwrite");
            const store = tx.objectStore("_meta");
            const request = store.put(this._version, "version");
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
    async close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
    async _changeSchema(upgradeFn) {
        if (!this.db)
            throw new Error("Database not initialized");
        const newVersion = this.db.version + 1;
        this.db.close();
        this.db = null;
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this._getDBName(), newVersion);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                this._version = this.db.version;
                this._saveVersion()
                    .then(() => resolve())
                    .catch(reject);
            };
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains("_meta")) {
                    db.createObjectStore("_meta");
                }
                upgradeFn(db);
            };
        });
    }
    async _getStore(collection, mode) {
        if (!this.db)
            throw new Error("Database not initialized");
        const tx = this.db.transaction(collection, mode);
        return tx.objectStore(collection);
    }
    async _getAllEntries(collection) {
        const store = await this._getStore(collection, "readonly");
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);
        });
    }
    async ensureCollection(collection) {
        if (!this.db)
            throw new Error("Database not initialized");
        if (this.db.objectStoreNames.contains(collection))
            return false;
        await this._changeSchema(db => {
            if (!db.objectStoreNames.contains(collection)) {
                db.createObjectStore(collection, {
                    keyPath: "_id",
                });
            }
        });
        return true;
    }
    async issetCollection(collection) {
        if (!this.db)
            throw new Error("Database not initialized");
        return this.db.objectStoreNames.contains(collection);
    }
    async getCollections() {
        if (!this.db)
            throw new Error("Database not initialized");
        const collections = [];
        for (let i = 0; i < this.db.objectStoreNames.length; i++) {
            const name = this.db.objectStoreNames.item(i);
            if (name && name !== "_meta") {
                collections.push(name);
            }
        }
        return collections;
    }
    async removeCollection(collection) {
        if (!this.db)
            throw new Error("Database not initialized");
        if (!this.db.objectStoreNames.contains(collection))
            return false;
        await this._changeSchema(db => {
            if (db.objectStoreNames.contains(collection)) {
                db.deleteObjectStore(collection);
            }
        });
        return true;
    }
    async add(query) {
        if (!this.db)
            throw new Error("Database not initialized");
        await this.ensureCollection(query.collection);
        await addId(query, this);
        const { collection, data } = query;
        const store = await this._getStore(collection, "readwrite");
        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(data);
        });
    }
    async find(query) {
        if (!this.db)
            throw new Error("Database not initialized");
        await this.ensureCollection(query.collection);
        const entries = await this._getAllEntries(query.collection);
        return entries.map(entry => findObj(query, entry)).filter(Boolean);
    }
    async findOne(query) {
        if (!this.db)
            throw new Error("Database not initialized");
        await this.ensureCollection(query.collection);
        const entries = await this._getAllEntries(query.collection);
        for (const entry of entries) {
            const result = findObj(query, entry);
            if (result)
                return result;
        }
        return null;
    }
    async update(query) {
        if (!this.db)
            throw new Error("Database not initialized");
        await this.ensureCollection(query.collection);
        const store = await this._getStore(query.collection, "readwrite");
        const entries = await new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);
        });
        const updated = [];
        for (const entry of entries) {
            if (matchObj(query, entry)) {
                const updatedEntry = updateObj(query, entry);
                updated.push(updatedEntry);
                await new Promise((resolve, reject) => {
                    const putRequest = store.put(updatedEntry);
                    putRequest.onerror = () => reject(putRequest.error);
                    putRequest.onsuccess = () => resolve();
                });
            }
        }
        return updated;
    }
    async updateOne(query) {
        if (!this.db)
            throw new Error("Database not initialized");
        await this.ensureCollection(query.collection);
        const store = await this._getStore(query.collection, "readwrite");
        const entries = await new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);
        });
        for (const entry of entries) {
            if (matchObj(query, entry)) {
                const updatedEntry = updateObj(query, entry);
                await new Promise((resolve, reject) => {
                    const putRequest = store.put(updatedEntry);
                    putRequest.onerror = () => reject(putRequest.error);
                    putRequest.onsuccess = () => resolve();
                });
                return updatedEntry;
            }
        }
        return null;
    }
    async remove(query) {
        if (!this.db)
            throw new Error("Database not initialized");
        await this.ensureCollection(query.collection);
        const store = await this._getStore(query.collection, "readwrite");
        const entries = await new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);
        });
        const removed = [];
        for (const entry of entries) {
            if (matchObj(query, entry)) {
                removed.push(entry);
                await new Promise((resolve, reject) => {
                    const deleteRequest = store.delete(entry._id);
                    deleteRequest.onerror = () => reject(deleteRequest.error);
                    deleteRequest.onsuccess = () => resolve();
                });
            }
        }
        return removed;
    }
    async removeOne(query) {
        if (!this.db)
            throw new Error("Database not initialized");
        await this.ensureCollection(query.collection);
        const store = await this._getStore(query.collection, "readwrite");
        const entries = await new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || []);
        });
        for (const entry of entries) {
            if (matchObj(query, entry)) {
                await new Promise((resolve, reject) => {
                    const deleteRequest = store.delete(entry._id);
                    deleteRequest.onerror = () => reject(deleteRequest.error);
                    deleteRequest.onsuccess = () => resolve();
                });
                return entry;
            }
        }
        return null;
    }
}
