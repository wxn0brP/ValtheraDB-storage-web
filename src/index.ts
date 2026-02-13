import { forgeValthera, ValtheraClass } from "@wxn0brp/db-core";
import { WebStorageActions } from "./storage";
import { Data } from "@wxn0brp/db-core/types/data";
import { Collection } from "@wxn0brp/db-core/helpers/collection";

export * from "./storage";

export function createWebStorageValthera<T extends Record<string, Data[]>>
    (name: string, data?: T, storage: Storage = localStorage): ValtheraClass & { [K in keyof T]: Collection<T[K][number]> } {

    const db = new ValtheraClass({
        dbAction: new WebStorageActions(name, storage)
    });
    if (!data) return forgeValthera(db) as any;

    for (const collection of Object.keys(data)) {
        (db.dbAction as WebStorageActions)._write(collection, data[collection]);
    }

    return forgeValthera(db) as any;
}
