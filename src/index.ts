import { forgeTypedValthera, ValtheraClass } from "@wxn0brp/db-core";
import { Collection } from "@wxn0brp/db-core/helpers/collection";
import { Data } from "@wxn0brp/db-core/types/data";
import { IndexedDBActions } from "./indexed";
import { WebStorageActions } from "./storage";

export * from "./indexed";
export * from "./storage";

export function createWebStorageValthera<T extends Record<string, Data[]>>(
	name: string,
	data?: T,
	storage: Storage = localStorage,
): ValtheraClass & { [K in keyof T]: Collection<T[K][number]> } {
	const db = new ValtheraClass({
		adapter: new WebStorageActions(name, storage),
	});
	if (!data) return forgeTypedValthera(db) as any;

	for (const collection of Object.keys(data)) {
		(db.adapter as WebStorageActions)._write(collection, data[collection]);
	}

	return forgeTypedValthera(db) as any;
}

export function createIndexedDBValthera<T extends Record<string, Data[]>>(
	name: string,
): ValtheraClass & { [K in keyof T]: Collection<T[K][number]> } {
	const db = new ValtheraClass({
		adapter: new IndexedDBActions(name),
	});

	return forgeTypedValthera(db) as any;
}
