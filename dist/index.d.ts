import { ValtheraClass } from "@wxn0brp/db-core";
import { Collection } from "@wxn0brp/db-core/helpers/collection";
import { Data } from "@wxn0brp/db-core/types/data";
export * from "./indexed.js";
export * from "./storage.js";
export declare function createWebStorageValthera<T extends Record<string, Data[]>>(name: string, data?: T, storage?: Storage): ValtheraClass & {
    [K in keyof T]: Collection<T[K][number]>;
};
export declare function createIndexedDBValthera<T extends Record<string, Data[]>>(name: string): ValtheraClass & {
    [K in keyof T]: Collection<T[K][number]>;
};
