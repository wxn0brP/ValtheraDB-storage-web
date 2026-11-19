import { ValtheraClass } from "@wxn0brp/db-core";
import { Data } from "@wxn0brp/db-core/types/data";
import { TypedValthera } from "@wxn0brp/db-core/types/typed";
export * from "./indexed.js";
export * from "./storage.js";
export declare function createWebStorageValthera<T extends Record<string, Data[]>>(name: string, data?: T, storage?: Storage): TypedValthera<T, ValtheraClass>;
export declare function createIndexedDBValthera<T extends Record<string, Data[]>>(name: string): TypedValthera<T, ValtheraClass>;
