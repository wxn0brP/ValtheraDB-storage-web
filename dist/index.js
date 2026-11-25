import { forgeTypedValthera, ValtheraClass } from "@wxn0brp/db-core";
import { IndexedDBActions } from "./indexed.js";
import { WebStorageActions } from "./storage.js";
export * from "./indexed.js";
export * from "./storage.js";
export function createWebStorageValthera(name, data, storage = localStorage) {
    const db = new ValtheraClass({
        adapter: new WebStorageActions(name, storage),
    });
    if (!data)
        return forgeTypedValthera(db);
    for (const collection of Object.keys(data)) {
        db.adapter._write(collection, data[collection]);
    }
    return forgeTypedValthera(db);
}
export function createIndexedDBValthera(name) {
    const db = new ValtheraClass({
        adapter: new IndexedDBActions(name),
    });
    return forgeTypedValthera(db);
}
