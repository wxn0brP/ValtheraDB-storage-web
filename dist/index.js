import { forgeValthera, ValtheraClass } from "@wxn0brp/db-core";
import { WebStorageActions } from "./storage.js";
export * from "./storage.js";
export function createWebStorageValthera(name, data, storage = localStorage) {
    const db = new ValtheraClass({
        dbAction: new WebStorageActions(name, storage)
    });
    if (!data)
        return forgeValthera(db);
    for (const collection of Object.keys(data)) {
        db.dbAction._write(collection, data[collection]);
    }
    return forgeValthera(db);
}
